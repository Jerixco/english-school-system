import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmationEmail } from '@/lib/email'
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

        if (customerEmail) {
          const student = await prisma.student.findFirst({
            where: { user: { email: customerEmail.toLowerCase() } },
            include: { user: true },
          })

          if (student) {
            await prisma.student.update({
              where: { id: student.id },
              data: {
                status: 'ACTIVE',
                customerId,
                subscriptionId,
              },
            })

            const amountTotal = (session.amount_total || 0) / 100
            await prisma.payment.create({
              data: {
                studentId: student.id,
                amount: amountTotal,
                currency: session.currency?.toUpperCase() || 'BRL',
                status: 'COMPLETED',
                paymentMethod: session.payment_method_types[0] || 'card',
                stripePaymentId: session.payment_intent as string || session.id,
                dueDate: new Date(),
                paidAt: new Date(),
              },
            })

            await sendPaymentConfirmationEmail(
              student.user.email,
              student.user.name || 'Aluno',
              amountTotal,
              student.plan
            ).catch((e) => console.error('Failed to send payment confirmation email:', e))
          }
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
