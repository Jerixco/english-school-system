import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getStripeCustomerId } from '@/lib/stripe'
import { validateCheckout } from '@/lib/validation'
import { checkRateLimit, stripeRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(stripeRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toISOString() || '',
          }
        }
      )
    }

    const body = await req.json()
    
    // Validate input
    const validatedData = validateCheckout(body)

    const customerId = await getStripeCustomerId(validatedData.email, validatedData.name)

    const session = await createCheckoutSession(
      customerId,
      validatedData.priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_APP_URL}/canceled`
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
