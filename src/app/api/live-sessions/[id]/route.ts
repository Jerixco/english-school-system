export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { LiveSessionService } from '@/services/live-session.service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const liveSessionService = new LiveSessionService()

const updateStatusSchema = z.object({
  action: z.enum(['start', 'end']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 })
    }

    const user = await getAuthenticatedUser()
    if (!user || (user.role !== 'TEACHER' && !isAdmin(user))) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { action } = updateStatusSchema.parse(body)

    let teacherId: string | undefined = undefined
    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } })
      teacherId = teacher?.id
    }

    let updatedSession
    if (action === 'start') {
      updatedSession = await liveSessionService.startSession(id, teacherId, isAdmin(user))
    } else {
      updatedSession = await liveSessionService.endSession(id, teacherId, isAdmin(user))
    }

    return NextResponse.json(updatedSession)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    if (error.message === 'SESSION_NOT_FOUND') {
      return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 })
    }
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Você não tem permissão para alterar esta sessão' }, { status: 403 })
    }
    console.error('Error updating live session:', error)
    return NextResponse.json({ error: 'Erro ao atualizar status da sessão' }, { status: 500 })
  }
}
