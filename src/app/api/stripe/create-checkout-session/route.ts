import { NextRequest, NextResponse } from 'next/server'
import { validateCheckout } from '@/lib/validations'
import { PaymentService } from '@/services/payment.service'
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

    // Mantém o endpoint legado, mas delega a criação ao mesmo serviço/catálogo
    // usado pelo checkout atual para evitar divergência de preços.
    const { plan } = validateCheckout(body)
    const checkout = await new PaymentService().createCheckout({
      userId: user.id,
      userEmail: user.email,
      userName: user.name || undefined,
      plan,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/canceled`,
    })

    return NextResponse.json({ url: checkout.url, sessionId: checkout.sessionId, provider: checkout.provider })
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
