import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export interface TeacherCreateData {
  userId: string
  calendlyUrl?: string
  bio?: string
  specialties?: string[]
  availability?: string[]
}

export class TeacherService {
  /**
   * Lista professores com filtros opcionais.
   */
  async listTeachers(options: { activeOnly?: boolean; showEmail?: boolean } = {}) {
    const where: any = {}
    if (options.activeOnly) {
      where.isActive = true
    }

    return prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            ...(options.showEmail ? { email: true } : {}),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Cria um novo perfil de professor.
   */
  async createTeacher(data: TeacherCreateData) {
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: data.userId },
    })

    if (existingTeacher) {
      throw new Error('TEACHER_ALREADY_EXISTS')
    }

    return prisma.teacher.create({
      data: {
        userId: data.userId,
        calendlyUrl: data.calendlyUrl,
        bio: data.bio,
        specialties: data.specialties || [],
        availability: data.availability || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }
}
