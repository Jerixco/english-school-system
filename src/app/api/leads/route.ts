export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { LeadStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { validateLead } from '@/lib/validation'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getRequestUserId } from '@/lib/request-user'

export async function GET(req: NextRequest) {
  try {
    const userId = getRequestUserId(req)

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const hasStatus = status && Object.values(LeadStatus).includes(status as LeadStatus)

    if (status && !hasStatus) {
      return NextResponse.json(
        { error: 'Invalid status filter' },
        { status: 400 }
      )
    }

    const where: Prisma.LeadWhereInput = {
      userId,
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
    if (error instanceof Error && error.message.includes('X-User-Id')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getRequestUserId(req)

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    
    // Validate and sanitize input
    const validatedData = validateLead(body)

    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    console.error('Error creating lead:', error)
    
    if (error instanceof Error && error.message.includes('X-User-Id')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
