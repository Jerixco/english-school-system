export const dynamic = 'force-dynamic'

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { NextRequest, NextResponse } from 'next/server'

const handler = NextAuth(authOptions)

async function rateLimitedHandler(req: NextRequest, context: unknown) {
  const isCredentialsCallback =
    req.method === 'POST' && req.nextUrl.pathname.endsWith('/callback/credentials')

  if (isCredentialsCallback) {
    const result = await checkRateLimit(authRateLimiter, getClientIdentifier(req))

    if (!result.success) {
      const retryAfter = Math.max(
        1,
        Math.ceil(((result.resetTime?.getTime() ?? Date.now()) - Date.now()) / 1000)
      )
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }
  }

  return handler(req, context as never)
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST }
