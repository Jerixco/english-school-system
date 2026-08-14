'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Radio,
  Video,
  PlayCircle,
  Clock,
  PlusCircle,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  UserCheck,
  Shield,
  Loader2,
  FolderSearch,
  UserX,
  CreditCard,
  Receipt,
  AlertTriangle,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface AdminData {
  metrics: {
    totalStudents: number
    activeStudents: number
    totalTeachers: number
    totalLeads: number
    totalRevenue: number
    pendingRevenue?: number
    failedRevenue?: number
    totalTransactions?: number
    completedTransactions?: number
    pendingTransactions?: number
    failedTransactions?: number
    activeLiveCount: number
    scheduledLiveCount: number
    activeRecordingsCount: number
    leadsByStatus: Record<string, number>
  }
  allPayments?: Array<{
    id: string
    amount: number
    status: string
    dueDate: string
    paidAt: string | null
    stripePaymentId: string | null
    studentName: string
    studentEmail: string
    studentPlan: string
    createdAt: string
  }>
  recentPayments: Array<{
    id: string
    amount: number
    status: string
    dueDate: string
    paidAt: string | null
    studentName: string
    studentEmail: string
  }>
  liveSessions: Array<{
    id: string
    title: string
    description: string | null
    roomName: string
    status: string
    scheduledFor: string
    duration: number
    meetLink: string | null
    teacherName: string
  }>
  recordings: Array<{
    id: string
    title: string
    description: string | null
    videoUrl: string
    thumbnailUrl: string | null
    durationMinutes: number | null
    recordedAt: string
    expiresAt: string
    daysRemaining: number
    teacherName: string
  }>
  students: Array<{
    id: string
    userId: string
    name: string
    email: string
    plan: string
    status: string
    startDate: string
    lastPaymentAmount: number | null
  }>
  leads: Array<{
    id: string
    name: string
    email: string
    phone: string | null
    status: string
    source: string | null
    notes: string | null
    createdAt: string
  }>
}

const LEAD_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Novo', color: 'bg-blue-600' },
  CONTACTED: { label: 'Contatado', color: 'bg-yellow-600' },
  CONSULTATION_SCHEDULED: { label: 'Consulta Agendada', color: 'bg-purple-600' },
  CONSULTATION_COMPLETED: { label: 'Consulta Realizada', color: 'bg-indigo-600' },
  PROPOSAL_SENT: { label: 'Proposta Enviada', color: 'bg-amber-600' },
  CONVERTED: { label: 'Convertido em Aluno', color: 'bg-green-600' },
  LOST: { label: 'Perdido', color: 'bg-gray-500' },
}

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'overview'

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'students' | 'classes' | 'financial'>(
    tabFromUrl as any
  )
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [financialSearch, setFinancialSearch] = useState('')
  const [financialStatusFilter, setFinancialStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL')
  const [newLiveTitle, setNewLiveTitle] = useState('')
  const [isCreatingLive, setIsCreatingLive] = useState(false)

  const fetchDashboardData = () => {
    setLoading(true)
    fetch('/api/admin/dashboard')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Falha ao carregar dashboard')
        setData(json)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setActiveTab((searchParams.get('tab') as any) || 'overview')
  }, [searchParams])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleUpdateLeadStatus = async (leadId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        fetchDashboardData()
      }
    } catch (e) {
      console.error('Erro ao atualizar lead:', e)
    }
  }

  const handleCreateLiveSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLiveTitle) return
    setIsCreatingLive(true)
    try {
      const res = await fetch('/api/live-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLiveTitle,
          scheduledFor: new Date().toISOString(),
          duration: 60,
        }),
      })
      if (res.ok) {
        setNewLiveTitle('')
        fetchDashboardData()
      }
    } catch (e) {
      console.error('Erro ao criar sala ao vivo:', e)
    } finally {
      setIsCreatingLive(false)
    }
  }

  if (loading && !data) {
    return (
      <DashboardShell title="Painel Administrativo" subtitle="Carregando métricas e dados...">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-500">Conectando aos serviços da escola...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Painel Administrativo">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || 'Não foi possível carregar as informações'}
        </div>
      </DashboardShell>
    )
  }

  const filteredStudents = data.students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.plan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardShell
      title="Painel Administrativo"
      subtitle="Controle central de matrículas, receita, CRM de leads e transmissões ao vivo."
    >
      {/* Navegação por Abas */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Visão Geral & KPIs
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'leads'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="h-4 w-4" />
          CRM & Funil de Leads
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {data.metrics.totalLeads}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Alunos & Matrículas
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {data.metrics.activeStudents}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'classes'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Radio className="h-4 w-4" />
          Aulas Ao Vivo & VOD
          {data.metrics.activeLiveCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              AO VIVO
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'financial'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="h-4 w-4 text-emerald-500" />
          Financeiro & Faturamento
          {(data.metrics.failedTransactions || 0) > 0 ? (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
              {data.metrics.failedTransactions} atrasado
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
              R$ {data.metrics.totalRevenue.toLocaleString('pt-BR')}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: VISÃO GERAL & KPIS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Grid de Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-slate-800 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Alunos Ativos</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                      {data.metrics.activeStudents}
                    </h3>
                    <small className="text-gray-500">de {data.metrics.totalStudents} total</small>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-full text-slate-800">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Receita Total Recebida</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                      {data.metrics.totalRevenue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </h3>
                    <small className="text-green-600 font-semibold">100% liquidados</small>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Leads no Funil CRM</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                      {data.metrics.totalLeads}
                    </h3>
                    <small className="text-blue-600 font-semibold">
                      {data.metrics.leadsByStatus['NEW'] || 0} novos contatos
                    </small>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Aulas Ao Vivo & VOD</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                      {data.metrics.activeLiveCount} <span className="text-sm font-normal text-gray-500">ao vivo</span>
                    </h3>
                    <small className="text-purple-600 font-semibold">
                      {data.metrics.activeRecordingsCount} gravações salvas
                    </small>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <Radio className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-7 gap-6">
            {/* Pagamentos Recentes */}
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Últimos Pagamentos Recebidos
                    </CardTitle>
                    <CardDescription>Fluxo financeiro com reconciliação Stripe</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {data.recentPayments.length === 0 ? (
                    <EmptyState
                      icon={CreditCard}
                      title="Nenhum pagamento registrado"
                      description="Assim que os alunos realizarem pagamentos via Stripe ou Pix, as faturas aparecerão aqui automaticamente."
                      compact
                    />
                  ) : (
                    <div className="space-y-3">
                      {data.recentPayments.map((p) => (
                        <div key={p.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                          <div>
                            <div className="font-semibold text-gray-900">{p.studentName}</div>
                            <small className="text-gray-500">{p.studentEmail}</small>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {p.amount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </div>
                            <Badge className="bg-green-600 text-xs">Pago</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Matrículas Recentes */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-slate-800" />
                    Últimos Alunos Cadastrados
                  </CardTitle>
                  <CardDescription>Matrículas ativas na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.students.length === 0 ? (
                    <EmptyState
                      icon={UserX}
                      title="Nenhum aluno cadastrado"
                      description="Quando novos interessados concluírem o cadastro ou matrícula, eles serão listados nesta área."
                      compact
                    />
                  ) : (
                    <div className="space-y-3">
                      {data.students.slice(0, 4).map((s) => (
                        <div key={s.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-900">{s.name}</div>
                            <small className="text-gray-500">Plano {s.plan}</small>
                          </div>
                          <Badge className="bg-emerald-600 text-xs text-white">{s.status}</Badge>
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
      {/* ABA 2: CRM & FUNIL DE LEADS (KANBAN)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Funil de Aquisição & CRM</h3>
              <p className="text-sm text-gray-500">
                Acompanhe e converta interessados em alunos matriculados.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Coluna 1: Novos Leads */}
            <Card className="border-t-4 border-t-blue-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between">
                  <span>Novos Contatos</span>
                  <Badge className="bg-blue-600">{data.metrics.leadsByStatus['NEW'] || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.leads.filter((l) => l.status === 'NEW').length === 0 ? (
                  <p className="text-gray-400 text-xs py-4 text-center">Nenhum novo lead</p>
                ) : (
                  data.leads
                    .filter((l) => l.status === 'NEW')
                    .map((lead) => (
                      <div key={lead.id} className="p-3 bg-gray-50 rounded-lg border text-xs space-y-2">
                        <div className="font-bold text-gray-900">{lead.name}</div>
                        <div className="text-gray-600 flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </div>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleUpdateLeadStatus(lead.id, 'CONTACTED')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                        >
                          Marcar Contatado →
                        </Button>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* Coluna 2: Contatados */}
            <Card className="border-t-4 border-t-yellow-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between">
                  <span>Em Contato</span>
                  <Badge className="bg-yellow-600">{data.metrics.leadsByStatus['CONTACTED'] || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.leads.filter((l) => l.status === 'CONTACTED').length === 0 ? (
                  <p className="text-gray-400 text-xs py-4 text-center">Nenhum lead em contato</p>
                ) : (
                  data.leads
                    .filter((l) => l.status === 'CONTACTED')
                    .map((lead) => (
                      <div key={lead.id} className="p-3 bg-gray-50 rounded-lg border text-xs space-y-2">
                        <div className="font-bold text-gray-900">{lead.name}</div>
                        <div className="text-gray-600 truncate">{lead.email}</div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateLeadStatus(lead.id, 'CONSULTATION_SCHEDULED')}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7"
                        >
                          Agendar Consulta →
                        </Button>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* Coluna 3: Consulta Agendada */}
            <Card className="border-t-4 border-t-indigo-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between">
                  <span>Consulta Agendada</span>
                  <Badge className="bg-indigo-600">
                    {data.metrics.leadsByStatus['CONSULTATION_SCHEDULED'] || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.leads.filter((l) => l.status === 'CONSULTATION_SCHEDULED').length === 0 ? (
                  <p className="text-gray-400 text-xs py-4 text-center">Nenhuma consulta pendente</p>
                ) : (
                  data.leads
                    .filter((l) => l.status === 'CONSULTATION_SCHEDULED')
                    .map((lead) => (
                      <div key={lead.id} className="p-3 bg-gray-50 rounded-lg border text-xs space-y-2">
                        <div className="font-bold text-gray-900">{lead.name}</div>
                        <div className="text-gray-600 truncate">{lead.email}</div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateLeadStatus(lead.id, 'CONVERTED')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                        >
                          Converter em Aluno 🎓
                        </Button>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* Coluna 4: Convertidos */}
            <Card className="border-t-4 border-t-emerald-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between">
                  <span>Convertidos</span>
                  <Badge className="bg-emerald-600">{data.metrics.leadsByStatus['CONVERTED'] || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.leads.filter((l) => l.status === 'CONVERTED').length === 0 ? (
                  <p className="text-gray-400 text-xs py-4 text-center">Nenhum aluno convertido ainda</p>
                ) : (
                  data.leads
                    .filter((l) => l.status === 'CONVERTED')
                    .map((lead) => (
                      <div key={lead.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                        <div className="font-bold text-emerald-900">{lead.name}</div>
                        <div className="text-emerald-700 truncate">{lead.email}</div>
                        <div className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Matrícula Realizada
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: GESTÃO DE ALUNOS & MATRÍCULAS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-slate-800" />
                  Alunos Matriculados
                </CardTitle>
                <CardDescription>
                  Gerenciamento de planos, status de matrícula e pagamentos
                </CardDescription>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, e-mail ou plano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredStudents.length === 0 ? (
                <EmptyState
                  icon={FolderSearch}
                  title="Nenhum aluno encontrado"
                  description={
                    searchTerm
                      ? `Não encontramos alunos com o termo "${searchTerm}". Tente buscar por outro nome ou plano.`
                      : "Ainda não há alunos cadastrados na plataforma."
                  }
                />
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                      <tr>
                        <th className="p-3">Nome / E-mail</th>
                        <th className="p-3">Plano</th>
                        <th className="p-3">Data Matrícula</th>
                        <th className="p-3">Último Pagamento</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-gray-900">{s.name}</div>
                            <small className="text-gray-500">{s.email}</small>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-medium">
                              {s.plan}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">
                            {new Date(s.startDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3 font-semibold text-gray-900">
                            {s.lastPaymentAmount
                              ? s.lastPaymentAmount.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })
                              : '—'}
                          </td>
                          <td className="p-3 text-right">
                            <Badge className="bg-emerald-600 text-white">{s.status}</Badge>
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

      {/* ========================================================================= */}
      {/* ABA 4: AULAS AO VIVO & VOD                                                */}
      {/* ========================================================================= */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Card para Criar Nova Transmissão Instantânea */}
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-slate-950 flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-600" />
                Criar Nova Sala de Aula Ao Vivo
              </CardTitle>
              <CardDescription>
                Abra uma sala de transmissão WebRTC instantânea para alunos e professores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLiveSession} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Título da Aula (ex: Conversação Avançada B2)..."
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  className="bg-white"
                  required
                />
                <Button type="submit" disabled={isCreatingLive} className="bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap gap-2">
                  {isCreatingLive ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando Sala...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Iniciar Sala Ao Vivo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Sessões Ao Vivo & Agendadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Transmissões Cadastradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.liveSessions.length === 0 ? (
                <EmptyState
                  icon={Radio}
                  title="Nenhuma sessão ao vivo ativa"
                  description="Crie uma nova sala acima ou aguarde o agendamento de uma aula pelos professores."
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.liveSessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={session.status === 'LIVE' ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 text-white'}>
                            {session.status === 'LIVE' ? 'Transmitindo Agora' : 'Agendada'}
                          </Badge>
                          <h4 className="font-bold text-gray-900">{session.title}</h4>
                        </div>
                        <small className="text-gray-500">
                          Prof. {session.teacherName} · {new Date(session.scheduledFor).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      {session.meetLink && (
                        <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                          <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Acessar Sala
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Gravações Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-600" />
                Gravações Salvas com Tempo de Retenção (VOD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recordings.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="Nenhuma gravação arquivada"
                  description="Aulas gravadas com thumbnails Canva e prazo de expiração de 30 dias serão listadas aqui."
                  compact
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {data.recordings.map((rec) => (
                    <div key={rec.id} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">{rec.title}</div>
                        <small className="text-gray-500">
                          Prof. {rec.teacherName} · Gravada em {new Date(rec.recordedAt).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                      <Badge className="bg-amber-600 text-white whitespace-nowrap">
                        <Clock className="h-3 w-3 mr-1" />
                        Expira em {rec.daysRemaining} dias
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: GESTÃO FINANCEIRA & FATURAMENTO GLOBAL                            */}
      {/* ========================================================================= */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-emerald-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Receita Total Liquidada</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {data.metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                    <small className="text-emerald-600 font-semibold">{data.metrics.completedTransactions || 0} faturas pagas</small>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Receita Prevista / A Vencer</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {(data.metrics.pendingRevenue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                    <small className="text-amber-600 font-semibold">{data.metrics.pendingTransactions || 0} faturas aguardando</small>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Inadimplência / Em Atraso</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {(data.metrics.failedRevenue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                    <small className="text-rose-600 font-semibold">{data.metrics.failedTransactions || 0} faturas pendentes</small>
                  </div>
                  <div className="bg-rose-100 p-3 rounded-full text-rose-700">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-800 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Volume de Transações</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">
                      {data.metrics.totalTransactions || 0}
                    </h3>
                    <small className="text-slate-600 font-semibold">Total de registros</small>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-full text-slate-800">
                    <Receipt className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-slate-900" />
                    Livro-Razão Financeiro Global
                  </CardTitle>
                  <CardDescription>
                    Audite todas as transações, parcelas pagas, pendentes e inadimplências do sistema.
                  </CardDescription>
                </div>

                {/* Filtros por status */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por aluno ou email..."
                      value={financialSearch}
                      onChange={(e) => setFinancialSearch(e.target.value)}
                      className="pl-9 text-xs h-9"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => setFinancialStatusFilter('ALL')}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        financialStatusFilter === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFinancialStatusFilter('COMPLETED')}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        financialStatusFilter === 'COMPLETED' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pagos
                    </button>
                    <button
                      onClick={() => setFinancialStatusFilter('PENDING')}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        financialStatusFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      A Vencer
                    </button>
                    <button
                      onClick={() => setFinancialStatusFilter('FAILED')}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        financialStatusFilter === 'FAILED' ? 'bg-white text-rose-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Atrasados
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {(() => {
                const payments = (data.allPayments || []).filter((p) => {
                  const matchesFilter =
                    financialStatusFilter === 'ALL' ? true : p.status === financialStatusFilter
                  const matchesSearch =
                    !financialSearch.trim() ||
                    p.studentName.toLowerCase().includes(financialSearch.toLowerCase()) ||
                    p.studentEmail.toLowerCase().includes(financialSearch.toLowerCase()) ||
                    p.id.toLowerCase().includes(financialSearch.toLowerCase())
                  return matchesFilter && matchesSearch
                })

                if (payments.length === 0) {
                  return (
                    <div className="p-8">
                      <EmptyState
                        icon={Receipt}
                        title="Nenhuma transação encontrada"
                        description="Nenhum registro corresponde aos filtros de busca aplicados."
                        actionLabel="Limpar Filtros"
                        onAction={() => {
                          setFinancialStatusFilter('ALL')
                          setFinancialSearch('')
                        }}
                        compact
                      />
                    </div>
                  )
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700">
                      <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3.5">ID / Transação</th>
                          <th className="px-6 py-3.5">Aluno & Contato</th>
                          <th className="px-6 py-3.5">Plano</th>
                          <th className="px-6 py-3.5">Valor</th>
                          <th className="px-6 py-3.5">Vencimento</th>
                          <th className="px-6 py-3.5">Liquidação</th>
                          <th className="px-6 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                              <span className="font-semibold text-gray-900 block font-sans text-sm">
                                {p.stripePaymentId ? 'Stripe Gateway' : 'Fatura Direta'}
                              </span>
                              #{p.id.slice(-8)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{p.studentName}</div>
                              <div className="text-xs text-gray-500">{p.studentEmail}</div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="text-xs font-medium">
                                {p.studentPlan}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">
                              {p.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600">
                              {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600">
                              {p.paidAt
                                ? new Date(p.paidAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={
                                  p.status === 'COMPLETED'
                                    ? 'bg-emerald-600 text-white font-semibold'
                                    : p.status === 'PENDING'
                                      ? 'bg-amber-600 text-white font-semibold'
                                      : 'bg-rose-600 text-white font-semibold'
                                }
                              >
                                {p.status === 'COMPLETED'
                                  ? 'Liquidado'
                                  : p.status === 'PENDING'
                                    ? 'A Vencer'
                                    : 'Em Atraso'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
