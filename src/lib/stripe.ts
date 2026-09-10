import Stripe from 'stripe'
import crypto from 'crypto'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const getStripeCustomerId = async (email: string, name?: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const customers = await stripe.customers.list({ email: normalizedEmail, limit: 1 })
    
    if (customers.data.length > 0) {
      return customers.data[0].id
    }

    const customer = await stripe.customers.create({
      email: normalizedEmail,
      name: name || '',
    }, {
      // Evita clientes duplicados quando dois checkouts concorrentes não
      // encontram um cliente existente ao mesmo tempo.
      idempotencyKey: `customer-${crypto.createHash('sha256').update(normalizedEmail).digest('hex')}`,
    })

    return customer.id
  } catch (error) {
    console.error('Error creating/getting Stripe customer:', error)
    throw error
  }
}

export const createSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId: string
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      ...(metadata ? { subscription_data: { metadata } } : {}),
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
