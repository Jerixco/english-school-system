export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import {
  getAuthenticatedUser,
  isAdmin,
  createErrorResponse,
  logAuditAction,
  sanitizePaymentData,
} from '@/lib/security'
import { paymentFilterSchema, createPaymentSchema } from '@/lib/validations'

/**
 * GET /api/payments
 * 
 * Listar pagamentos (cada um vê apenas seus)
 * - Student: vê seus pagamentos
 * - Admin: vê todos
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} List of payments
 */
export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'payments_list', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'payments_list', { reason: 'not_authenticated' }, req, 'failure')
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
      studentId: searchParams.get('studentId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    }

    // Validar parâmetros
    let validatedQuery: any
    try {
      validatedQuery = paymentFilterSchema.parse(queryParams)
    } catch (error) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    const { page, limit, status, studentId, dateFrom, dateTo } = validatedQuery

    // Construir where clause
    const where: any = {}

    // Se não é admin, filtrar pagamentos do seu student
    if (!isAdmin(user)) {
      const studentRecord = await prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true },
      })

      if (!studentRecord) {
        return NextResponse.json({
          data: [],
          pagination: { page, limit, total: 0, pages: 0 },
        })
      }

      where.studentId = studentRecord.id
    } else if (studentId) {
      // Admin pode filtrar por studentId específico
      where.studentId = studentId
    }

    // Aplicar filtros adicionais
    if (status) where.status = status

    if (dateFrom || dateTo) {
      where.dueDate = {}
      if (dateFrom) where.dueDate.gte = dateFrom
      if (dateTo) where.dueDate.lte = dateTo
    }

    // Paginação
    const skip = (page - 1) * limit
    const take = limit

    // Buscar dados + total
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
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
        },
        orderBy: { dueDate: 'desc' },
        skip,
        take,
      }),
      prisma.payment.count({ where }),
    ])

    // Sanitizar dados de pagamento
    const safePayments = payments.map((payment) => sanitizePaymentData(payment))

    await logAuditAction(
      user.id,
      'payments_list',
      { results: safePayments.length, access_type: isAdmin(user) ? 'admin' : 'own_data' },
      req
    )

    return NextResponse.json({
      data: safePayments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching payments:', error)
    return createErrorResponse('Erro ao buscar pagamentos', 500)
  }
}

/**
 * POST /api/payments
 * 
 * Criar pagamento novo
 * - Apenas admin pode criar
 * - Validar que estudante existe
 * 
 * @param {NextRequest} req - Request
 * @returns {Promise<NextResponse>} Created payment data
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)

    if (!rateLimitResult.success) {
      await logAuditAction(null, 'payment_create', { reason: 'rate_limit_exceeded' }, req, 'failure')
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Autenticação obrigatória
    const user = await getAuthenticatedUser()
    if (!user) {
      await logAuditAction(null, 'payment_create', { reason: 'not_authenticated' }, req, 'failure')
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    // Apenas admin pode criar
    if (!isAdmin(user)) {
      await logAuditAction(user.id, 'payment_create', { reason: 'not_admin' }, req, 'failure')
      return NextResponse.json(
        { error: 'Apenas admin pode criar pagamentos' },
        { status: 403 }
      )
    }

    // Validar dados
    const body = await req.json()
    let validatedData: any
    try {
      validatedData = createPaymentSchema.parse(body)
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    const { studentId, amount, currency, paymentMethod, dueDate, invoiceUrl } = validatedData

    // Verificar se estudante existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, userId: true },
    })

    if (!student) {
      await logAuditAction(
        user.id,
        'payment_create',
        { studentId, reason: 'student_not_found' },
        req,
        'failure'
      )
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Criar pagamento
    const newPayment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        currency,
        paymentMethod,
        dueDate,
        invoiceUrl,
        status: 'PENDING',
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
      },
    })

    await logAuditAction(
      user.id,
      'payment_create',
      {
        paymentId: newPayment.id,
        studentId,
        amount,
      },
      req,
      'success'
    )

    return NextResponse.json(
      {
        message: 'Pagamento criado com sucesso',
        data: sanitizePaymentData(newPayment),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating payment:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Estudante inválido' },
        { status: 400 }
      )
    }

    return createErrorResponse('Erro ao criar pagamento', 500)
  }
}
