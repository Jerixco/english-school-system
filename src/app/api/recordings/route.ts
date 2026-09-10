export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin, blockDemoMutations } from '@/lib/security'
import { RecordingService } from '@/services/recording.service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const recordingService = new RecordingService()

const createRecordingSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(1000).optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  durationMinutes: z.number().int().min(1).max(300).optional(),
  retentionDays: z.number().int().min(1).max(365).optional(),
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

    const recordings = await recordingService.listActiveRecordings(user.id, user.role)

    return NextResponse.json(recordings)
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return NextResponse.json({ error: 'Erro ao buscar gravações ativas' }, { status: 500 })
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
      return NextResponse.json({ error: 'Apenas professores e administradores podem cadastrar gravações' }, { status: 403 })
    }

    const demoBlock = blockDemoMutations(user)
    if (demoBlock) return demoBlock

    const body = await req.json()
    const validatedData = createRecordingSchema.parse(body)

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

    const recording = await recordingService.createRecording({
      ...validatedData,
      teacherId,
    })

    return NextResponse.json(recording, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error creating recording:', error)
    return NextResponse.json({ error: 'Erro ao criar gravação' }, { status: 500 })
  }
}
