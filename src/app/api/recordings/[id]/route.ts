export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { RecordingService } from '@/services/recording.service'
import { prisma } from '@/lib/prisma'

const recordingService = new RecordingService()

export async function DELETE(
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

    let teacherId: string | undefined = undefined
    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } })
      teacherId = teacher?.id
    }

    await recordingService.deleteRecording(id, teacherId, isAdmin(user))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'RECORDING_NOT_FOUND') {
      return NextResponse.json({ error: 'Gravação não encontrada' }, { status: 404 })
    }
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Você não tem permissão para excluir esta gravação' }, { status: 403 })
    }
    console.error('Error deleting recording:', error)
    return NextResponse.json({ error: 'Erro ao excluir gravação' }, { status: 500 })
  }
}
