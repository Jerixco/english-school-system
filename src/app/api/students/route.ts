export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  createErrorResponse,
  logAuditAction,
  sanitizeUserData,
} from '@/lib/security'
import { studentFilterSchema } from '@/lib/validations'

/**
 * GET /api/students
 * 
 * Listar estudantes
 * - Admin: pode listar todos
 * - Student: pode ver apenas a si mesmo
 * - Teacher: não tem acesso
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'students_list', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'students_list', { reason: 'not_authenticated' }, req, 'failure')
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
      plan: searchParams.get('plan') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const validatedQuery = studentFilterSchema.parse(queryParams)
    const { page, limit, status, plan, search } = validatedQuery

    // Construir where clause com segurança
    const where: any = {}

    // Se não é admin, filtrar por usuário atual
    if (!isAdmin(user)) {
      // Student vê apenas a si mesmo
      where.userId = user.id
      await logAuditAction(user.id, 'students_list', { access_type: 'own_data' }, req)
    } else {
      await logAuditAction(user.id, 'students_list', { access_type: 'admin_all' }, req)
    }

    // Aplicar filtros adicionais
    if (status) where.status = status
    if (plan) where.plan = plan

    // Busca por nome ou email
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Paginação segura
    const skip = (page - 1) * limit
    const take = limit

    // Buscar dados + total para paginação
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

    // Sanitizar dados antes de retornar
    const safeStudents = students.map((student) => ({
      ...student,
      user: sanitizeUserData(student.user),
    }))

    return NextResponse.json({
      data: safeStudents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching students:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao buscar estudantes', 500)
  }
}

/**
 * POST /api/students
 * 
 * Criar novo estudante
 * - Apenas admin pode criar para outros
 * - Qualquer user autenticado pode criar para si mesmo
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'student_create', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'student_create', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { plan } = body

    // Verificar se estudante já existe
    const existingStudent = await prisma.student.findUnique({
      where: { userId: user.id },
    })

    if (existingStudent) {
      await logAuditAction(
        user.id,
        'student_create',
        { reason: 'student_already_exists' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Você já é um estudante' },
        { status: 409 }
      )
    }

    // Criar novo estudante
    const newStudent = await prisma.student.create({
      data: {
        userId: user.id,
        plan: plan || 'BASIC',
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

    await logAuditAction(
      user.id,
      'student_create',
      { studentId: newStudent.id, plan: newStudent.plan },
      req,
      'success'
    )

    return NextResponse.json(
      {
        message: 'Estudante criado com sucesso',
        data: {
          ...newStudent,
          user: sanitizeUserData(newStudent.user),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating student:', error)

    if (error.code === 'P2002') {
      await logAuditAction(
        (await getAuthenticatedUser())?.id || null,
        'student_create',
        { reason: 'unique_constraint_violation' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Este usuário já é um estudante' },
        { status: 409 }
      )
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao criar estudante', 500)
  }
}
