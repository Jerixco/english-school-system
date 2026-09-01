import { prisma } from '@/lib/prisma'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000

export async function isAccountLocked(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true },
  })

  if (!user?.lockedUntil) return false
  return user.lockedUntil > new Date()
}

export async function recordLoginAttempt(params: {
  email: string
  ipAddress: string
  userAgent?: string
  success: boolean
  userId?: string
}) {
  await prisma.loginAttempt.create({
    data: {
      email: params.email,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      success: params.success,
      userId: params.userId,
    },
  })

  if (params.success) {
    if (params.userId) {
      await prisma.user.update({
        where: { id: params.userId },
        data: { failedLoginCount: 0, lastFailedLogin: null, lockedUntil: null },
      })
    }
    return
  }

  const user = await prisma.user.findUnique({
    where: { email: params.email },
    select: { id: true },
  })

  if (!user) return

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginCount: { increment: 1 },
      lastFailedLogin: new Date(),
    },
    select: { failedLoginCount: true },
  })

  if (updatedUser.failedLoginCount >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { id: user.id },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS), failedLoginCount: 0 },
    })
  }
}

export async function createAuditLog(params: {
  userId?: string
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
}) {
  await prisma.auditLog.create({
    data: params,
  })
}

export function getLockoutRemainingMinutes(lockedUntil: Date): number {
  const remaining = lockedUntil.getTime() - Date.now()
  return Math.ceil(remaining / 60000)
}
