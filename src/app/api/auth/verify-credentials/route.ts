export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { validateLogin } from '@/lib/validation'
import {
  isAccountLocked,
  recordLoginAttempt,
  getLockoutRemainingMinutes,
} from '@/lib/account-security'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(authRateLimiter, identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde alguns minutos.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, password } = validateLogin(body)

    if (await isAccountLocked(email)) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { lockedUntil: true },
      })

      const minutes = user?.lockedUntil
        ? getLockoutRemainingMinutes(user.lockedUntil)
        : 15

      return NextResponse.json(
        { error: `Conta bloqueada. Tente novamente em ${minutes} minuto(s).` },
        { status: 423 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        twoFactorEnabled: true,
        lockedUntil: true,
      },
    })

    const userAgent = req.headers.get('user-agent') || undefined

    if (!user || !user.password) {
      await recordLoginAttempt({
        email,
        ipAddress: identifier,
        userAgent,
        success: false,
      })

      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      await recordLoginAttempt({
        email,
        ipAddress: identifier,
        userAgent,
        success: false,
        userId: user.id,
      })

      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    await recordLoginAttempt({
      email,
      ipAddress: identifier,
      userAgent,
      success: true,
      userId: user.id,
    })

    return NextResponse.json({
      success: true,
      twoFactorRequired: user.twoFactorEnabled,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    console.error('Verify credentials error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
