'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Calendar, Users, Radio, Video, PlayCircle, Clock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface ProfessorDashboardData {
  teacher: { id: string; name: string; email: string }
  metrics: {
    totalClasses: number
    activeLiveCount: number
    totalRecordings: number
    totalStudents: number
  }
  upcomingClasses: Array<{
    id: string
    scheduledAt: string
    duration: number
    status: string
    meetLink: string | null
    studentName: string
    studentEmail: string
  }>
  liveSessions: Array<{
    id: string
    title: string
    status: string
    scheduledFor: string
    meetLink: string | null
    studentName: string
  }>
}

export default function ProfessorDashboardPage() {
  const [data, setData] = useState<ProfessorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/professor/dashboard')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Erro ao carregar painel')
        setData(json)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <DashboardShell title="Portal do Professor" subtitle="Carregando informações...">
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-muted/60 animate-pulse mx-auto mb-4"></div>
          <p className="text-[hsl(20,5%,45%)]">Conectando à sua área docente...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Portal do Professor">
        <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md">
          {error || 'Não foi possível carregar as informações'}
        </div>
      </DashboardShell>
    )
  }

  const activeLive = data.liveSessions.find((s) => s.status === 'LIVE')

  return (
    <DashboardShell
      title={`Olá, Prof. ${data.teacher.name.split(' ')[0]}!`}
      subtitle="Gerencie suas turmas, transmita aulas ao vivo e acompanhe seus alunos."
    >
      {/* Banner se houver aula ao vivo */}
      {activeLive && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white rounded-xl p-5 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-600 p-3 rounded-full">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-red-500 text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
                Sua Sala Está Ao Vivo
              </span>
              <h4 className="text-lg font-bold mt-1">{activeLive.title}</h4>
            </div>
          </div>
          <Button asChild className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold shadow-md">
            <Link href="/professor/aulas?tab=live">
              <PlayCircle className="h-4 w-4 mr-2" />
              Retornar à Transmissão
            </Link>
          </Button>
        </div>
      )}

      {/* Grid de KPIs com acentos Índigo & Violeta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-indigo-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Aulas Agendadas</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {data.metrics.totalClasses}
                </h3>
                <small className="text-indigo-600 font-medium">Próximos atendimentos</small>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Meus Alunos</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {data.metrics.totalStudents}
                </h3>
                <small className="text-violet-600 font-medium">Matrículas ativas</small>
              </div>
              <div className="bg-violet-100 p-3 rounded-full text-violet-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Aulas Ao Vivo & VOD</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {data.metrics.activeLiveCount} <span className="text-sm font-normal text-gray-500">ao vivo</span>
                </h3>
                <small className="text-rose-600 font-medium">
                  {data.metrics.totalRecordings} gravações ativas
                </small>
              </div>
              <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                <Radio className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        {/* Próximas Aulas Agendadas */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Próximas Aulas Agendadas
                </CardTitle>
                <CardDescription>Atendimentos e mentorias desta semana</CardDescription>
              </div>
              <Link href="/professor/aulas?tab=schedule" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                Ver grade completa <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Nenhuma aula agendada no momento"
                  description="Assim que novos alunos agendarem horários pela plataforma ou Calendly, os atendimentos serão sincronizados aqui."
                  actionLabel="Abrir Sala Ao Vivo Instantânea"
                  actionHref="/professor/aulas?tab=live"
                  actionIcon={Radio}
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.slice(0, 4).map((cls) => (
                    <div key={cls.id} className="p-3.5 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-indigo-50/50 transition-colors border border-gray-100">
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {new Date(cls.scheduledAt).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <small className="text-gray-500">
                          Aluno: {cls.studentName} · {cls.duration} min
                        </small>
                      </div>
                      {cls.meetLink && (
                        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <a href={cls.meetLink} target="_blank" rel="noopener noreferrer">
                            Entrar na Sala
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

        {/* Ações Rápidas do Docente */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="h-5 w-5 text-indigo-600" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Ferramentas de transmissão e material de apoio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white justify-start h-12 shadow-sm">
                <Link href="/professor/aulas?tab=live">
                  <Radio className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-bold text-sm">Abrir Sala de Aula Ao Vivo</div>
                    <div className="text-xs text-indigo-100 font-normal">Iniciar transmissão WebRTC integrada</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-12 border-indigo-200 hover:bg-indigo-50 text-indigo-900">
                <Link href="/professor/aulas?tab=recordings">
                  <Video className="h-5 w-5 mr-3 text-indigo-600" />
                  <div>
                    <div className="font-bold text-sm">Disponibilizar Gravação (VOD)</div>
                    <div className="text-xs text-gray-500 font-normal">Cadastrar thumbnail Canva e expiração</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-12 border-indigo-200 hover:bg-indigo-50 text-indigo-900">
                <Link href="/seguranca">
                  <ShieldCheck className="h-5 w-5 mr-3 text-indigo-600" />
                  <div>
                    <div className="font-bold text-sm">Segurança da Conta & 2FA</div>
                    <div className="text-xs text-gray-500 font-normal">Configurar autenticação em 2 fatores</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
