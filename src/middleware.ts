import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/professor': ['TEACHER', 'ADMIN'],
  '/aluno': ['STUDENT', 'ADMIN'],
  '/seguranca': ['ADMIN', 'TEACHER', 'STUDENT'],
}

const PUBLIC_AUTH_ROUTES = ['/login', '/register']

function getDefaultRouteForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'TEACHER':
      return '/professor'
    case 'STUDENT':
      return '/aluno'
    default:
      return '/login'
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const response = NextResponse.next()

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )

  if (req.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userRole = token?.role as string | undefined

  if (PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole || 'STUDENT'), req.url))
  }

  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      if (!token) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (userRole && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), req.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/aluno/:path*', '/professor/:path*', '/seguranca', '/login', '/register'],
}
