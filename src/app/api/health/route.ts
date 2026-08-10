export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, { status: 'healthy' | 'degraded' | 'unhealthy'; message?: string }> = {}

  let isHealthy = true

  // 1. Check Database (Neon Postgres)
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = { status: 'healthy' }
  } catch (error: any) {
    isHealthy = false
    // Loga detalhe no servidor; resposta pública não expõe interno do banco.
    console.error('Health check DB error:', error?.message || error)
    checks.database = { status: 'unhealthy', message: 'DB connection failed' }
  }

  // 2. Check AI Services
  checks.ai = {
    status: process.env.GEMINI_API_KEY ? 'healthy' : 'degraded',
    message: process.env.GEMINI_API_KEY ? 'Gemini API configured' : 'GEMINI_API_KEY is missing',
  }

  // 3. Check Rate Limiter Storage
  checks.rateLimiter = {
    status: process.env.KV_REST_API_URL ? 'healthy' : 'degraded',
    message: process.env.KV_REST_API_URL ? 'Upstash Redis active' : 'Using in-memory rate limiter fallback',
  }

  const responseTimeMs = Date.now() - startTime

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTimeMs,
      checks,
    },
    { status: isHealthy ? 200 : 503 }
  )
}
