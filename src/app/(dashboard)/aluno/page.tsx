'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import AiTutorCard from '@/components/dashboard/AiTutorCard'
import {
  Calendar,
  CreditCard,
  Bookmark,
  ShieldAlert,
  Radio,
  Video,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'

interface StudentData {
  plan: string
  status: string
  startDate: string
  nextPaymentDate: string | null
  user: { name: string | null; email: string; twoFactorEnabled: boolean }
  activeRecordingsCount: number
  activeLiveSession: {
    id: string
    title: string
    description: string | null
    meetLink: string | null
    teacherName: string | null
    startedAt: string
  } | null
  upcomingClasses: Array<{
    id: string
    scheduledAt: string
    duration: number
    teacherName: string | null
    meetLink: string | null
  }>
  recentPayments: Array<{
    id: string
    amount: number
    status: string
    dueDate: string
  }>
}

const PLAN_LABELS: Record<string, string> = {
  BASIC: 'Básico',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  CUSTOM: 'Personalizado',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
  TRIAL: 'Período de Teste',
}

export default function AlunoDashboardPage() {
  const [data, setData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/aluno/dashboard')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Erro ao carregar dados')
        setData(json.student)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <DashboardShell title="Portal do Aluno" subtitle="Carregando seu ambiente de estudos...">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Preparando suas aulas e materiais...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Portal do Aluno">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || 'Dados não encontrados'}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title={`Olá, ${data.user.name?.split(' ')[0] || 'Aluno'}! 👋`}
      subtitle="Bem-vindo ao seu portal de aprendizado. Pratique com seu tutor, acesse aulas ao vivo e acompanhe seu plano."
    >
      {/* Alerta de 2FA opcional */}
      {!data.user.twoFactorEnabled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl mb-6 flex items-center justify-between gap-3 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-semibold">Aumente a segurança:</span> Ative a autenticação em 2 etapas para proteger seu progresso.
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="border-amber-300 hover:bg-amber-100 text-amber-900 whitespace-nowrap">
            <Link href="/seguranca">Ativar 2FA →</Link>
          </Button>
        </div>
      )}

      {/* Banner de Aula Ao Vivo Transmitindo Agora */}
      {data.activeLiveSession && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 text-white rounded-xl p-5 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-600 p-3 rounded-full">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-xs font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  Aula Ao Vivo Agora
                </span>
                <span className="text-xs text-red-100 font-medium">
                  Prof. {data.activeLiveSession.teacherName || 'Sarah'}
                </span>
              </div>
              <h4 className="text-lg font-bold mt-1">{data.activeLiveSession.title}</h4>
              <p className="text-sm text-purple-100 line-clamp-1">{data.activeLiveSession.description || 'Sala de conversação WebRTC em andamento'}</p>
            </div>
          </div>
          <Button asChild className="bg-white text-purple-900 hover:bg-purple-50 font-semibold shadow-md whitespace-nowrap">
            <Link href="/aluno/aulas?tab=live">
              <PlayCircle className="h-4 w-4 mr-2" />
              Entrar na Aula Ao Vivo
            </Link>
          </Button>
        </div>
      )}

      {/* Grid de KPIs do Aluno (Paleta Esmeralda & Sky) */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-emerald-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Meu Plano</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                  {PLAN_LABELS[data.plan] || data.plan}
                </h3>
                <Badge className="bg-emerald-600 text-white mt-1.5 font-semibold">
                  {STATUS_LABELS[data.status] || data.status}
                </Badge>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <Bookmark className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Aulas Agendadas</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                  {data.upcomingClasses.length}
                </h3>
                <small className="text-sky-600 font-medium">Nesta semana</small>
              </div>
              <div className="bg-sky-100 p-3 rounded-full text-sky-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Biblioteca VOD</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                  {data.activeRecordingsCount}
                </h3>
                <small className="text-indigo-600 font-medium">
                  <Link href="/aluno/aulas?tab=recordings" className="hover:underline flex items-center gap-1 mt-0.5">
                    Assistir gravações <ArrowRight className="h-3 w-3" />
                  </Link>
                </small>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <Video className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tutor IA Interativo Alex em Destaque */}
      <div className="mb-6">
        <AiTutorCard />
      </div>

      {/* Grid: Aulas Agendadas & Pagamentos */}
      <div className="grid lg:grid-cols-7 gap-6">
        {/* Próximas Aulas */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-600" />
                  Minhas Aulas Agendadas
                </CardTitle>
                <CardDescription>Horários marcados com os professores</CardDescription>
              </div>
              <Link href="/aluno/aulas" className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-medium">
                Ver todas <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Nenhuma aula agendada no momento"
                  description="Agende horários individuais de conversação ou participe das aulas ao vivo para acelerar sua fluência."
                  actionLabel="Agendar com Professor"
                  actionHref="/agendar"
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-3.5 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-sky-50/50 transition-colors border border-gray-100">
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {new Date(cls.scheduledAt).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <small className="text-gray-500">
                          Prof. {cls.teacherName || 'Sarah'} · {cls.duration} min
                        </small>
                      </div>
                      {cls.meetLink && (
                        <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                          <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                            Entrar
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Histórico Financeiro */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Minhas Mensalidades
                </CardTitle>
                <CardDescription>Comprovantes e faturas Stripe</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {data.recentPayments.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="Nenhum pagamento registrado"
                  description="Suas faturas e recibos de pagamento serão gerados e arquivados nesta área com download de comprovantes."
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.recentPayments.map((payment) => (
                    <div key={payment.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">
                          {payment.amount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </div>
                        <small className="text-gray-500">
                          Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                      <Badge
                        className={
                          payment.status === 'COMPLETED'
                            ? 'bg-emerald-600 text-white'
                            : payment.status === 'PENDING'
                              ? 'bg-amber-600 text-white'
                              : 'bg-red-600 text-white'
                        }
                      >
                        {payment.status === 'COMPLETED'
                          ? 'Pago'
                          : payment.status === 'PENDING'
                            ? 'Pendente'
                            : payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
