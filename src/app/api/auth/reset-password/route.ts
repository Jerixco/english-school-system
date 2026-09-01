export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { passwordSchema } from '@/lib/validations'
import { z } from 'zod'

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

    if (!token || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Política de senha forte (maiúscula, minúscula, número), não só comprimento.
    const passwordCheck = passwordSchema.safeParse(password)
    if (!passwordCheck.success) {
      return NextResponse.json(
        { error: passwordCheck.error.issues[0]?.message || 'Senha fraca' },
        { status: 400 }
      )
    }

    // Compara pelo hash: o link traz o token bruto, o banco guarda só o SHA-256.
    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex')

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        token: tokenHash,
      },
    })

    if (!resetRecord || resetRecord.used) {
      return NextResponse.json(
        { error: 'Token inválido ou já utilizado' },
        { status: 400 }
      )
    }

    const normalizedEmail = (resetRecord.email || String(email || '')).toLowerCase().trim()

    const now = new Date()

    if (resetRecord.expiresAt < now) {
      await prisma.passwordResetToken.deleteMany({
        where: { email: normalizedEmail },
      })
      return NextResponse.json(
        { error: 'Token expirado. Solicite uma nova recuperação.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      // A atualização condicional faz o claim do token de forma atômica e
      // impede que duas requisições concorrentes redefinam a mesma senha.
      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: resetRecord.id, used: false, expiresAt: { gt: now } },
        data: { used: true },
      })

      if (claimed.count !== 1) {
        throw new Error('RESET_TOKEN_INVALID')
      }

      // passwordChangedAt invalida todas as sessões JWT emitidas antes da troca.
      await tx.user.update({
        where: { email: normalizedEmail },
        data: { password: hashedPassword, passwordChangedAt: new Date() },
      })

      // Marca usado e remove qualquer outro token pendente do email.
      await tx.passwordResetToken.deleteMany({
        where: { email: normalizedEmail, used: false },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'RESET_TOKEN_INVALID') {
      return NextResponse.json(
        { error: 'Token inválido ou já utilizado' },
        { status: 400 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
