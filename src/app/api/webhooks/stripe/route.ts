import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmationEmail } from '@/lib/email'
import { isPurchasablePlan } from '@/lib/plans'
import { Plan } from '@prisma/client'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const customerEmail = session.customer_details?.email
        const metadataUserId = session.metadata?.userId
        const metadataPlan = session.metadata?.plan

        // Prefere casar pelo userId confiável gravado na metadata do checkout;
        // cai para o email apenas como último recurso.
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

        if (student) {
          // Idempotência: não processa o mesmo pagamento duas vezes.
          const stripePaymentId = (session.payment_intent as string) || session.id
          const existingPayment = await prisma.payment.findUnique({
            where: { stripePaymentId },
          })

          if (existingPayment) {
            console.log(`Payment ${stripePaymentId} already processed, skipping`)
            break
          }

          // Plano derivado da metadata confiável (definida no servidor no checkout).
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

          // amount_total já vem em centavos; o schema Payment.amount é Int (centavos).
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

          await sendPaymentConfirmationEmail(
            student.user.email,
            student.user.name || 'Aluno',
            amountInCents / 100,
            student.plan
          ).catch((e) => console.error('Failed to send payment confirmation email:', e))
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
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
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
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
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing Stripe webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
