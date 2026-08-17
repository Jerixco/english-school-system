export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit, authRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import crypto from 'crypto'

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

    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Para evitar enumeração de emails, retornamos sucesso mesmo se o usuário não existir
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
      })
    }

    // Token enviado ao usuário é aleatório; no banco guardamos só o hash SHA-256.
    // Assim, vazamento da tabela não entrega tokens utilizáveis (equivalem a senha).
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 3600 * 1000) // 1 hora

    // Invalida solicitações anteriores para este email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: tokenHash,
        expiresAt,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação de recuperação de senha.' },
      { status: 500 }
    )
  }
}
