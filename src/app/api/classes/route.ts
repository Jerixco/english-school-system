export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  isStudentPlanActive,
  isTeacherAvailable,
  createErrorResponse,
  logAuditAction,
} from '@/lib/security'
import { classFilterSchema, createClassSchema } from '@/lib/validations'

/**
 * GET /api/classes
 * 
 * Listar aulas (cada um vê apenas suas aulas)
 * - Student: vê suas aulas
 * - Teacher: vê suas aulas
 * - Admin: vê todas
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} List of classes
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'classes_list', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'classes_list', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      teacherId: searchParams.get('teacherId') || undefined,
      studentId: searchParams.get('studentId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    }

    // Validar parâmetros
    let validatedQuery: any
    try {
      validatedQuery = classFilterSchema.parse(queryParams)
    } catch (error) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    const { page, limit, status, teacherId, studentId, dateFrom, dateTo } = validatedQuery

    // Construir where clause com segurança
    const where: any = {}

    // Se não é admin, filtrar por usuário
    if (!isAdmin(user)) {
      // Buscar IDs do usuário
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true },
      })

      const teacher = await prisma.teacher.findUnique({
        where: { userId: user.id },
        select: { id: true },
      })

      // Pode ser student E teacher simultaneamente
      const userClassIds = []
      if (student) userClassIds.push({ studentId: student.id })
      if (teacher) userClassIds.push({ teacherId: teacher.id })

      if (userClassIds.length === 0) {
        return NextResponse.json({
          data: [],
          pagination: { page, limit, total: 0, pages: 0 },
        })
      }

      where.OR = userClassIds
    }

    // Aplicar filtros adicionais
    if (status) where.status = status
    if (teacherId) where.teacherId = teacherId
    if (studentId) where.studentId = studentId

    if (dateFrom || dateTo) {
      where.scheduledAt = {}
      if (dateFrom) where.scheduledAt.gte = dateFrom
      if (dateTo) where.scheduledAt.lte = dateTo
    }

    // Paginação
    const skip = (page - 1) * limit
    const take = limit

    // Buscar dados + total
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take,
      }),
      prisma.class.count({ where }),
    ])

    await logAuditAction(
      user.id,
      'classes_list',
      { results: classes.length, access_type: isAdmin(user) ? 'admin' : 'own_data' },
      req
    )

    return NextResponse.json({
      data: classes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching classes:', error)
    return createErrorResponse('Erro ao buscar aulas', 500)
  }
}

/**
 * POST /api/classes
 * 
 * Agendar aula (validar plano ativo + disponibilidade professor)
 * - Apenas autenticado pode criar
 * - Validações: plano ativo, professor disponível, data futura
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} Created class data
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'class_create', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'class_create', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar dados
    const body = await req.json()
    let validatedData: any
    try {
      validatedData = createClassSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    const { studentId, teacherId, scheduledAt, duration, meetLink } = validatedData

    // Validar que o estudante existe e tem plano ativo
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true, status: true },
    })

    if (!student) {
      await logAuditAction(
        user.id,
        'class_create',
        { studentId, reason: 'student_not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Verificar plano ativo
    if (!await isStudentPlanActive(studentId)) {
      await logAuditAction(
        user.id,
        'class_create',
        { studentId, reason: 'student_plan_inactive' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Estudante sem plano ativo' },
        { status: 400 }
      )
    }

    // Validar que o professor existe e está ativo
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { isActive: true },
    })

    if (!teacher) {
      await logAuditAction(
        user.id,
        'class_create',
        { teacherId, reason: 'teacher_not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    if (!teacher.isActive) {
      await logAuditAction(
        user.id,
        'class_create',
        { teacherId, reason: 'teacher_inactive' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Professor não está disponível' },
        { status: 400 }
      )
    }

    // Validar disponibilidade do professor
    const isAvailable = await isTeacherAvailable(teacherId, scheduledAt, duration)
    if (!isAvailable) {
      await logAuditAction(
        user.id,
        'class_create',
        { teacherId, scheduledAt, reason: 'teacher_not_available' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Professor não está disponível nesse horário' },
        { status: 400 }
      )
    }

    // Criar aula
    const newClass = await prisma.class.create({
      data: {
        studentId,
        teacherId,
        scheduledAt,
        duration,
        meetLink,
        status: 'SCHEDULED',
      },
      include: {
        student: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        teacher: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    await logAuditAction(
      user.id,
      'class_create',
      { classId: newClass.id, studentId, teacherId },
      req,
      'success'
    )

    return NextResponse.json(
      {
        message: 'Aula agendada com sucesso',
        data: newClass,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating class:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estudante ou professor não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao criar aula', 500)
  }
}
