import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/security'
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
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso restrito a professores' }, { status: 403 })
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    if (!teacher && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Perfil de professor não encontrado' }, { status: 404 })
    }

    const teacherId = teacher ? teacher.id : (await prisma.teacher.findFirst())?.id || ''

    const [upcomingClasses, liveSessions, recordings, students] = await Promise.all([
      prisma.class.findMany({
        where: {
          teacherId,
          scheduledAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { scheduledFor: 'asc' } as any,
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
      }).catch(() =>
        prisma.class.findMany({
          where: { teacherId },
          orderBy: { scheduledAt: 'asc' },
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        })
      ),

      prisma.liveSession.findMany({
        where: { teacherId },
        orderBy: { scheduledFor: 'desc' },
        include: {
          student: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      }),

      prisma.recording.findMany({
        where: {
          teacherId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { recordedAt: 'desc' },
        include: {
          student: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      }),

      prisma.student.findMany({
        where: {
          classes: {
            some: { teacherId },
          },
        },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ])

    const now = new Date()

    return NextResponse.json({
      teacher: {
        id: teacherId,
        name: teacher?.user.name || user.name || 'Professor',
        email: teacher?.user.email || user.email,
      },
      metrics: {
        totalClasses: upcomingClasses.length,
        activeLiveCount: liveSessions.filter((s) => s.status === 'LIVE').length,
        totalRecordings: recordings.length,
        totalStudents: students.length,
      },
      upcomingClasses: upcomingClasses.map((c) => ({
        id: c.id,
        scheduledAt: c.scheduledAt,
        duration: c.duration,
        status: c.status,
        meetLink: c.meetLink,
        studentName: c.student?.user?.name || 'Aluno',
        studentEmail: c.student?.user?.email || '',
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
        studentName: s.student?.user?.name || 'Turma Aberta',
      })),
      recordings: recordings.map((r) => {
        const msRemaining = r.expiresAt.getTime() - now.getTime()
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
          studentName: r.student?.user?.name || 'Turma Geral',
        }
      }),
      students: students.map((s) => ({
        id: s.id,
        name: s.user?.name || 'Aluno',
        email: s.user?.email || '',
        plan: s.plan,
        status: s.status,
      })),
    })
  } catch (error) {
    console.error('Professor dashboard error:', error)
    return NextResponse.json({ error: 'Erro ao carregar dados do professor' }, { status: 500 })
  }
}
