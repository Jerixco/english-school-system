export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  isTeacherAvailable,
  createErrorResponse,
  logAuditAction,
} from '@/lib/security'
import { idSchema, updateClassSchema } from '@/lib/validations'

/**
 * GET /api/classes/[id]
 * 
 * Obter dados de uma aula específica
 * - Student/Teacher: pode ver apenas suas aulas
 * - Admin: pode ver qualquer uma
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Class data
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
      await logAuditAction(null, 'class_get', { classId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'class_get', { classId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar aula
    const classData = await prisma.class.findUnique({
      where: { id: validatedId },
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
    })

    if (!classData) {
      await logAuditAction(
        user.id,
        'class_get',
        { classId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar autorização
    const hasAccess = 
      isAdmin(user) ||
      classData.student.user.email === user.email ||
      classData.teacher.user.email === user.email

    if (!hasAccess) {
      await logAuditAction(
        user.id,
        'class_get',
        { classId: id, reason: 'unauthorized' },
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
      'class_get',
      { classId: id, access_type: isAdmin(user) ? 'admin' : 'own_data' },
      req
    )

    return NextResponse.json({ data: classData })
  } catch (error: any) {
    console.error('Error fetching class:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao buscar aula', 500)
  }
}

/**
 * PATCH /api/classes/[id]
 * 
 * Atualizar aula (validar novo horário)
 * - Student/Teacher: pode atualizar apenas suas aulas
 * - Admin: pode atualizar qualquer uma
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Updated class data
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
      await logAuditAction(null, 'class_update', { classId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'class_update', { classId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar aula para verificar autorização
    const classData = await prisma.class.findUnique({
      where: { id: validatedId },
      select: {
        student: { select: { user: { select: { email: true } } } },
        teacher: { select: { user: { select: { email: true } }, id: true } },
      },
    })

    if (!classData) {
      await logAuditAction(
        user.id,
        'class_update',
        { classId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar autorização
    const hasAccess = 
      isAdmin(user) ||
      classData.student.user.email === user.email ||
      classData.teacher.user.email === user.email

    if (!hasAccess) {
      await logAuditAction(
        user.id,
        'class_update',
        { classId: id, reason: 'unauthorized' },
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
      validatedData = updateClassSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Se alterando horário, validar nova disponibilidade
    if (validatedData.scheduledAt) {
      // Buscar classe completa para pegar duration
      const fullClass = await prisma.class.findUnique({
        where: { id: validatedId },
        select: { duration: true, teacherId: true },
      })

      if (fullClass) {
        const isAvailable = await isTeacherAvailable(
          fullClass.teacherId,
          validatedData.scheduledAt,
          fullClass.duration,
          validatedId
        )

        if (!isAvailable) {
          await logAuditAction(
            user.id,
            'class_update',
            { classId: id, reason: 'teacher_not_available' },
            req,
            'failure'
          )
          return NextResponse.json(
            { error: 'Professor não está disponível no novo horário' },
            { status: 400 }
          )
        }
      }
    }

    // Atualizar aula
    const updatedClass = await prisma.class.update({
      where: { id: validatedId },
      data: validatedData,
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
      'class_update',
      {
        classId: id,
        changes: Object.keys(validatedData),
      },
      req
    )

    return NextResponse.json({
      message: 'Aula atualizada com sucesso',
      data: updatedClass,
    })
  } catch (error: any) {
    console.error('Error updating class:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao atualizar aula', 500)
  }
}

/**
 * DELETE /api/classes/[id]
 * 
 * Cancelar aula com status CANCELLED (soft delete)
 * - Student/Teacher: pode cancelar apenas suas aulas
 * - Admin: pode cancelar qualquer uma
 * 
 * @param {NextRequest} req - Request
 * @param {Promise<{id: string}>} params - Route params
 * @returns {Promise<NextResponse>} Cancellation confirmation
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
      await logAuditAction(null, 'class_delete', { classId: id, reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'class_delete', { classId: id, reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Validar ID
    const validatedId = idSchema.parse(id)

    // Buscar aula para verificar autorização
    const classData = await prisma.class.findUnique({
      where: { id: validatedId },
      select: {
        student: { select: { user: { select: { email: true } } } },
        teacher: { select: { user: { select: { email: true } } } },
      },
    })

    if (!classData) {
      await logAuditAction(
        user.id,
        'class_delete',
        { classId: id, reason: 'not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar autorização
    const hasAccess = 
      isAdmin(user) ||
      classData.student.user.email === user.email ||
      classData.teacher.user.email === user.email

    if (!hasAccess) {
      await logAuditAction(
        user.id,
        'class_delete',
        { classId: id, reason: 'unauthorized' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Sem permissão' },
        { status: 403 }
      )
    }

    // Soft delete: marcar como CANCELLED
    const cancelledClass = await prisma.class.update({
      where: { id: validatedId },
      data: { status: 'CANCELLED' },
      select: { id: true },
    })

    await logAuditAction(
      user.id,
      'class_delete',
      { classId: id, soft_delete: true },
      req,
      'success'
    )

    return NextResponse.json({
      message: 'Aula cancelada com sucesso',
      data: { id: cancelledClass.id },
    })
  } catch (error: any) {
    console.error('Error deleting class:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    return createErrorResponse('Erro ao cancelar aula', 500)
  }
}
