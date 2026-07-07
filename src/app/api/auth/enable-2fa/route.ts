import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTwoFactorSecret, generateQRCode } from '@/lib/two-factor'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const secret = generateTwoFactorSecret()
    const qrCode = await generateQRCode(secret.otpauth_url || '')

    // Store the secret temporarily (in production, use a more secure method)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret.base32,
      },
    })

    return NextResponse.json({
      secret: secret.base32,
      qrCode,
    })
  } catch (error) {
    console.error('Enable 2FA error:', error)
    return NextResponse.json(
      { error: 'Erro ao habilitar 2FA' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { token } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA não configurado' },
        { status: 400 }
      )
    }

    // Verify the token
    const { verifyTwoFactorToken } = await import('@/lib/two-factor')
    const isValid = verifyTwoFactorToken(token, user.twoFactorSecret)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify 2FA error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar token' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disable 2FA error:', error)
    return NextResponse.json(
      { error: 'Erro ao desabilitar 2FA' },
      { status: 500 }
    )
  }
}
