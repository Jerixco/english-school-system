import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://www.googletagmanager.com; font-src 'self' data:; connect-src 'self' https: https://www.googletagmanager.com; frame-ancestors 'none';"
  )

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )

  // Strict-Transport-Security (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
