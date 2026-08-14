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
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Download,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
    paidAt: string | null
    stripePaymentId: string | null
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
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'financeiro' ? 'financeiro' : 'overview'
  const [activeTab, setActiveTab] = useState<'overview' | 'financeiro'>(initialTab)
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL')
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
          <p className="text-gray-500">Preparando suas aulas e informações financeiras...</p>
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

  const completedPayments = data.recentPayments.filter((p) => p.status === 'COMPLETED')
  const pendingPayments = data.recentPayments.filter((p) => p.status === 'PENDING')
  const failedPayments = data.recentPayments.filter((p) => p.status === 'FAILED')

  const filteredPayments = data.recentPayments.filter((p) => {
    if (paymentFilter === 'ALL') return true
    return p.status === paymentFilter
  })

  const totalPaid = completedPayments.reduce((acc, p) => acc + p.amount, 0)

  return (
    <DashboardShell
      title={`Olá, ${data.user.name?.split(' ')[0] || 'Aluno'}! 👋`}
      subtitle="Bem-vindo ao seu portal de estudos. Acompanhe suas aulas, converse com o tutor e gerencie seu plano e parcelas."
    >
      {/* Alerta de 2FA opcional */}
      {!data.user.twoFactorEnabled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl mb-6 flex items-center justify-between gap-3 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-semibold">Aumente a segurança:</span> Ative a autenticação em 2 etapas para proteger sua conta.
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="border-amber-300 hover:bg-amber-100 text-amber-900 whitespace-nowrap">
            <Link href="/seguranca">Ativar 2FA →</Link>
          </Button>
        </div>
      )}

      {/* Navegação de Abas do Aluno */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Aulas & Aprendizado
        </button>

        <button
          onClick={() => setActiveTab('financeiro')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'financeiro'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Controle Financeiro & Parcelas
          {failedPayments.length > 0 ? (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
              {failedPayments.length} em atraso
            </span>
          ) : pendingPayments.length > 0 ? (
            <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingPayments.length} pendente
            </span>
          ) : null}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: AULAS & APRENDIZADO                                               */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Banner de Aula Ao Vivo Transmitindo Agora */}
          {data.activeLiveSession && (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 text-white rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
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

          {/* Grid de KPIs do Aluno */}
          <div className="grid md:grid-cols-3 gap-4">
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
          <div>
            <AiTutorCard />
          </div>

          {/* Grid: Aulas Agendadas & Próximas Mensalidades */}
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

            {/* Resumo de Mensalidades */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                      Minhas Mensalidades
                    </CardTitle>
                    <CardDescription>Comprovantes e faturas</CardDescription>
                  </div>
                  <button
                    onClick={() => setActiveTab('financeiro')}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    Ver controle completo <ArrowRight className="h-3 w-3" />
                  </button>
                </CardHeader>
                <CardContent>
                  {data.recentPayments.length === 0 ? (
                    <EmptyState
                      icon={CreditCard}
                      title="Nenhum pagamento registrado"
                      description="Suas faturas e recibos de pagamento serão gerados e arquivados nesta área."
                      compact
                    />
                  ) : (
                    <div className="space-y-3">
                      {data.recentPayments.slice(0, 4).map((payment) => (
                        <div key={payment.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100">
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
                                : 'Em Atraso'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CONTROLE FINANCEIRO DO ALUNO                                      */}
      {/* ========================================================================= */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          {/* Card de Visão Geral do Plano e Ciclo */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/30">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    Plano Atual
                  </span>
                  <Badge className="bg-emerald-600 text-white">
                    {STATUS_LABELS[data.status] || data.status}
                  </Badge>
                </div>
                <h3 className="text-3xl font-black tracking-tight">
                  English School {PLAN_LABELS[data.plan] || data.plan}
                </h3>
                <p className="text-gray-300 text-sm max-w-xl">
                  Acesso ilimitado à plataforma, agendamento de aulas com professores nativos e gravação de todas as sessões.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg">
                  <Link href="/planos">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Alterar / Fazer Upgrade
                  </Link>
                </Button>
                {data.plan !== 'PREMIUM' && (
                  <Button asChild variant="outline" className="border-gray-600 bg-slate-800/60 text-white hover:bg-slate-700">
                    <Link href={`/checkout/sandbox?plan=${data.plan.toLowerCase()}`}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Renovar Antecipado
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/60 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Membro desde:</span>
                <span className="font-semibold text-white">
                  {new Date(data.startDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Próxima Renovação:</span>
                <span className="font-semibold text-emerald-400">
                  {data.nextPaymentDate
                    ? new Date(data.nextPaymentDate).toLocaleDateString('pt-BR')
                    : 'Sem data de renovação agendada'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Total Quitado na Plataforma:</span>
                <span className="font-semibold text-white">
                  {totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          {/* Mini Cards de Métricas de Parcelas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-600 shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Parcelas Pagas</p>
                    <h4 className="text-2xl font-black text-gray-900 mt-1">{completedPayments.length}</h4>
                    <span className="text-xs text-emerald-600 font-medium">100% em dia</span>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Parcelas A Vencer</p>
                    <h4 className="text-2xl font-black text-gray-900 mt-1">{pendingPayments.length}</h4>
                    <span className="text-xs text-amber-600 font-medium">Disponíveis para quitação</span>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-600 shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Parcelas em Atraso</p>
                    <h4 className="text-2xl font-black text-gray-900 mt-1">{failedPayments.length}</h4>
                    <span className="text-xs text-rose-600 font-medium">
                      {failedPayments.length > 0 ? 'Regularização necessária' : 'Nenhuma pendência'}
                    </span>
                  </div>
                  <div className="bg-rose-100 p-3 rounded-full text-rose-700">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Extrato de Parcelas e Faturas */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-emerald-700" />
                  Extrato e Histórico de Parcelas
                </CardTitle>
                <CardDescription>
                  Visualize todos os seus pagamentos, parcelas disponíveis e emita recibos.
                </CardDescription>
              </div>

              {/* Filtros de Status de Pagamento */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setPaymentFilter('ALL')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    paymentFilter === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas ({data.recentPayments.length})
                </button>
                <button
                  onClick={() => setPaymentFilter('COMPLETED')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    paymentFilter === 'COMPLETED' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pagas ({completedPayments.length})
                </button>
                <button
                  onClick={() => setPaymentFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    paymentFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  A Vencer ({pendingPayments.length})
                </button>
                {failedPayments.length > 0 && (
                  <button
                    onClick={() => setPaymentFilter('FAILED')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      paymentFilter === 'FAILED' ? 'bg-white text-rose-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Em Atraso ({failedPayments.length})
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredPayments.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={CreditCard}
                    title="Nenhuma fatura encontrada neste filtro"
                    description="Não há registros de pagamento que correspondam ao status selecionado."
                    actionLabel="Ver todas as faturas"
                    onAction={() => setPaymentFilter('ALL')}
                    compact
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Fatura / Descrição</th>
                        <th className="px-6 py-3.5">Vencimento</th>
                        <th className="px-6 py-3.5">Data de Pagamento</th>
                        <th className="px-6 py-3.5">Valor</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-100 p-2 rounded-lg text-slate-700">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="font-semibold block">
                                  Mensalidade Plano {PLAN_LABELS[data.plan] || data.plan}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">ID: {payment.id.slice(-8)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {payment.amount.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                payment.status === 'COMPLETED'
                                  ? 'bg-emerald-600 text-white font-semibold'
                                  : payment.status === 'PENDING'
                                    ? 'bg-amber-600 text-white font-semibold'
                                    : 'bg-red-600 text-white font-semibold'
                              }
                            >
                              {payment.status === 'COMPLETED'
                                ? 'Liquidado'
                                : payment.status === 'PENDING'
                                  ? 'A Vencer'
                                  : 'Em Atraso'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {payment.status === 'COMPLETED' ? (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Quitado
                              </span>
                            ) : (
                              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs">
                                <Link href={`/checkout/sandbox?plan=${data.plan.toLowerCase()}`}>
                                  Pagar Agora →
                                </Link>
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
