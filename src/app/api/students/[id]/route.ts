export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  isOwnerOrAdmin,
  createErrorResponse,
  logAuditAction,
  sanitizeUserData,
} from '@/lib/security'
import { idSchema, updateStudentSchema } from '@/lib/validations'

/**
 * GET /api/students/[id]
 * 
 * Obter dados de um estudante
 * - Admin: pode ver qualquer um
 * - Student: pode ver apenas a si mesmo
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Student data
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
      await logAuditAction(null, 'student_get', { studentId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'student_get', { studentId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar estudante
    const student = await prisma.student.findUnique({
      where: { id: validatedId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            dueDate: true,
            paidAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        classes: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
          },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!student) {
      await logAuditAction(
        user.id,
        'student_get',
        { studentId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Verificar autorização
    if (!isOwnerOrAdmin(user, student.userId)) {
      await logAuditAction(
        user.id,
        'student_get',
        { studentId: id, reason: 'unauthorized' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Sem permissão' },
        { status: 403 }
      )
    }

    await logAuditAction(
      user.id,
      'student_get',
      { studentId: id, access_type: user.id === student.userId ? 'own_data' : 'admin_access' },
      req,
      'success'
    )

    return NextResponse.json({
      data: {
        ...student,
        user: sanitizeUserData(student.user),
      },
    })
  } catch (error: any) {
    console.error('Error fetching student:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao buscar estudante', 500)
  }
}

/**
 * PATCH /api/students/[id]
 * 
 * Atualizar dados de um estudante (soft delete marcando como INACTIVE)
 * - Admin: pode atualizar qualquer um
 * - Student: pode atualizar apenas a si mesmo
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Updated student data
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
      await logAuditAction(null, 'student_update', { studentId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'student_update', { studentId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar estudante para verificar autorização
    const student = await prisma.student.findUnique({
      where: { id: validatedId },
      select: { userId: true },
    })

    if (!student) {
      await logAuditAction(
        user.id,
        'student_update',
        { studentId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Verificar autorização
    if (!isOwnerOrAdmin(user, student.userId)) {
      await logAuditAction(
        user.id,
        'student_update',
        { studentId: id, reason: 'unauthorized' },
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
    const validatedData = updateStudentSchema.parse(body)

    // Atualizar estudante
    const updatedStudent = await prisma.student.update({
      where: { id: validatedId },
      data: validatedData,
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
      'student_update',
      {
        studentId: id,
        changes: Object.keys(validatedData),
        access_type: user.id === student.userId ? 'own_data' : 'admin_access',
      },
      req,
      'success'
    )

    return NextResponse.json({
      message: 'Estudante atualizado com sucesso',
      data: {
        ...updatedStudent,
        user: sanitizeUserData(updatedStudent.user),
      },
    })
  } catch (error: any) {
    console.error('Error updating student:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao atualizar estudante', 500)
  }
}

/**
 * DELETE /api/students/[id]
 * 
 * Deletar estudante (soft delete marcando como INACTIVE)
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
      await logAuditAction(null, 'student_delete', { studentId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'student_delete', { studentId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Verificar admin
    if (!isAdmin(user)) {
      await logAuditAction(
        user.id,
        'student_delete',
        { studentId: id, reason: 'not_admin' },
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

    // Soft delete: marcar como INACTIVE ao invés de deletar
    const deletedStudent = await prisma.student.update({
      where: { id: validatedId },
      data: { status: 'INACTIVE' },
      select: { id: true, userId: true },
    })

    await logAuditAction(
      user.id,
      'student_delete',
      { studentId: id, soft_delete: true },
      req,
      'success'
    )

    return NextResponse.json({
      message: 'Estudante deletado com sucesso',
      data: { id: deletedStudent.id },
    })
  } catch (error: any) {
    console.error('Error deleting student:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao deletar estudante', 500)
  }
}
