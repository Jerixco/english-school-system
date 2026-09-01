'use client'

import { Suspense, useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
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
  Loader2,
  Film,
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

function ProfessorAulasContent() {
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
        const newSession = await res.json()
        setLiveTitle('')
        setActiveBroadcast(newSession)
        loadDashboard()
      }
    } catch (e) {
      console.error('Erro ao criar sala:', e)
    } finally {
      setIsCreatingLive(false)
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
          durationMinutes: parseInt(recDuration, 10) || 45,
          retentionDays: 30,
        }),
      })
      if (res.ok) {
        setRecTitle('')
        setRecVideoUrl('')
        loadDashboard()
      }
    } catch (e) {
      console.error('Erro ao cadastrar gravação:', e)
    } finally {
      setIsCreatingRec(false)
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
        if (action === 'end') {
          setActiveBroadcast(null)
        }
        loadDashboard()
      }
    } catch (e) {
      console.error('Erro ao atualizar status:', e)
    }
  }

  if (loading && !data) {
    return (
      <DashboardShell title="Gestão de Aulas & Transmissões" subtitle="Carregando...">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(25,85%,48%)] mx-auto mb-4"></div>
          <p className="text-[hsl(20,5%,45%)]">Conectando ao sistema de salas...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !data) {
    return (
      <DashboardShell title="Gestão de Aulas & Transmissões">
        <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md">
          {error || 'Não foi possível carregar as informações'}
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="Gestão de Aulas & Transmissões"
      subtitle="Controle suas aulas ao vivo WebRTC, envie gravações e organize sua grade de atendimento."
    >
      {/* Navegação por Abas com acento Índigo */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'live'
              ? 'bg-[hsl(25,85%,48%)] text-white shadow-sm'
              : 'text-[hsl(20,5%,45%)] hover:bg-[hsl(35,10%,90%)]'
          }`}
        >
          <Radio className="h-4 w-4" />
          Aulas Ao Vivo
          {data.liveSessions.some((s) => s.status === 'LIVE') && (
            <span className="bg-[hsl(0,70%,50%)]/100 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              AO VIVO
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recordings')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'recordings'
              ? 'bg-[hsl(25,85%,48%)] text-white shadow-sm'
              : 'text-[hsl(20,5%,45%)] hover:bg-[hsl(35,10%,90%)]'
          }`}
        >
          <Video className="h-4 w-4" />
          Gravações VOD
          <span className="bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] text-xs px-2 py-0.5 rounded-full font-bold">
            {data.recordings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'schedule'
              ? 'bg-[hsl(25,85%,48%)] text-white shadow-sm'
              : 'text-[hsl(20,5%,45%)] hover:bg-[hsl(35,10%,90%)]'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Grade de Horários
          <span className="bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] text-xs px-2 py-0.5 rounded-full font-bold">
            {data.upcomingClasses.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: TRANSMISSÕES AO VIVO & SALA JITSI WEBRTC                           */}
      {/* ========================================================================= */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Iframe Jitsi WebRTC Incorporado se houver transmissão ativa */}
          {activeBroadcast && (
            <Card className="border-2 border-[hsl(25,85%,48%)] shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[hsl(220,25%,16%)] to-[hsl(220,30%,20%)] text-white flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[hsl(0,70%,50%)]/100 text-white text-xs font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
                      🔴 Transmitindo Ao Vivo
                    </span>
                    <CardTitle className="text-lg text-white">{activeBroadcast.title}</CardTitle>
                  </div>
                  <CardDescription className="text-[hsl(20,5%,75%)] text-xs">
                    Sala: {activeBroadcast.roomName} · Transmissão WebRTC criptografada de alta definição
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(activeBroadcast.id, 'end')}
                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    <StopCircle className="h-4 w-4 mr-1.5" />
                    Finalizar Aula
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-black aspect-video max-h-[580px]">
                <iframe
                  src={`https://meet.jit.si/${activeBroadcast.roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full min-h-[500px] border-0"
                />
              </CardContent>
            </Card>
          )}

          {/* Card para Criar Nova Sala Instantânea */}
          <Card className="bg-gradient-to-r from-[hsl(25,85%,48%)]/5 to-[hsl(35,10%,94%)] border-[hsl(25,85%,48%)]/30">
            <CardHeader>
              <CardTitle className="text-base text-indigo-950 flex items-center gap-2">
                <Radio className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                Criar Nova Sala de Aula Ao Vivo
              </CardTitle>
              <CardDescription>
                Abra uma sala de transmissão WebRTC instantânea para seus alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLive} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Título da Aula (ex: Masterclass de Conversação B2)..."
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="bg-white text-sm"
                  required
                />
                <Button type="submit" disabled={isCreatingLive} className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)] text-white whitespace-nowrap gap-2 shadow-sm">
                  {isCreatingLive ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando Sala...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Abrir Sala Virtual
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Sessões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                Minhas Sessões Ao Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.liveSessions.length === 0 ? (
                <EmptyState
                  icon={Radio}
                  title="Nenhuma sessão ao vivo cadastrada"
                  description="Crie uma sala virtual acima para dar aulas com transmissão WebRTC integrada."
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.liveSessions.map((session) => {
                    const isLive = session.status === 'LIVE'
                    return (
                      <div
                        key={session.id}
                        className={`p-4 bg-[hsl(35,10%,94%)] rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                          isLive ? 'border-2 border-red-500 bg-[hsl(0,70%,50%)]/10' : 'border border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={
                                isLive
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : session.status === 'SCHEDULED'
                                  ? 'bg-[hsl(25,85%,48%)] text-white'
                                  : 'bg-[hsl(35,10%,60%)] text-white'
                              }
                            >
                              {isLive ? 'Ao Vivo Agora' : session.status === 'SCHEDULED' ? 'Agendada' : 'Finalizada'}
                            </Badge>
                            <h4 className="font-bold text-[hsl(20,10%,10%)]">{session.title}</h4>
                          </div>
                          <small className="text-[hsl(20,5%,45%)]">
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
                            className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white gap-1.5"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Entrar na Sala
                          </Button>
                          {session.status === 'SCHEDULED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(session.id, 'start')}
                              className="text-[hsl(145,60%,45%)] border-green-300 hover:bg-green-50"
                            >
                              Iniciar Ao Vivo
                            </Button>
                          )}
                          {session.status === 'LIVE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(session.id, 'end')}
                              className="text-red-700 border-red-300 hover:bg-[hsl(0,70%,50%)]/10"
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
          <Card className="bg-[hsl(35,10%,94%)] border-gray-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Film className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                Cadastrar Nova Aula Gravada
              </CardTitle>
              <CardDescription>
                Disponibilize a gravação para os alunos assistirem durante o período de retenção (30 dias).
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
                  <Button type="submit" disabled={isCreatingRec} className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white gap-2 shadow-sm">
                    {isCreatingRec ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                        Publicar Gravação
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                Aulas Gravadas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recordings.length === 0 ? (
                <EmptyState
                  icon={Video}
                  title="Nenhuma gravação cadastrada"
                  description="Use o formulário acima para disponibilizar aulas gravadas e materiais VOD para seus alunos."
                  compact
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {data.recordings.map((rec) => (
                    <div key={rec.id} className="p-4 bg-[hsl(35,10%,94%)] rounded-lg border flex justify-between items-center hover:bg-[hsl(25,85%,48%)]/5 transition-colors">
                      <div>
                        <h4 className="font-bold text-[hsl(20,10%,10%)]">{rec.title}</h4>
                        <small className="text-[hsl(20,5%,45%)]">
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
                <Calendar className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                Aulas Agendadas com Alunos
              </CardTitle>
              <CardDescription>Horários e links de atendimento individual ou em grupo</CardDescription>
            </CardHeader>
            <CardContent>
              {data.upcomingClasses.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Nenhuma aula agendada na grade"
                  description="Quando alunos realizarem agendamentos, eles aparecerão organizados nesta grade com botão direto de acesso à sala."
                  compact
                />
              ) : (
                <div className="space-y-3">
                  {data.upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-3.5 bg-[hsl(35,10%,94%)] rounded-lg flex justify-between items-center hover:bg-[hsl(25,85%,48%)]/5 transition-colors border border-[hsl(35,10%,85%)]">
                      <div>
                        <div className="font-semibold text-[hsl(20,10%,10%)] capitalize">
                          {new Date(cls.scheduledAt).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <small className="text-[hsl(20,5%,45%)]">
                          Aluno: {cls.studentName} ({cls.studentEmail}) · {cls.duration} min
                        </small>
                      </div>
                      {cls.meetLink && (
                        <Button asChild size="sm" className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white">
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
      )}
    </DashboardShell>
  )
}

export default function ProfessorAulasPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell title="Gestão de Aulas & Transmissões" subtitle="Carregando ambiente docente...">
          <div className="space-y-4">
            <div className="h-12 w-64 bg-muted/60 rounded-lg animate-pulse" />
            <div className="h-64 rounded-xl bg-muted/60 animate-pulse" />
          </div>
        </DashboardShell>
      }
    >
      <ProfessorAulasContent />
    </Suspense>
  )
}
