import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getStripeCustomerId } from '@/lib/stripe'
import { validateCheckout } from '@/lib/validations'
import { getPriceIdForPlan } from '@/lib/plans'
import { getAuthenticatedUser } from '@/lib/security'
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

    // Autenticação obrigatória — o checkout é sempre para o usuário logado.
    // Impede que um atacante inicie assinaturas em nome de terceiros.
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Valida apenas a chave do plano; o priceId é resolvido no servidor.
    const { plan } = validateCheckout(body)
    const priceId = getPriceIdForPlan(plan)

    if (!priceId) {
      return NextResponse.json(
        { error: 'Plano indisponível' },
        { status: 400 }
      )
    }

    const customerId = await getStripeCustomerId(user.email, user.name || undefined)

    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_APP_URL}/canceled`,
      { userId: user.id, plan }
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
