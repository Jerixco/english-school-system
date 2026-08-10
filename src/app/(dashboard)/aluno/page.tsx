'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CreditCard, Bookmark, ShieldAlert, Radio, Video, PlayCircle, Clock } from 'lucide-react'
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
      <DashboardShell title="Portal do Aluno" subtitle="Carregando...">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
      title={`Olá, ${data.user.name?.split(' ')[0] || 'Aluno'}!`}
      subtitle="Bem-vindo ao seu portal de estudos"
    >
      {!data.user.twoFactorEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <div>
            Proteja sua conta ativando a{' '}
            <Link href="/seguranca" className="underline font-medium">
              autenticação em duas etapas (2FA)
            </Link>
            .
          </div>
        </div>
      )}

      {/* Banner de Aula Ao Vivo Transmitindo Agora */}
      {data.activeLiveSession && (
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-xl p-5 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-600 p-3 rounded-full">
              <Radio className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Ao Vivo Agora
                </span>
                <span className="text-xs text-red-100">
                  Prof. {data.activeLiveSession.teacherName || 'Alex'}
                </span>
              </div>
              <h4 className="text-lg font-bold mt-0.5">{data.activeLiveSession.title}</h4>
              <p className="text-sm text-purple-100 line-clamp-1">{data.activeLiveSession.description}</p>
            </div>
          </div>
          <Button asChild className="bg-white text-purple-700 hover:bg-purple-50 font-semibold shadow-md whitespace-nowrap">
            <Link href="/aluno/aulas?tab=live">
              <PlayCircle className="h-4 w-4 mr-2" />
              Entrar na Aula Ao Vivo
            </Link>
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Plano Atual</h6>
            </div>
            <h3 className="text-2xl font-bold">{PLAN_LABELS[data.plan] || data.plan}</h3>
            <Badge className="bg-green-600 mt-1">{STATUS_LABELS[data.status] || data.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Próximas Aulas</h6>
            </div>
            <h3 className="text-2xl font-bold">{data.upcomingClasses.length}</h3>
            <small className="text-gray-500">Agendadas nesta semana</small>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Gravações Salvas</h6>
            </div>
            <h3 className="text-2xl font-bold">{data.activeRecordingsCount}</h3>
            <small className="text-gray-500">
              <Link href="/aluno/aulas?tab=recordings" className="text-purple-600 hover:underline">
                Acessar biblioteca VOD →
              </Link>
            </small>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-7 gap-4">
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Próximas Aulas Agendadas
              </CardTitle>
              <Link href="/aluno/aulas" className="text-xs text-purple-600 hover:underline">
                Ver todas →
              </Link>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>Nenhuma aula agendada para os próximos dias.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(cls.scheduledAt).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <small className="text-gray-500">
                          Prof. {cls.teacherName || 'Alex'} · {cls.duration} min
                        </small>
                      </div>
                      {cls.meetLink && (
                        <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
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

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Pagamentos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>Nenhum pagamento registrado.</p>
                </div>
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
                            ? 'bg-green-600'
                            : payment.status === 'PENDING'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
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
