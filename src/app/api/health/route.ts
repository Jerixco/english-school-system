export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()
  let isHealthy = true

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error: any) {
    isHealthy = false
    console.error('Health check DB error:', error?.message || error)
  }

  const responseTimeMs = Date.now() - startTime

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTimeMs,
    },
    { status: isHealthy ? 200 : 503 }
  )
}
