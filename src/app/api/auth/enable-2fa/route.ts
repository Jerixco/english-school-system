export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  generateTwoFactorSecret,
  generateQRCode,
  verifyTwoFactorToken,
  encryptTwoFactorSecret,
  decryptTwoFactorSecret,
} from '@/lib/two-factor'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAuditLog } from '@/lib/account-security'
import { getClientIdentifier } from '@/lib/rate-limiter'
import { twoFactorTokenSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, twoFactorEnabled: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA já está ativado' }, { status: 400 })
    }

    const secret = generateTwoFactorSecret(user.email)
    const qrCode = await generateQRCode(secret.otpauth_url || '')

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: encryptTwoFactorSecret(secret.base32),
        twoFactorEnabled: false,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: '2FA_SETUP_INITIATED',
      ipAddress: getClientIdentifier(req),
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      secret: secret.base32,
      qrCode,
    })
  } catch (error) {
    console.error('Enable 2FA error:', error)
    return NextResponse.json({ error: 'Erro ao habilitar 2FA' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { token } = twoFactorTokenSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: '2FA não configurado' }, { status: 400 })
    }

    const secret = decryptTwoFactorSecret(user.twoFactorSecret)
    const isValid = verifyTwoFactorToken(token, secret)

    if (!isValid) {
      return NextResponse.json({ error: 'Código inválido. Tente novamente.' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    })

    await createAuditLog({
      userId: session.user.id,
      action: '2FA_ENABLED',
      ipAddress: getClientIdentifier(req),
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({ success: true, message: '2FA ativado com sucesso' })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Código inválido' },
        { status: 400 }
      )
    }

    console.error('Verify 2FA error:', error)
    return NextResponse.json({ error: 'Erro ao verificar token' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { token, password } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user?.twoFactorEnabled || !user.twoFactorSecret || !user.password) {
      return NextResponse.json({ error: '2FA não está ativo' }, { status: 400 })
    }

    const bcrypt = await import('bcryptjs')
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    const secret = decryptTwoFactorSecret(user.twoFactorSecret)
    const isValid = verifyTwoFactorToken(token, secret)

    if (!isValid) {
      return NextResponse.json({ error: 'Código 2FA inválido' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: '2FA_DISABLED',
      ipAddress: getClientIdentifier(req),
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({ success: true, message: '2FA desativado com sucesso' })
  } catch (error) {
    console.error('Disable 2FA error:', error)
    return NextResponse.json({ error: 'Erro ao desabilitar 2FA' }, { status: 500 })
  }
}
