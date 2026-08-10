'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Radio,
  Video,
  Calendar,
  Clock,
  PlayCircle,
  PlusCircle,
  Users,
  CheckCircle2,
  StopCircle,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface ProfessorData {
  teacher: { id: string; name: string; email: string }
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
    description: string | null
    roomName: string
    status: string
    scheduledFor: string
    duration: number
    meetLink: string | null
    studentName: string
  }>
  recordings: Array<{
    id: string
    title: string
    description: string | null
    videoUrl: string
    durationMinutes: number | null
    recordedAt: string
    expiresAt: string
    daysRemaining: number
    studentName: string
  }>
}

export default function ProfessorAulasPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'live'

  const [activeTab, setActiveTab] = useState<'live' | 'recordings' | 'schedule'>(
    initialTab as any
  )
  const [data, setData] = useState<ProfessorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeBroadcast, setActiveBroadcast] = useState<any | null>(null)

  // Form states
  const [liveTitle, setLiveTitle] = useState('')
  const [isCreatingLive, setIsCreatingLive] = useState(false)
  const [recTitle, setRecTitle] = useState('')
  const [recVideoUrl, setRecVideoUrl] = useState('')
  const [recDuration, setRecDuration] = useState('45')
  const [isCreatingRec, setIsCreatingRec] = useState(false)

  const loadDashboard = () => {
    setLoading(true)
    fetch('/api/professor/dashboard')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Erro ao carregar dados')
        setData(json)
        const currentLive = json.liveSessions.find((s: any) => s.status === 'LIVE')
        if (currentLive) {
          setActiveBroadcast(currentLive)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleCreateLive = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!liveTitle) return
    setIsCreatingLive(true)
    try {
      const res = await fetch('/api/live-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: liveTitle,
          scheduledFor: new Date().toISOString(),
          duration: 60,
        }),
      })
      if (res.ok) {
        setLiveTitle('')
        loadDashboard()
      }
    } catch (err) {
      console.error('Erro ao agendar aula ao vivo:', err)
    } finally {
      setIsCreatingLive(false)
    }
  }

  const handleUpdateStatus = async (sessionId: string, action: 'start' | 'end') => {
    try {
      const res = await fetch(`/api/live-sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        loadDashboard()
      }
    } catch (err) {
      console.error('Erro ao alterar status da transmissão:', err)
    }
  }

  const handleCreateRecording = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recTitle || !recVideoUrl) return
    setIsCreatingRec(true)
    try {
      const res = await fetch('/api/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recTitle,
          videoUrl: recVideoUrl,
          durationMinutes: parseInt(recDuration) || 45,
          retentionDays: 30,
        }),
      })
      if (res.ok) {
        setRecTitle('')
        setRecVideoUrl('')
        loadDashboard()
      }
    } catch (err) {
      console.error('Erro ao cadastrar gravação:', err)
    } finally {
      setIsCreatingRec(false)
    }
  }

  if (loading && !data) {
    return (
      <DashboardShell title="Gestão de Aulas & Transmissões" subtitle="Carregando...">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Acessando grade de aulas do professor...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Gestão de Aulas">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || 'Não foi possível carregar as informações'}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="Gestão de Aulas & Transmissões"
      subtitle="Inicie transmissões ao vivo, disponibilize gravações para os alunos e gerencie seus horários."
    >
      {/* Navegação por Abas */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'live'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Radio className="h-4 w-4" />
          Aulas Ao Vivo
          {data.liveSessions.some((s) => s.status === 'LIVE') && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              AO VIVO
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recordings')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'recordings'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Video className="h-4 w-4" />
          Gravações VOD
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {data.recordings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'schedule'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Grade de Aulas Agendadas
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {data.upcomingClasses.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: AULAS AO VIVO & TRANSMISSÃO                                       */}
      {/* ========================================================================= */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Sala Virtual de Transmissão Aberta */}
          {activeBroadcast && (
            <Card className="border-2 border-purple-500 shadow-xl overflow-hidden mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-500 text-white animate-pulse">TRANSMITINDO AO VIVO</Badge>
                    <span className="text-xs text-purple-200">Sala: {activeBroadcast.roomName}</span>
                  </div>
                  <CardTitle className="text-xl text-white">{activeBroadcast.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(activeBroadcast.id, 'end')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <StopCircle className="h-4 w-4 mr-1.5" />
                    Encerrar Aula
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBroadcast(null)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    Minimizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-black">
                <div className="relative w-full h-[600px]">
                  <iframe
                    src={`${activeBroadcast.meetLink}#userInfo.displayName="${data.teacher.name} (Professor)"&config.prejoinPageEnabled=false`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="w-full h-full border-0"
                    title="Sala de Aula Ao Vivo"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card para Criar Nova Transmissão */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-base text-purple-950 flex items-center gap-2">
                <Radio className="h-5 w-5 text-purple-600" />
                Criar Nova Sala de Aula Ao Vivo
              </CardTitle>
              <CardDescription>
                Gere uma sala WebRTC com chat, compartilhamento de tela e áudio/vídeo para seus alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLive} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Título da Aula (ex: Masterclass de Conversação B2)..."
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="bg-white"
                  required
                />
                <Button type="submit" disabled={isCreatingLive} className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isCreatingLive ? 'Criando Sala...' : 'Abrir Sala Virtual'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Sessões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Minhas Sessões Ao Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.liveSessions.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Nenhuma sessão cadastrada.</p>
              ) : (
                <div className="space-y-3">
                  {data.liveSessions.map((session) => {
                    const isLive = session.status === 'LIVE'
                    return (
                      <div
                        key={session.id}
                        className={`p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                          isLive ? 'border-2 border-red-500 bg-red-50/40' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={
                                isLive
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : session.status === 'SCHEDULED'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-500 text-white'
                              }
                            >
                              {isLive ? 'Ao Vivo Agora' : session.status === 'SCHEDULED' ? 'Agendada' : 'Finalizada'}
                            </Badge>
                            <h4 className="font-bold text-gray-900">{session.title}</h4>
                          </div>
                          <small className="text-gray-500">
                            {new Date(session.scheduledFor).toLocaleDateString('pt-BR', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            · {session.duration} min · {session.studentName}
                          </small>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setActiveBroadcast(session)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <PlayCircle className="h-4 w-4 mr-1.5" />
                            Entrar na Sala
                          </Button>
                          {session.status === 'SCHEDULED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(session.id, 'start')}
                              className="text-green-700 border-green-300 hover:bg-green-50"
                            >
                              Iniciar Ao Vivo
                            </Button>
                          )}
                          {session.status === 'LIVE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(session.id, 'end')}
                              className="text-red-700 border-red-300 hover:bg-red-50"
                            >
                              Finalizar
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: GRAVAÇÕES & UPLOAD VOD                                            */}
      {/* ========================================================================= */}
      {activeTab === 'recordings' && (
        <div className="space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-600" />
                Cadastrar Nova Aula Gravada
              </CardTitle>
              <CardDescription>
                Disponibilize a gravação para os alunos assistirem durante o período de retenção.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRecording} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="recTitle" className="text-xs font-semibold">Título da Aula</Label>
                  <Input
                    id="recTitle"
                    placeholder="ex: Aula 03: Phrasal Verbs Avançados"
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="recVideoUrl" className="text-xs font-semibold">URL do Vídeo (MP4, YouTube ou Cloudflare)</Label>
                  <Input
                    id="recVideoUrl"
                    type="url"
                    placeholder="https://..."
                    value={recVideoUrl}
                    onChange={(e) => setRecVideoUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1 flex items-end">
                  <Button type="submit" disabled={isCreatingRec} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isCreatingRec ? 'Publicando...' : 'Publicar Gravação'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-600" />
                Aulas Gravadas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recordings.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Nenhuma gravação ativa no momento.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {data.recordings.map((rec) => (
                    <div key={rec.id} className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{rec.title}</h4>
                        <small className="text-gray-500">
                          Gravada em {new Date(rec.recordedAt).toLocaleDateString('pt-BR')} · {rec.durationMinutes || 45} min
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
      {/* ABA 3: GRADE DE AULAS AGENDADAS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Aulas Agendadas com Alunos
              </CardTitle>
              <CardDescription>Horários e links de atendimento individual ou em grupo</CardDescription>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Nenhuma aula agendada para os próximos dias.</p>
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.map((cls) => (
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
                          Aluno: {cls.studentName} ({cls.studentEmail}) · {cls.duration} min
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
      )}
    </DashboardShell>
  )
}
