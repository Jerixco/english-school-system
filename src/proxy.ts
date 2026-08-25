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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const response = NextResponse.next()

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
    '/api/:path*',
    '/admin/:path*',
    '/aluno/:path*',
    '/professor/:path*',
    '/seguranca',
    '/login',
    '/register',
  ],
}
