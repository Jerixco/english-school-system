export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  createErrorResponse,
  logAuditAction,
} from '@/lib/security'
import { studentFilterSchema } from '@/lib/validations'
import { StudentService } from '@/services/student.service'

const studentService = new StudentService()

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
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'students_list', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'students_list', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

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

    const isAdminUser = isAdmin(user)
    if (!isAdminUser) {
      await logAuditAction(user.id, 'students_list', { access_type: 'own_data' }, req)
    } else {
      await logAuditAction(user.id, 'students_list', { access_type: 'admin_all' }, req)
    }

    const result = await studentService.listStudents({
      userId: user.id,
      isAdmin: isAdminUser,
      page,
      limit,
      status: status as any,
      plan: plan as any,
      search,
    })

    return NextResponse.json(result)
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
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'student_create', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'student_create', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    await req.json().catch(() => ({}))

    const newStudent = await studentService.createStudent(user.id)

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
        data: newStudent,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating student:', error)

    if (error.message === 'STUDENT_ALREADY_EXISTS' || error.code === 'P2002') {
      await logAuditAction(
        (await getAuthenticatedUser())?.id || null,
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

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao criar estudante', 500)
  }
}
