import { prisma } from '@/lib/prisma'
import { isPurchasablePlan } from '@/lib/plans'
import { sendPaymentConfirmationEmail } from '@/lib/email'
import { Plan } from '@prisma/client'
import Stripe from 'stripe'

export class StripeService {
  /**
   * Processa a finalização de um checkout bem-sucedido.
   */
  async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string
    const customerEmail = session.customer_details?.email
    const metadataUserId = session.metadata?.userId
    const metadataPlan = session.metadata?.plan

    // 1. Busca o estudante (preferência por metadataUserId confiável)
    const student = metadataUserId
      ? await prisma.student.findFirst({
          where: { userId: metadataUserId },
          include: { user: true },
        })
      : customerEmail
        ? await prisma.student.findFirst({
            where: { user: { email: customerEmail.toLowerCase() } },
            include: { user: true },
          })
        : null

    if (!student) {
      console.warn(`StripeService: Student not found for session ${session.id}`)
      return
    }

    // 2. Verificação de Idempotência
    const stripePaymentId = (session.payment_intent as string) || session.id
    const existingPayment = await prisma.payment.findUnique({
      where: { stripePaymentId },
    })

    if (existingPayment) {
      console.log(`StripeService: Payment ${stripePaymentId} already processed, skipping`)
      return
    }

    // 3. Atualiza o perfil do estudante
    const planUpdate =
      metadataPlan && isPurchasablePlan(metadataPlan)
        ? { plan: metadataPlan as Plan }
        : {}

    await prisma.student.update({
      where: { id: student.id },
      data: {
        status: 'ACTIVE',
        customerId,
        subscriptionId,
        ...planUpdate,
      },
    })

    // 4. Registra o pagamento (schema usa centavos)
    const amountInCents = session.amount_total || 0
    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: amountInCents,
        currency: session.currency?.toUpperCase() || 'BRL',
        status: 'COMPLETED',
        paymentMethod: session.payment_method_types[0] || 'card',
        stripePaymentId,
        dueDate: new Date(),
        paidAt: new Date(),
      },
    })

    // 5. Notificação assíncrona
    await sendPaymentConfirmationEmail(
      student.user.email,
      student.user.name || 'Aluno',
      amountInCents / 100,
      student.plan
    ).catch((e) => console.error('StripeService: Failed to send payment confirmation email:', e))
  }

  /**
   * Atualiza o status do estudante com base na assinatura do Stripe.
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    const status = subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE'

    const student = await prisma.student.findFirst({
      where: { customerId },
    })

    if (student) {
      await prisma.student.update({
        where: { id: student.id },
        data: { status },
      })
    }
  }

  /**
   * Trata o cancelamento/deleção de uma assinatura.
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string

    const student = await prisma.student.findFirst({
      where: { customerId },
    })

    if (student) {
      await prisma.student.update({
        where: { id: student.id },
        data: { status: 'INACTIVE' },
      })
    }
  }
}
