export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(authRateLimiter, identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    const { email, token, password } = await req.json()

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      )
    }

    const verificationRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    })

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    if (verificationRecord.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: email, token },
      })
      return NextResponse.json(
        { error: 'Token expirado. Solicite uma nova recuperação.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email },
        data: { password: hashedPassword },
      })

      await tx.verificationToken.deleteMany({
        where: { identifier: email },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
