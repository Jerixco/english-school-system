export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, logAuditAction } from '@/lib/security'
import { checkRateLimit, stripeRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { PaymentService, SERVER_PLAN_PRICES } from '@/services/payment.service'
import { isPurchasablePlan } from '@/lib/plans'
import { z } from 'zod'

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(stripeRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'checkout_create', { reason: 'rate_limit' }, req, 'failure')
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde antes de tentar novamente.' },
        { status: 429 }
      )
    }

    // 2. Autenticação obrigatória (impede iniciar compras em nome de terceiros)
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'checkout_create', { reason: 'unauthenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária para iniciar a assinatura.' },
        { status: 401 }
      )
    }

    // 3. Validação do body
    const body = await req.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Plano inválido ou não especificado.', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { plan } = parsed.data
    const paymentService = new PaymentService()

    const checkoutSession = await paymentService.createCheckout({
      userId: user.id,
      userEmail: user.email,
      userName: user.name || undefined,
      plan,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/planos`,
    })

    await logAuditAction(
      user.id,
      'checkout_create',
      { plan, provider: checkoutSession.provider, sessionId: checkoutSession.sessionId },
      req,
      'success'
    )

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.sessionId,
      provider: checkoutSession.provider,
    })
  } catch (error: unknown) {
    console.error('Erro ao gerar checkout:', error)
    return NextResponse.json(
      { error: 'Erro ao processar checkout' },
      { status: 500 }
    )
  }
}
