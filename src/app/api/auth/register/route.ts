export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { validateRegister } from '@/lib/validation'
import { createAuditLog } from '@/lib/account-security'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(authRateLimiter, identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, password } = validateRegister(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      })

      await tx.student.create({
        data: {
          userId: newUser.id,
          plan: 'BASIC',
          status: 'TRIAL',
        },
      })

      return newUser
    })

    await createAuditLog({
      userId: user.id,
      action: 'USER_REGISTERED',
      details: `Novo usuário registrado: ${email}`,
      ipAddress: identifier,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Conta criada com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta. Verifique se o banco de dados está configurado.' },
      { status: 500 }
    )
  }
}
