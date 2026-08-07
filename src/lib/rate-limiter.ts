import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Check if Upstash Redis env variables exist
const hasUpstash = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

const redis = hasUpstash
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null

const upstashApiLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '60 s'), prefix: 'ratelimit:api' })
  : null

const upstashAiLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '60 s'), prefix: 'ratelimit:ai' })
  : null

const upstashAuthLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '300 s'), prefix: 'ratelimit:auth' })
  : null

const upstashStripeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '3600 s'), prefix: 'ratelimit:stripe' })
  : null

// Fallback Memory Rate Limiters for local dev
export const apiRateLimiter = new RateLimiterMemory({
  keyPrefix: 'api_limit',
  points: 100,
  duration: 60,
})

export const aiRateLimiter = new RateLimiterMemory({
  keyPrefix: 'ai_limit',
  points: 5,
  duration: 60,
})

export const authRateLimiter = new RateLimiterMemory({
  keyPrefix: 'auth_limit',
  points: 5,
  duration: 300,
})

export const stripeRateLimiter = new RateLimiterMemory({
  keyPrefix: 'stripe_limit',
  points: 3,
  duration: 3600,
})

export const checkRateLimit = async (
  limiter: RateLimiterMemory,
  identifier: string
): Promise<{ success: boolean; remaining?: number; resetTime?: Date }> => {
  if (redis) {
    let upstashLimiter = upstashApiLimiter
    if (limiter === aiRateLimiter) upstashLimiter = upstashAiLimiter
    if (limiter === authRateLimiter) upstashLimiter = upstashAuthLimiter
    if (limiter === stripeRateLimiter) upstashLimiter = upstashStripeLimiter

    if (upstashLimiter) {
      try {
        const res = await upstashLimiter.limit(identifier)
        return {
          success: res.success,
          remaining: res.remaining,
          resetTime: new Date(res.reset),
        }
      } catch (err) {
        console.warn('Upstash rate limit fallback to memory:', err)
      }
    }
  }

  try {
    const result = await limiter.consume(identifier)
    return {
      success: true,
      remaining: result.remainingPoints,
      resetTime: new Date(Date.now() + result.msBeforeNext),
    }
  } catch (rateLimiterRes: any) {
    return {
      success: false,
      remaining: rateLimiterRes.remainingPoints,
      resetTime: new Date(Date.now() + rateLimiterRes.msBeforeNext),
    }
  }
}

export const getClientIdentifier = (req: Request): string => {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'
  return ip
}
