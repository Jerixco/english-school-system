import { prisma } from '@/lib/prisma'
import { Plan, StudentStatus } from '@prisma/client'
import { sanitizeUserData } from '@/lib/security'

export interface ListStudentsOptions {
  userId?: string
  isAdmin: boolean
  page: number
  limit: number
  status?: StudentStatus
  plan?: Plan
  search?: string
}

export class StudentService {
  /**
   * Lista estudantes com suporte a paginação, busca e filtros de perfil.
   */
  async listStudents(options: ListStudentsOptions) {
    const { userId, isAdmin, page, limit, status, plan, search } = options

    const where: any = {}

    if (!isAdmin && userId) {
      where.userId = userId
    }

    if (status) where.status = status
    if (plan) where.plan = plan

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const skip = (page - 1) * limit
    const take = limit

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              dueDate: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          classes: {
            select: { id: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.student.count({ where }),
    ])

    const safeStudents = students.map((student) => ({
      ...student,
      user: sanitizeUserData(student.user),
    }))

    return {
      data: safeStudents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Registra um novo estudante associado ao usuário.
   */
  async createStudent(userId: string) {
    const existingStudent = await prisma.student.findUnique({
      where: { userId },
    })

    if (existingStudent) {
      throw new Error('STUDENT_ALREADY_EXISTS')
    }

    const newStudent = await prisma.student.create({
      data: {
        userId,
        plan: 'BASIC',
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return {
      ...newStudent,
      user: sanitizeUserData(newStudent.user),
    }
  }
}
