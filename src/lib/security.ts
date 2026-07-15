import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

// ============================================
// TIPOS DE SEGURANÇA
// ============================================

export enum AuthorizationError {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
}

export interface AuthenticatedUser {
  id: string
  email: string
  role: Role
  name: string | null
}

// ============================================
// AUTENTICAÇÃO
// ============================================

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    })

    if (!user) {
      return null
    }

    return user as AuthenticatedUser
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

// ============================================
// AUTORIZAÇÃO
// ============================================

/**
 * Verifica se usuário tem uma das roles especificadas
 */
export function hasRole(user: AuthenticatedUser, roles: Role[]): boolean {
  return roles.includes(user.role)
}

/**
 * Verifica se usuário é admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'ADMIN'
}

/**
 * Verifica se usuário é teacher
 */
export function isTeacher(user: AuthenticatedUser): boolean {
  return user.role === 'TEACHER'
}

/**
 * Verifica se usuário é student
 */
export function isStudent(user: AuthenticatedUser): boolean {
  return user.role === 'STUDENT'
}

/**
 * Verifica se usuário é owner do resource ou admin
 */
export function isOwnerOrAdmin(user: AuthenticatedUser, resourceOwnerId: string): boolean {
  return user.id === resourceOwnerId || isAdmin(user)
}

// ============================================
// RESPOSTA SEGURA
// ============================================

export interface SecureResponseOptions {
  statusCode?: number
  includeStackTrace?: boolean
}

/**
 * Cria resposta de erro segura sem expor informações sensíveis
 */
export function createErrorResponse(
  error: Error | string,
  statusCode = 500,
  options: SecureResponseOptions = {}
) {
  const message = typeof error === 'string' ? error : error.message

  // Log completo em server (para debug)
  if (typeof error !== 'string') {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }

  // Response segura (sem expor detalhes internos)
  const response = {
    error: sanitizeErrorMessage(message),
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status: statusCode })
}

/**
 * Sanitiza mensagem de erro para não expor detalhes sensíveis
 */
function sanitizeErrorMessage(message: string): string {
  // Remover paths, URLs, dados sensíveis
  return message
    .replace(/\/.*\//g, '/***/')
    .replace(/\n/g, ' ')
    .substring(0, 200)
}

// ============================================
// VALIDAÇÃO DE IP E USER AGENT
// ============================================

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

export function getUserAgent(req: NextRequest): string {
  return req.headers.get('user-agent') || 'unknown'
}

// ============================================
// AUDIT LOG HELPER
// ============================================

export async function logAuditAction(
  userId: string | null,
  action: string,
  details: Record<string, unknown>,
  req: NextRequest,
  status: 'success' | 'failure' = 'success'
) {
  try {
    const ipAddress = getClientIp(req)
    const userAgent = getUserAgent(req)

    await prisma.auditLog.create({
      data: {
        userId: userId || undefined,
        action: `${action}_${status.toUpperCase()}`,
        details: JSON.stringify({
          ...details,
          status,
          ipAddress,
          userAgent,
        }),
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Log audit error mas não quebra a aplicação
    console.error('Failed to log audit action:', error)
  }
}

// ============================================
// VERIFICAÇÃO DE RECURSO
// ============================================

export async function verifyStudentAccess(
  userId: string,
  studentId: string,
  user: AuthenticatedUser
): Promise<boolean> {
  // Admin pode acessar qualquer um
  if (isAdmin(user)) {
    return true
  }

  // Estudante só acessa a si mesmo
  if (isStudent(user)) {
    return user.id === studentId
  }

  // Teacher não pode acessar diretamente
  return false
}

export async function verifyTeacherAccess(
  userId: string,
  teacherId: string,
  user: AuthenticatedUser
): Promise<boolean> {
  // Admin pode acessar qualquer um
  if (isAdmin(user)) {
    return true
  }

  // Teacher acessa a si mesmo
  if (isTeacher(user)) {
    return user.id === teacherId
  }

  // Student não pode acessar diretamente
  return false
}

// ============================================
// VERIFICAÇÃO DE PLANO ATIVO
// ============================================

export async function isStudentPlanActive(studentId: string): Promise<boolean> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { status: true },
    })

    return student?.status === 'ACTIVE'
  } catch (error) {
    console.error('Error checking student plan:', error)
    return false
  }
}

// ============================================
// VERIFICAÇÃO DE DISPONIBILIDADE
// ============================================

export async function isTeacherAvailable(
  teacherId: string,
  scheduledAt: Date,
  duration: number,
  excludeClassId?: string
): Promise<boolean> {
  try {
    const conflictingClass = await prisma.class.findFirst({
      where: {
        teacherId,
        status: {
          in: ['SCHEDULED', 'COMPLETED'],
        },
        scheduledAt: {
          lt: new Date(scheduledAt.getTime() + duration * 60000),
          gt: new Date(scheduledAt.getTime() - 60 * 60000), // 1h antes
        },
        ...(excludeClassId && { id: { not: excludeClassId } }),
      },
    })

    return !conflictingClass
  } catch (error) {
    console.error('Error checking teacher availability:', error)
    return false
  }
}

// ============================================
// SANITIZAÇÃO DE DADOS
// ============================================

/**
 * Remove campos sensíveis antes de retornar ao cliente
 */
export function sanitizeUserData(user: any) {
  const { password, twoFactorSecret, ...safe } = user
  return safe
}

/**
 * Remove dados bancários/sensíveis de payments
 */
export function sanitizePaymentData(payment: any) {
  // Nunca retornar dados completos do cartão/banco
  const { stripePaymentId, ...safe } = payment
  return {
    ...safe,
    // Mostrar apenas últimos 4 dígitos se aplicável
    maskedPaymentId: stripePaymentId
      ? `***${stripePaymentId.slice(-4)}`
      : undefined,
  }
}
