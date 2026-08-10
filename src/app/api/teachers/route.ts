export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { validateTeacher, teacherFilterSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('activeOnly') !== 'false' && (!user || !isAdmin(user))

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    // Email é PII: só exposto para admin. Listagem pública leva name/image.
    const isAdminUser = Boolean(user && isAdmin(user))

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            ...(isAdminUser ? { email: true } : {}),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: 'Erro ao buscar professores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = validateTeacher(body)

    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: validatedData.userId },
    })

    if (existingTeacher) {
      return NextResponse.json({ error: 'Usuário já possui perfil de professor registrado' }, { status: 409 })
    }

    const teacher = await prisma.teacher.create({
      data: {
        userId: validatedData.userId,
        calendlyUrl: validatedData.calendlyUrl,
        bio: validatedData.bio,
        specialties: validatedData.specialties || [],
        availability: validatedData.availability || [],
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

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }
    console.error('Error creating teacher:', error)
    return NextResponse.json({ error: 'Erro ao criar professor' }, { status: 500 })
  }
}
