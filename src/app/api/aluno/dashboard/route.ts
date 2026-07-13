import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { name: true, email: true, twoFactorEnabled: true },
        },
        classes: {
          where: {
            scheduledAt: { gte: new Date() },
            status: 'SCHEDULED',
          },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
          include: {
            teacher: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
        payments: {
          orderBy: { dueDate: 'desc' },
          take: 3,
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Perfil de aluno não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      student: {
        id: student.id,
        plan: student.plan,
        status: student.status,
        startDate: student.startDate,
        nextPaymentDate: student.nextPaymentDate,
        user: student.user,
        upcomingClasses: student.classes.map((c) => ({
          id: c.id,
          scheduledAt: c.scheduledAt,
          duration: c.duration,
          teacherName: c.teacher.user.name,
          meetLink: c.meetLink,
        })),
        recentPayments: student.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          dueDate: p.dueDate,
        })),
      },
    })
  } catch (error) {
    console.error('Student dashboard error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
