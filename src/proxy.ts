import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

function createNonce(): string {
  return btoa(crypto.randomUUID())
}

function createCspHeader(nonce: string): string {
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com https://js.stripe.com https://meet.jit.si https://vercel.com https://vercel.live https://*.vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://*.vercel.live; img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com https://images.unsplash.com https://avatars.githubusercontent.com https://vercel.com https://vercel.live https://*.vercel.live; font-src 'self' https://fonts.gstatic.com https://vercel.live https://assets.vercel.com; media-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.stripe.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://calendly.com https://meet.jit.si https://vercel.com https://vercel.live https://*.vercel.live https://*.pusher.com wss://*.pusher.com; frame-src 'self' https://js.stripe.com https://calendly.com https://meet.jit.si https://vercel.com https://vercel.live https://*.vercel.live; worker-src 'self' blob:; child-src 'self' blob:; manifest-src 'self' https://vercel.com https://vercel.live https://*.vercel.live; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;`
}

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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const nonce = createNonce()
  const cspHeader = createCspHeader(nonce)
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', cspHeader)

  // CORS para rotas /api/
  if (pathname.startsWith('/api/')) {
    response.headers.set(
      'Access-Control-Allow-Origin',
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    )
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userRole = token?.role as string | undefined

  // Redireciona usuários autenticados que tentam acessar /login ou /register
  if (PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole || 'STUDENT'), req.url))
  }

  // Validação de RBAC para rotas protegidas
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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2)$).*)',
  ],
}
