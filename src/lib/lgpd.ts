import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

/**
 * Anonimiza os dados pessoais de um usuário (Conformidade LGPD Art. 18 - Direito ao Esquecimento).
 * Preserva a integridade referencial para fins contábeis e fiscais sem manter PII em texto claro.
 */
export async function anonymizeUser(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return false

    const anonymizedHash = createHash('sha256').update(`${userId}-${Date.now()}`).digest('hex').substring(0, 12)
    const anonymizedEmail = `deleted_${anonymizedHash}@deleted.lgpd`

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          name: 'Usuário Anonimizado (LGPD)',
          email: anonymizedEmail,
          password: null,
          twoFactorSecret: null,
          twoFactorEnabled: false,
          deletedAt: new Date(),
        },
      }),
      prisma.lead.updateMany({
        where: { userId },
        data: {
          name: 'Lead Anonimizado',
          email: anonymizedEmail,
          phone: null,
          notes: null,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: null,
          action: 'LGPD_DATA_ANONYMIZED',
          details: `Dados do usuário ID ${userId} foram anonimizados conforme LGPD Art. 18.`,
        },
      }),
    ])

    return true
  } catch (error) {
    console.error('Erro na anonimização LGPD:', error)
    return false
  }
}
