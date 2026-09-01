import { prisma } from '@/lib/prisma'
import { Plan } from '@prisma/client'

export interface CreateRecordingInput {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  durationMinutes?: number
  retentionDays?: number
  teacherId: string
  studentId?: string
}

export class RecordingService {
  /**
   * Retorna os dias de retenção de gravação padrão com base no plano do aluno.
   */
  getRetentionDaysForPlan(plan?: Plan): number {
    switch (plan) {
      case 'BASIC':
        return 7
      case 'STANDARD':
        return 30
      case 'PREMIUM':
        return 90
      case 'CUSTOM':
        return 180
      default:
        return 30
    }
  }

  /**
   * Lista as gravações ativas (não expiradas) com cálculo em tempo real de dias restantes.
   * Blindagem de Segurança: Cláusula estrita `expiresAt > new Date()`.
   */
  async listActiveRecordings(userId: string, role: string) {
    const now = new Date()
    const where: any = {
      expiresAt: {
        gt: now, // NUNCA retorna vídeos com prazo de validade expirado
      },
    }

    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } })
      if (!student) return []
      where.studentId = student.id
    } else if (role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } })
      if (!teacher) return []
      where.teacherId = teacher.id
    }
    // ADMIN tem visão irrestrita

    const recordings = await prisma.recording.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
    })

    return recordings.map((r) => {
      const msRemaining = r.expiresAt.getTime() - now.getTime()
      const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        videoUrl: r.videoUrl,
        thumbnailUrl: r.thumbnailUrl,
        durationMinutes: r.durationMinutes,
        recordedAt: r.recordedAt,
        expiresAt: r.expiresAt,
        daysRemaining,
        isExpiringSoon: daysRemaining <= 3,
        teacher: {
          id: r.teacher.id,
          name: r.teacher.user.name,
          image: r.teacher.user.image,
        },
        student: r.student ? {
          id: r.student.id,
          name: r.student.user.name,
        } : null,
      }
    })
  }

  /**
   * Cadastra uma nova gravação no sistema calculando a data de expiração com base no tempo de retenção.
   */
  async createRecording(data: CreateRecordingInput) {
    let days = data.retentionDays || 30

    // Se associado a um aluno específico, calcula de acordo com o plano dele
    if (data.studentId && !data.retentionDays) {
      const student = await prisma.student.findUnique({ where: { id: data.studentId } })
      if (student) {
        days = this.getRetentionDaysForPlan(student.plan)
      }
    }

    const recordedAt = new Date()
    const expiresAt = new Date(recordedAt.getTime() + days * 24 * 60 * 60 * 1000)

    return prisma.recording.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        durationMinutes: data.durationMinutes || 45,
        recordedAt,
        expiresAt,
        teacherId: data.teacherId,
        studentId: data.studentId || null,
      },
      include: {
        teacher: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    })
  }

  /**
   * Remove uma gravação do sistema.
   */
  async deleteRecording(id: string, teacherId?: string, isAdmin = false) {
    const recording = await prisma.recording.findUnique({ where: { id } })
    if (!recording) throw new Error('RECORDING_NOT_FOUND')

    if (!isAdmin && (!teacherId || recording.teacherId !== teacherId)) {
      throw new Error('UNAUTHORIZED')
    }

    return prisma.recording.delete({
      where: { id },
    })
  }
}
