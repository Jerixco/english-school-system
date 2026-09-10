export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin, blockDemoMutations } from '@/lib/security'
import { LiveSessionService } from '@/services/live-session.service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const liveSessionService = new LiveSessionService()

const createLiveSessionSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(1000).optional(),
  scheduledFor: z.string().datetime().or(z.string().min(10)),
  duration: z.number().int().min(15).max(240).optional(),
  teacherId: z.string().min(1).optional(),
  studentId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 })
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as any

    const sessions = await liveSessionService.listSessionsForUser(user.id, user.role, { status })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching live sessions:', error)
    return NextResponse.json({ error: 'Erro ao buscar sessões ao vivo' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 })
    }

    const user = await getAuthenticatedUser()
    if (!user || (user.role !== 'TEACHER' && !isAdmin(user))) {
      return NextResponse.json({ error: 'Apenas professores e administradores podem agendar aulas ao vivo' }, { status: 403 })
    }

    const demoBlock = blockDemoMutations(user)
    if (demoBlock) return demoBlock

    const body = await req.json()
    const validatedData = createLiveSessionSchema.parse(body)

    let teacherId = ''
    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } })
      if (!teacher) return NextResponse.json({ error: 'Perfil de professor não encontrado' }, { status: 404 })
      teacherId = teacher.id
    } else {
      if (!validatedData.teacherId) {
        return NextResponse.json({ error: 'teacherId é obrigatório para administradores' }, { status: 400 })
      }
      const teacher = await prisma.teacher.findUnique({ where: { id: validatedData.teacherId } })
      if (!teacher || !teacher.isActive) {
        return NextResponse.json({ error: 'Professor não encontrado ou inativo' }, { status: 404 })
      }
      teacherId = teacher.id
    }

    const session = await liveSessionService.createSession({
      ...validatedData,
      teacherId,
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error creating live session:', error)
    return NextResponse.json({ error: 'Erro ao criar sessão ao vivo' }, { status: 500 })
  }
}
