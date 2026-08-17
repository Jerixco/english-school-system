import { prisma } from '@/lib/prisma'
import { isPurchasablePlan, PurchasablePlan } from '@/lib/plans'
import { sendPaymentConfirmationEmail } from '@/lib/email'
import { Plan, PaymentStatus } from '@prisma/client'
import crypto from 'crypto'

export interface CheckoutRequest {
  userId: string
  userEmail: string
  userName?: string
  plan: PurchasablePlan
  successUrl?: string
  cancelUrl?: string
}

export interface CheckoutResponse {
  url: string
  sessionId: string
  provider: 'stripe' | 'sandbox'
}

export interface WebhookPaymentEvent {
  transactionId: string
  userId: string
  plan: PurchasablePlan
  amountInCents: number
  currency: string
  paymentMethod: string
  status: PaymentStatus
}

/**
 * Catálogo canônico de preços no servidor (em centavos de Real BRL).
 * Impede manipulação ou injeção de valores pelo cliente.
 */
export const SERVER_PLAN_PRICES: Record<PurchasablePlan, { amount: number; name: string; currency: string }> = {
  BASIC: { amount: 29700, name: 'Plano Básico', currency: 'BRL' },
  STANDARD: { amount: 49700, name: 'Plano Padrão', currency: 'BRL' },
  PREMIUM: { amount: 79700, name: 'Plano Premium', currency: 'BRL' },
}

/**
 * Interface do Gateway de Pagamentos (Adapter Pattern).
 */
export interface PaymentGateway {
  name: 'stripe' | 'sandbox'
  createCheckout(req: CheckoutRequest): Promise<CheckoutResponse>
  processWebhook(payload: any, signature?: string): Promise<{ processed: boolean; paymentId?: string }>
}

/**
 * Adapter do Stripe: Criação e orquestração de sessões de checkout em produção.
 */
export class StripePaymentAdapter implements PaymentGateway {
  name = 'stripe' as const

  async createCheckout(req: CheckoutRequest): Promise<CheckoutResponse> {
    const planInfo = SERVER_PLAN_PRICES[req.plan]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { stripe, getStripeCustomerId } = await import('@/lib/stripe')
    const customerId = await getStripeCustomerId(req.userEmail, req.userName)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: planInfo.currency.toLowerCase(),
            product_data: {
              name: planInfo.name,
              description: `Assinatura ${planInfo.name} - English School`,
            },
            unit_amount: planInfo.amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: req.successUrl || `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.cancelUrl || `${appUrl}/planos`,
      metadata: {
        userId: req.userId,
        plan: req.plan,
      },
      subscription_data: {
        metadata: {
          userId: req.userId,
          plan: req.plan,
        },
      },
    })

    if (!session.url) {
      throw new Error('Falha ao gerar URL de checkout do Stripe')
    }

    return {
      url: session.url,
      sessionId: session.id,
      provider: 'stripe',
    }
  }

  async processWebhook(payload: any): Promise<{ processed: boolean; paymentId?: string }> {
    return { processed: true }
  }
}

/**
 * Adapter do Sandbox: Permite testes e validações completas sem necessidade de credenciais de produção.
 */
export class SandboxPaymentAdapter implements PaymentGateway {
  name = 'sandbox' as const

  private static getSecret(): string {
    const secret = process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'test' ? 'sandbox-test-secret-key-32chars' : '')
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET não configurado para assinatura do sandbox de pagamentos.')
    }
    return secret
  }

  private signSession(data: any): string {
    const secret = SandboxPaymentAdapter.getSecret()
    const payload = Buffer.from(JSON.stringify(data)).toString('base64url')
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
    return `${payload}.${signature}`
  }

  static verifySessionToken(token: string): any | null {
    try {
      const [payload, signature] = token.split('.')
      if (!payload || !signature) return null

      const secret = SandboxPaymentAdapter.getSecret()
      const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url')

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null
      }

      const sessionData = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))

      // Expiração de segurança: rejeitar tokens criados há mais de 1 hora (3600000 ms)
      const MAX_AGE_MS = 60 * 60 * 1000
      if (!sessionData.createdAt || Date.now() - sessionData.createdAt > MAX_AGE_MS) {
        return null
      }

      return sessionData
    } catch {
      return null
    }
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutResponse> {
    const planInfo = SERVER_PLAN_PRICES[req.plan]
    const sessionId = `sbx_sess_${crypto.randomBytes(16).toString('hex')}`
    
    const sessionData = {
      sessionId,
      userId: req.userId,
      userEmail: req.userEmail,
      userName: req.userName,
      plan: req.plan,
      amount: planInfo.amount,
      currency: planInfo.currency,
      createdAt: Date.now(),
    }

    const token = this.signSession(sessionData)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const checkoutUrl = `${appUrl}/checkout/sandbox?session_token=${token}`

    return {
      url: checkoutUrl,
      sessionId,
      provider: 'sandbox',
    }
  }

  async processWebhook(payload: any): Promise<{ processed: boolean; paymentId?: string }> {
    return { processed: true }
  }
}

/**
 * Serviço Principal de Pagamentos (Orquestrador de Negócio com Idempotência e Auditoria).
 */
export class PaymentService {
  private gateway: PaymentGateway

  constructor(gateway?: PaymentGateway) {
    if (gateway) {
      this.gateway = gateway
    } else {
      // Se STRIPE_SECRET_KEY estiver presente e não for placeholder, usa Stripe; senão, usa Sandbox Seguro
      const hasRealStripeKey = 
        Boolean(process.env.STRIPE_SECRET_KEY) && 
        process.env.STRIPE_SECRET_KEY!.startsWith('sk_') &&
        !process.env.STRIPE_SECRET_KEY!.includes('mock') &&
        !process.env.STRIPE_SECRET_KEY!.includes('your_stripe')

      this.gateway = hasRealStripeKey ? new StripePaymentAdapter() : new SandboxPaymentAdapter()
    }
  }

  /**
   * Inicia o fluxo de checkout com resolução segura do plano no servidor.
   */
  async createCheckout(req: CheckoutRequest): Promise<CheckoutResponse> {
    if (!isPurchasablePlan(req.plan)) {
      throw new Error(`Plano inválido ou não disponível para compra: ${req.plan}`)
    }

    // 1. Garante que o estudante existe ou prepara o registro
    const student = await prisma.student.upsert({
      where: { userId: req.userId },
      update: {},
      create: {
        userId: req.userId,
        plan: req.plan as Plan,
        status: 'TRIAL',
      },
    })

    return this.gateway.createCheckout(req)
  }

  /**
   * Processa a confirmação de pagamento de forma estritamente idempotente.
   */
  async processSuccessfulPayment(event: WebhookPaymentEvent) {
    // 1. Busca o estudante associado
    const student = await prisma.student.findFirst({
      where: { userId: event.userId },
      include: { user: true },
    })

    if (!student) {
      console.warn(`PaymentService: Student not found for userId ${event.userId}`)
      return { success: false, reason: 'student_not_found' }
    }

    // 2. Verificação de Idempotência: Checa se este pagamento já foi gravado
    const existingPayment = await prisma.payment.findUnique({
      where: { stripePaymentId: event.transactionId },
    })

    if (existingPayment) {
      console.log(`PaymentService: Transaction ${event.transactionId} already processed, skipping duplicate`)
      return { success: true, alreadyProcessed: true, paymentId: existingPayment.id }
    }

    // 3. Atualiza o status e o plano do estudante
    await prisma.student.update({
      where: { id: student.id },
      data: {
        status: 'ACTIVE',
        plan: event.plan as Plan,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Próximo ciclo em 30 dias
      },
    })

    // 4. Registra o pagamento com valor validado
    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: event.amountInCents,
        currency: event.currency,
        status: event.status,
        paymentMethod: event.paymentMethod,
        stripePaymentId: event.transactionId,
        dueDate: new Date(),
        paidAt: new Date(),
      },
    })

    // 5. Envia e-mail de confirmação se disponível
    if (student.user.email) {
      sendPaymentConfirmationEmail(
        student.user.email,
        student.user.name || 'Aluno',
        event.amountInCents / 100,
        event.plan
      ).catch((err) => console.error('PaymentService: Failed to send email confirmation:', err))
    }

    return { success: true, paymentId: payment.id }
  }
}
