export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, logAuditAction } from '@/lib/security'
import { checkRateLimit, stripeRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { SandboxPaymentAdapter, PaymentService, SERVER_PLAN_PRICES } from '@/services/payment.service'
import { z } from 'zod'

const sandboxSubmitSchema = z.object({
  sessionToken: z.string().min(10),
  action: z.enum(['approve', 'decline', 'cancel']),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(stripeRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'sandbox_payment_submit', { reason: 'rate_limit' }, req, 'failure')
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde antes de tentar novamente.' },
        { status: 429 }
      )
    }

    // 2. Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // 3. Validação do body
    const body = await req.json()
    const parsed = sandboxSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const { sessionToken, action } = parsed.data
    const sessionData = SandboxPaymentAdapter.verifySessionToken(sessionToken)

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Sessão de pagamento inválida ou expirada (Assinatura HMAC falhou ou tempo limite de 1h excedido).' },
        { status: 400 }
      )
    }

    // 4. IDOR Check: Confirma se o usuário logado é o mesmo da sessão de checkout
    if (sessionData.userId !== user.id) {
      await logAuditAction(
        user.id,
        'sandbox_payment_tamper',
        { sessionUserId: sessionData.userId, currentUserId: user.id },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Você não tem permissão para processar esta sessão de checkout.' },
        { status: 403 }
      )
    }

    if (action === 'cancel') {
      return NextResponse.json({
        status: 'CANCELED',
        redirectUrl: '/planos',
      })
    }

    if (action === 'decline') {
      return NextResponse.json({
        status: 'FAILED',
        error: 'Pagamento recusado pela operadora simulada (Sandbox).',
      })
    }

    // 5. Processa pagamento com sucesso de forma idempotente
    const paymentService = new PaymentService()
    const result = await paymentService.processSuccessfulPayment({
      transactionId: `sbx_tx_${sessionData.sessionId}`,
      userId: user.id,
      plan: sessionData.plan,
      amountInCents: sessionData.amount,
      currency: sessionData.currency,
      paymentMethod: 'sandbox_card',
      status: 'COMPLETED',
    })

    await logAuditAction(
      user.id,
      'sandbox_payment_completed',
      { plan: sessionData.plan, amount: sessionData.amount, paymentId: result.paymentId },
      req,
      'success'
    )

    return NextResponse.json({
      status: 'COMPLETED',
      message: 'Pagamento simulado processado com sucesso! Sua matrícula foi ativada.',
      redirectUrl: '/aluno',
    })
  } catch (error: any) {
    console.error('Erro ao processar sandbox payment:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento simulado' },
      { status: 500 }
    )
  }
}
