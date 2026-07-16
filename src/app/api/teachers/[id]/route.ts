export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  isTeacher,
  isOwnerOrAdmin,
  createErrorResponse,
  logAuditAction,
  sanitizeUserData,
} from '@/lib/security'
import { idSchema, updateTeacherSchema } from '@/lib/validations'

/**
 * GET /api/teachers/[id]
 * 
 * Obter professor específico (público vê básico)
 * - Público: vê nome, email, bio, especialidades
 * - Autenticado: vê mais detalhes
 * - Admin/próprio professor: vê disponibilidade
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Teacher data
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'teacher_get', { teacherId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Autenticação é opcional
    const user = await getAuthenticatedUser()

    // Buscar professor
    const teacher = await prisma.teacher.findUnique({
      where: { id: validatedId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        classes: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
          },
          where: { status: 'SCHEDULED' },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
        },
      },
    })

    if (!teacher) {
      await logAuditAction(
        user?.id || null,
        'teacher_get',
        { teacherId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Preparar resposta com dados apropriados ao nível de acesso
    const response: any = {
      id: teacher.id,
      user: sanitizeUserData(teacher.user),
      bio: teacher.bio,
      specialties: teacher.specialties,
      isActive: teacher.isActive,
      upcomingClasses: teacher.classes,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    }

    // Admin e professor próprio veem disponibilidade e Calendly
    if (user?.id === teacher.userId || (user && isAdmin(user))) {
      response.availability = teacher.availability
      response.calendlyUrl = teacher.calendlyUrl
    }

    await logAuditAction(
      user?.id || null,
      'teacher_get',
      {
        teacherId: id,
        access_type: !user ? 'anonymous' : user.id === teacher.userId ? 'own_data' : isAdmin(user) ? 'admin' : 'authenticated',
      },
      req
    )

    return NextResponse.json({ data: response })
  } catch (error: any) {
    console.error('Error fetching teacher:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao buscar professor', 500)
  }
}

/**
 * PATCH /api/teachers/[id]
 * 
 * Atualizar professor
 * - Professor: pode atualizar apenas a si mesmo
 * - Admin: pode atualizar qualquer um
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Updated teacher data
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'teacher_update', { teacherId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'teacher_update', { teacherId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar professor para verificar autorização
    const teacher = await prisma.teacher.findUnique({
      where: { id: validatedId },
      select: { userId: true },
    })

    if (!teacher) {
      await logAuditAction(
        user.id,
        'teacher_update',
        { teacherId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Verificar autorização
    if (!isOwnerOrAdmin(user, teacher.userId)) {
      await logAuditAction(
        user.id,
        'teacher_update',
        { teacherId: id, reason: 'unauthorized' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Sem permissão' },
        { status: 403 }
      )
    }

    // Validar dados
    const body = await req.json()
    let validatedData: any
    try {
      validatedData = updateTeacherSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Atualizar professor
    const updatedTeacher = await prisma.teacher.update({
      where: { id: validatedId },
      data: validatedData,
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
      'teacher_update',
      {
        teacherId: id,
        changes: Object.keys(validatedData),
        access_type: user.id === teacher.userId ? 'own_data' : 'admin_access',
      },
      req
    )

    return NextResponse.json({
      message: 'Professor atualizado com sucesso',
      data: {
        ...updatedTeacher,
        user: sanitizeUserData(updatedTeacher.user),
      },
    })
  } catch (error: any) {
    console.error('Error updating teacher:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao atualizar professor', 500)
  }
}

/**
 * DELETE /api/teachers/[id]
 * 
 * Deletar professor (soft delete marcando como inativo)
 * - Apenas admin pode deletar
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Deletion confirmation
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'teacher_delete', { teacherId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'teacher_delete', { teacherId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Apenas admin pode deletar
    if (!isAdmin(user)) {
      await logAuditAction(
        user.id,
        'teacher_delete',
        { teacherId: id, reason: 'not_admin' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Apenas admin pode deletar' },
        { status: 403 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Soft delete: marcar como inativo
    const deletedTeacher = await prisma.teacher.update({
      where: { id: validatedId },
      data: { isActive: false },
      select: { id: true, userId: true },
    })

    await logAuditAction(
      user.id,
      'teacher_delete',
      { teacherId: id, soft_delete: true },
      req,
      'success'
    )

    return NextResponse.json({
      message: 'Professor deletado com sucesso',
      data: { id: deletedTeacher.id },
    })
  } catch (error: any) {
    console.error('Error deleting teacher:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao deletar professor', 500)
  }
}
