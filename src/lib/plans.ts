import { Plan } from '@prisma/client'

/**
 * Catálogo de planos resolvido no servidor.
 * O cliente envia apenas a chave do plano (ex: 'BASIC'); o priceId do Stripe
 * é resolvido aqui a partir de env vars server-only. Isso impede manipulação
 * de preço (enviar priceId de um plano barato para obter acesso premium).
 */
export const PLAN_PRICE_IDS: Record<Exclude<Plan, 'CUSTOM'>, string | undefined> = {
  BASIC: process.env.STRIPE_PRICE_BASIC || process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
  STANDARD: process.env.STRIPE_PRICE_STANDARD || process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM || process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
}

export type PurchasablePlan = keyof typeof PLAN_PRICE_IDS

export function isPurchasablePlan(value: unknown): value is PurchasablePlan {
  return value === 'BASIC' || value === 'STANDARD' || value === 'PREMIUM'
}

/**
 * Retorna o priceId configurado para um plano, ou null se o plano for
 * desconhecido/não comprável ou a env var não estiver configurada.
 */
export function getPriceIdForPlan(plan: string): string | null {
  if (!isPurchasablePlan(plan)) return null
  return PLAN_PRICE_IDS[plan] ?? null
}
