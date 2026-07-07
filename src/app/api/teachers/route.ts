import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateTeacher } from '@/lib/validation'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

export async function GET(req: NextRequest) {
  try {
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
    const isActive = searchParams.get('isActive')

    const where = isActive !== null ? { isActive: isActive === 'true' } : {}

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        classes: {
          where: {
            status: 'SCHEDULED',
            scheduledAt: {
              gte: new Date(),
            },
          },
          orderBy: {
            scheduledAt: 'asc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
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
    const validatedData = validateTeacher(body)

    const teacher = await prisma.teacher.create({
      data: validatedData,
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error: any) {
    console.error('Error creating teacher:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    )
  }
}
