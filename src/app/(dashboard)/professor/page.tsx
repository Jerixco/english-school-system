'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Radio, Video, PlayCircle, Clock, ArrowRight } from 'lucide-react'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Conectando à sua área docente...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Portal do Professor">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
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
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-xl p-5 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
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
          <Button asChild className="bg-white text-purple-700 hover:bg-purple-50 font-semibold shadow-md">
            <Link href="/professor/aulas?tab=live">
              <PlayCircle className="h-4 w-4 mr-2" />
              Retornar à Transmissão
            </Link>
          </Button>
        </div>
      )}

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Aulas Agendadas</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {data.metrics.totalClasses}
                </h3>
                <small className="text-gray-500">Próximos atendimentos</small>
              </div>
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Meus Alunos</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {data.metrics.totalStudents}
                </h3>
                <small className="text-blue-600 font-semibold">Matrículas ativas</small>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Users className="h-6 w-6" />
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
                  {data.metrics.totalRecordings} gravações ativas
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
        {/* Próximas Aulas Agendadas */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Próximas Aulas Agendadas
                </CardTitle>
                <CardDescription>Atendimentos e mentorias desta semana</CardDescription>
              </div>
              <Link href="/professor/aulas?tab=schedule" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                Ver todas <ArrowRight className="h-3 w-3" />
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
                  {data.upcomingClasses.slice(0, 4).map((cls) => (
                    <div key={cls.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-semibold text-gray-900">
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
                        <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
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

        {/* Ações Rápidas do Docente */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="h-5 w-5 text-purple-600" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Ferramentas de transmissão e material de apoio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start h-12">
                <Link href="/professor/aulas?tab=live">
                  <Radio className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-bold text-sm">Abrir Sala de Aula Ao Vivo</div>
                    <div className="text-xs text-purple-200 font-normal">Iniciar transmissão WebRTC</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-12 border-purple-200 hover:bg-purple-50 text-purple-900">
                <Link href="/professor/aulas?tab=recordings">
                  <Video className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-bold text-sm">Disponibilizar Gravação (VOD)</div>
                    <div className="text-xs text-gray-500 font-normal">Upload com política de expiração</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-12 border-purple-200 hover:bg-purple-50 text-purple-900">
                <Link href="/seguranca">
                  <Clock className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-bold text-sm">Segurança da Conta & 2FA</div>
                    <div className="text-xs text-gray-500 font-normal">Configurar autenticador TOTP</div>
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
