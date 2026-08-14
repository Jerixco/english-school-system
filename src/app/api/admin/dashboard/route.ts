import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 })
    }

    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })
    }

    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      totalLeads,
      leadsByStatus,
      completedPayments,
      pendingPayments,
      failedPayments,
      allPaymentsList,
      liveSessions,
      recordings,
      recentStudents,
      allLeads,
    ] = await Promise.all([
      // 1. Total de alunos
      prisma.student.count(),
      // 2. Alunos ativos
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      // 3. Total de professores
      prisma.teacher.count({ where: { isActive: true } }),
      // 4. Total de leads
      prisma.lead.count(),
      // 5. Leads por status
      prisma.lead.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      // 6. Pagamentos concluídos (para cálculo de MRR / Receita Total)
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // 7. Pagamentos pendentes
      prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // 8. Pagamentos falhos / em atraso
      prisma.payment.aggregate({
        where: { status: 'FAILED' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // 9. Todos os pagamentos (Livro razão financeiro)
      prisma.payment.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
      }),
      // 10. Sessões ao vivo (ativas e agendadas)
      prisma.liveSession.findMany({
        take: 10,
        orderBy: { scheduledFor: 'asc' },
        include: {
          teacher: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      }),
      // 11. Gravações ativas (não expiradas)
      prisma.recording.findMany({
        where: { expiresAt: { gt: new Date() } },
        take: 10,
        orderBy: { recordedAt: 'desc' },
        include: {
          teacher: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      }),
      // 12. Alunos recentes
      prisma.student.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          payments: {
            where: { status: 'COMPLETED' },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      // 13. Todos os leads recentes
      prisma.lead.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const totalRevenueCents = completedPayments._sum.amount || 0
    const totalRevenueReais = totalRevenueCents / 100
    const pendingRevenueReais = (pendingPayments._sum.amount || 0) / 100
    const failedRevenueReais = (failedPayments._sum.amount || 0) / 100

    return NextResponse.json({
      metrics: {
        totalStudents,
        activeStudents,
        totalTeachers,
        totalLeads,
        totalRevenue: totalRevenueReais,
        pendingRevenue: pendingRevenueReais,
        failedRevenue: failedRevenueReais,
        completedTransactions: completedPayments._count.id || 0,
        pendingTransactions: pendingPayments._count.id || 0,
        failedTransactions: failedPayments._count.id || 0,
        totalTransactions: allPaymentsList.length,
        activeLiveCount: liveSessions.filter((s) => s.status === 'LIVE').length,
        scheduledLiveCount: liveSessions.filter((s) => s.status === 'SCHEDULED').length,
        activeRecordingsCount: recordings.length,
        leadsByStatus: leadsByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count.id
          return acc
        }, {} as Record<string, number>),
      },
      allPayments: allPaymentsList.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        status: p.status,
        dueDate: p.dueDate,
        paidAt: p.paidAt,
        stripePaymentId: p.stripePaymentId,
        studentName: p.student.user.name || 'Aluno',
        studentEmail: p.student.user.email,
        studentPlan: p.student.plan,
        createdAt: p.createdAt,
      })),
      recentPayments: allPaymentsList.slice(0, 5).map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        status: p.status,
        dueDate: p.dueDate,
        paidAt: p.paidAt,
        studentName: p.student.user.name || 'Aluno',
        studentEmail: p.student.user.email,
      })),
      liveSessions: liveSessions.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        roomName: s.roomName,
        status: s.status,
        scheduledFor: s.scheduledFor,
        duration: s.duration,
        meetLink: s.meetLink,
        teacherName: s.teacher.user.name || 'Professor',
      })),
      recordings: recordings.map((r) => {
        const msRemaining = r.expiresAt.getTime() - Date.now()
        const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
        return {
          id: r.id,
          title: r.title,
          description: r.description,
          videoUrl: r.videoUrl,
          thumbnailUrl: r.thumbnailUrl,
          durationMinutes: r.durationMinutes,
          recordedAt: r.recordedAt,
          expiresAt: r.expiresAt,
          daysRemaining,
          teacherName: r.teacher.user.name || 'Professor',
        }
      }),
      students: recentStudents.map((s) => ({
        id: s.id,
        userId: s.user.id,
        name: s.user.name || 'Aluno',
        email: s.user.email,
        plan: s.plan,
        status: s.status,
        startDate: s.startDate,
        lastPaymentAmount: s.payments[0] ? s.payments[0].amount / 100 : null,
      })),
      leads: allLeads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        status: l.status,
        source: l.source,
        notes: l.notes,
        createdAt: l.createdAt,
      })),
    })
  } catch (error) {
    console.error('Admin dashboard API error:', error)
    return NextResponse.json({ error: 'Erro ao carregar dados do dashboard administrativo' }, { status: 500 })
  }
}
