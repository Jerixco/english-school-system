import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible'

// Rate limiter for general API requests
export const apiRateLimiter = new RateLimiterMemory({
  keyPrefix: 'api_limit',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

// Rate limiter for authentication endpoints (stricter)
export const authRateLimiter = new RateLimiterMemory({
  keyPrefix: 'auth_limit',
  points: 5, // Number of requests
  duration: 300, // Per 5 minutes
})

// Rate limiter for Stripe checkout (prevent abuse)
export const stripeRateLimiter = new RateLimiterMemory({
  keyPrefix: 'stripe_limit',
  points: 3, // Number of requests
  duration: 3600, // Per hour
})

export const checkRateLimit = async (
  limiter: RateLimiterMemory,
  identifier: string
): Promise<{ success: boolean; remaining?: number; resetTime?: Date }> => {
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
