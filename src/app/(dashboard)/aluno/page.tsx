'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CreditCard, Bookmark, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

interface StudentData {
  plan: string
  status: string
  startDate: string
  nextPaymentDate: string | null
  user: { name: string | null; email: string; twoFactorEnabled: boolean }
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
          <ShieldAlert className="h-5 w-5" />
          <div>
            Proteja sua conta ativando a{' '}
            <Link href="/seguranca" className="underline font-medium">
              autenticação em duas etapas (2FA)
            </Link>
            .
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Plano</h6>
            </div>
            <h3 className="text-2xl font-bold">{PLAN_LABELS[data.plan] || data.plan}</h3>
            <Badge className="bg-green-600">{STATUS_LABELS[data.status] || data.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Próximas Aulas</h6>
            </div>
            <h3 className="text-2xl font-bold">{data.upcomingClasses.length}</h3>
            <small className="text-gray-500">Agendadas</small>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h6 className="font-semibold text-gray-600">Membro desde</h6>
            </div>
            <h3 className="text-2xl font-bold">
              {new Date(data.startDate).toLocaleDateString('pt-BR', {
                month: 'short',
                year: 'numeric',
              })}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-7 gap-4">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Aulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <p className="text-gray-500">Nenhuma aula agendada no momento.</p>
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.map((cls) => (
                    <div key={cls.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {new Date(cls.scheduledAt).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <small className="text-gray-500">
                            Prof. {cls.teacherName || 'A definir'} · {cls.duration} min
                          </small>
                        </div>
                        {cls.meetLink && (
                          <Button asChild size="sm">
                            <a
                              href={cls.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Entrar
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamentos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentPayments.length === 0 ? (
                <p className="text-gray-500">Nenhum pagamento registrado.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <div className="font-medium">
                          R$ {payment.amount.toFixed(2)}
                        </div>
                        <small className="text-gray-500">
                          Vencimento:{' '}
                          {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
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
