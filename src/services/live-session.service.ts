import { prisma } from '@/lib/prisma'
import { LiveSessionStatus } from '@prisma/client'
import { sanitizeUserData } from '@/lib/security'

export interface CreateLiveSessionInput {
  title: string
  description?: string
  scheduledFor: Date | string
  duration?: number
  teacherId: string
  studentId?: string
}

export class LiveSessionService {
  /**
   * Lista as sessões ao vivo disponíveis para o usuário autenticado com controle RBAC e sanitização de PII.
   */
  async listSessionsForUser(userId: string, role: string, options: { status?: LiveSessionStatus; activeOnly?: boolean } = {}) {
    const where: any = {}

    if (options.status) {
      where.status = options.status
    }

    if (role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId } })
      if (!student) return []
      where.OR = [
        { studentId: student.id },
        { studentId: null }, // Aulas gerais/abertas para todos os alunos
      ]
    } else if (role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId } })
      if (!teacher) return []
      where.teacherId = teacher.id
    }
    // ADMIN tem visão total sem filtros de usuário

    const sessions = await prisma.liveSession.findMany({
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
        scheduledFor: 'asc',
      },
    })

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      roomName: s.roomName,
      status: s.status,
      scheduledFor: s.scheduledFor,
      duration: s.duration,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      meetLink: s.meetLink,
      teacher: {
        id: s.teacher.id,
        name: s.teacher.user.name,
        image: s.teacher.user.image,
      },
      student: s.student ? {
        id: s.student.id,
        name: s.student.user.name,
      } : null,
      createdAt: s.createdAt,
    }))
  }

  /**
   * Cria e agenda uma nova sessão de aula ao vivo.
   */
  async createSession(data: CreateLiveSessionInput) {
    const roomIdentifier = `english-school-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`
    const meetLink = `https://meet.jit.si/${roomIdentifier}`

    return prisma.liveSession.create({
      data: {
        title: data.title,
        description: data.description,
        roomName: roomIdentifier,
        scheduledFor: new Date(data.scheduledFor),
        duration: data.duration || 60,
        teacherId: data.teacherId,
        studentId: data.studentId || null,
        meetLink,
        status: 'SCHEDULED',
      },
      include: {
        teacher: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    })
  }

  /**
   * Inicia a transmissão de uma aula ao vivo (Status: LIVE).
   */
  async startSession(id: string, teacherId?: string, isAdmin = false) {
    const session = await prisma.liveSession.findUnique({ where: { id } })
    if (!session) throw new Error('SESSION_NOT_FOUND')

    if (!isAdmin && teacherId && session.teacherId !== teacherId) {
      throw new Error('UNAUTHORIZED')
    }

    return prisma.liveSession.update({
      where: { id },
      data: {
        status: 'LIVE',
        startedAt: new Date(),
      },
    })
  }

  /**
   * Encerra a transmissão de uma aula ao vivo (Status: ENDED).
   */
  async endSession(id: string, teacherId?: string, isAdmin = false) {
    const session = await prisma.liveSession.findUnique({ where: { id } })
    if (!session) throw new Error('SESSION_NOT_FOUND')

    if (!isAdmin && teacherId && session.teacherId !== teacherId) {
      throw new Error('UNAUTHORIZED')
    }

    return prisma.liveSession.update({
      where: { id },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
      },
    })
  }
}
