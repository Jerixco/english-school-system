import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'
import { getDashboardUrl } from '@/lib/roles'

export { getDashboardUrl }

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role as Role)) {
    redirect(getDashboardUrl(user.role))
  }
  return user
}
