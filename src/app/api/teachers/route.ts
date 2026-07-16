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
import { teacherFilterSchema, createTeacherSchema } from '@/lib/validations'

/**
 * GET /api/teachers
 * 
 * Listar professores (público vê básico, autenticado vê mais)
 * - Sem autenticação: pode ver info básica (nome, email, especialidades)
 * - Autenticado: vê mais detalhes
 * - Admin: vê tudo incluindo disponibilidade completa
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} List of teachers
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'teachers_list', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação é opcional para listar professores
    const user = await getAuthenticatedUser()

    // Validar query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
      specialty: searchParams.get('specialty') || undefined,
    }

    // Validar parâmetros
    let validatedQuery: any
    try {
      validatedQuery = teacherFilterSchema.parse(queryParams)
    } catch (error) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    const { page, limit, isActive, search, specialty } = validatedQuery

    // Construir where clause
    const where: any = { isActive: isActive !== undefined ? isActive : true }

    // Busca por nome ou email
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Filtrar por especialidade
    if (specialty) {
      where.specialties = { has: specialty }
    }

    // Paginação
    const skip = (page - 1) * limit
    const take = limit

    // Buscar dados + total
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          classes: {
            select: { id: true },
            where: { status: 'SCHEDULED' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.teacher.count({ where }),
    ])

    // Se não autenticado, não retornar availability completa
    const safeTeachers = teachers.map((teacher) => {
      const teacherData: any = {
        id: teacher.id,
        user: sanitizeUserData(teacher.user),
        bio: teacher.bio,
        specialties: teacher.specialties,
        isActive: teacher.isActive,
        upcomingClasses: teacher.classes.length,
      }

      // Admin e professor próprio veem disponibilidade
      if (user && (user.id === teacher.userId || isAdmin(user))) {
        teacherData.availability = teacher.availability
        teacherData.calendlyUrl = teacher.calendlyUrl
      }

      return teacherData
    })

    await logAuditAction(
      user?.id || null,
      'teachers_list',
      {
        access_type: !user ? 'anonymous' : isAdmin(user) ? 'admin' : 'authenticated',
        results: safeTeachers.length,
      },
      req
    )

    return NextResponse.json({
      data: safeTeachers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching teachers:', error)
    return createErrorResponse('Erro ao buscar professores', 500)
  }
}

/**
 * POST /api/teachers
 * 
 * Criar novo professor
 * - Apenas admin pode criar professor
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} Created teacher data
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'teacher_create', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'teacher_create', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Apenas admin pode criar
    if (!isAdmin(user)) {
      await logAuditAction(user.id, 'teacher_create', { reason: 'not_admin' }, req, 'failure')
      return NextResponse.json(
        { error: 'Apenas admin pode criar professores' },
        { status: 403 }
      )
    }

    // Validar dados
    const body = await req.json()
    let validatedData: any
    try {
      validatedData = createTeacherSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Verificar se professor já existe para esse user
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: validatedData.userId },
    })

    if (existingTeacher) {
      await logAuditAction(
        user.id,
        'teacher_create',
        { userId: validatedData.userId, reason: 'teacher_already_exists' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Este usuário já é um professor' },
        { status: 409 }
      )
    }

    // Criar professor
    const newTeacher = await prisma.teacher.create({
      data: {
        userId: validatedData.userId,
        calendlyUrl: validatedData.calendlyUrl,
        bio: validatedData.bio,
        specialties: validatedData.specialties || [],
        availability: validatedData.availability || [],
        isActive: true,
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

    await logAuditAction(
      user.id,
      'teacher_create',
      { teacherId: newTeacher.id, userId: validatedData.userId },
      req,
      'success'
    )

    return NextResponse.json(
      {
        message: 'Professor criado com sucesso',
        data: {
          ...newTeacher,
          user: sanitizeUserData(newTeacher.user),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating teacher:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este usuário já é um professor' },
        { status: 409 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao criar professor', 500)
  }
}
