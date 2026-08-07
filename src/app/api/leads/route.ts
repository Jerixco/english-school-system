export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { LeadStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { validateLead } from '@/lib/validations'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { ZodError } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas administradores podem acessar a lista de leads.' },
        { status: 403 }
      )
    }

    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const hasStatus = status && Object.values(LeadStatus).includes(status as LeadStatus)

    if (status && !hasStatus) {
      return NextResponse.json(
        { error: 'Filtro de status inválido.' },
        { status: 400 }
      )
    }

    const where: Prisma.LeadWhereInput = {
      ...(status ? { status: status as LeadStatus } : {}),
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar leads.' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const validatedData = validateLead(body)

    const lead = await prisma.lead.create({
      data: validatedData,
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    console.error('Error creating lead:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Falha ao criar lead.' },
      { status: 500 }
    )
  }
}
