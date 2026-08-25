'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Radio,
  Video,
  Calendar,
  Clock,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  User,
  Sparkles,
  Film,
  Award,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import DevicePreCheckModal from '@/components/classroom/DevicePreCheckModal'
import ClassFeedbackModal from '@/components/classroom/ClassFeedbackModal'

interface LiveSessionItem {
  id: string
  title: string
  description: string | null
  roomName: string
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'
  scheduledFor: string
  duration: number
  meetLink: string | null
  teacher: { id: string; name: string | null; image: string | null }
}

interface RecordingItem {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  durationMinutes: number | null
  recordedAt: string
  expiresAt: string
  daysRemaining: number
  isExpiringSoon: boolean
  teacher: { id: string; name: string | null; image: string | null }
}

export default function AlunoAulasPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'live'

  const [activeTab, setActiveTab] = useState<'live' | 'recordings' | 'history'>(
    initialTab as any
  )
  const [liveSessions, setLiveSessions] = useState<LiveSessionItem[]>([])
  const [recordings, setRecordings] = useState<RecordingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLiveStream, setActiveLiveStream] = useState<LiveSessionItem | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<RecordingItem | null>(null)
  const [preCheckSession, setPreCheckSession] = useState<LiveSessionItem | null>(null)
  const [feedbackSession, setFeedbackSession] = useState<LiveSessionItem | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [liveRes, recRes] = await Promise.all([
          fetch('/api/live-sessions'),
          fetch('/api/recordings'),
        ])

        if (liveRes.ok) {
          const liveData = await liveRes.json()
          setLiveSessions(liveData)
          // Se houver alguma aula acontecendo ao vivo, seleciona automaticamente se na aba live
          const currentLive = liveData.find((s: LiveSessionItem) => s.status === 'LIVE')
          if (currentLive && initialTab === 'live') {
            setActiveLiveStream(currentLive)
          }
        }

        if (recRes.ok) {
          const recData = await recRes.json()
          setRecordings(recData)
        }
      } catch (err) {
        console.error('Erro ao carregar aulas:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [initialTab])

  return (
    <DashboardShell
      title="Minhas Aulas & Transmissões"
      subtitle="Acesse suas aulas ao vivo, assista às gravações com retenção e acompanhe seu histórico de estudos."
    >
      {/* Navegação por Abas com acento Esmeralda / Sky */}
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
          {liveSessions.some((s) => s.status === 'LIVE') && (
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
          Biblioteca de Gravações (VOD)
          <span className="bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] text-xs px-2 py-0.5 rounded-full font-bold">
            {recordings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-[hsl(25,85%,48%)] text-white shadow-sm'
              : 'text-[hsl(20,5%,45%)] hover:bg-[hsl(35,10%,90%)]'
          }`}
        >
          <Award className="h-4 w-4" />
          Histórico de Frequência
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(25,85%,48%)] mx-auto mb-4"></div>
          <p className="text-[hsl(20,5%,45%)]">Carregando aulas e vídeos disponíveis...</p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ABA 1: AULAS AO VIVO (JITSI WEBRTC INCORPORADO)                          */}
          {/* ========================================================================= */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              {/* Player do Iframe WebRTC se aluno selecionou uma sala */}
              {activeLiveStream && (
                <Card className="border-2 border-sky-500 shadow-xl overflow-hidden mb-6">
                  <CardHeader className="bg-gradient-to-r from-[hsl(220,25%,16%)] to-[hsl(220,30%,20%)] text-white flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[hsl(0,70%,50%)]/100 text-white text-xs font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
                          🔴 Sala Conectada
                        </span>
                        <CardTitle className="text-lg text-white">{activeLiveStream.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sky-100 text-xs">
                        Prof. {activeLiveStream.teacher.name || 'Sarah'} · Sala WebRTC criptografada em alta definição
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = activeLiveStream
                        setActiveLiveStream(null)
                        setFeedbackSession(current)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Sair da Sala
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0 bg-black aspect-video max-h-[580px]">
                    <iframe
                      src={`https://meet.jit.si/${activeLiveStream.roomName}#config.startWithAudioMuted=true&config.startWithVideoMuted=false`}
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      className="w-full h-full min-h-[500px] border-0"
                    />
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {liveSessions.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      icon={Radio}
                      title="Nenhuma aula ao vivo no momento"
                      description="As sessões de conversação ao vivo com os professores serão transmitidas aqui. Você também pode agendar um horário individual."
                      actionLabel="Agendar Atendimento Individual"
                      actionHref="/agendar"
                    />
                  </div>
                ) : (
                  liveSessions.map((session) => {
                    const isLive = session.status === 'LIVE'
                    return (
                      <Card
                        key={session.id}
                        className={`transition-all hover:shadow-md ${
                          isLive ? 'border-2 border-red-500 bg-[hsl(0,70%,50%)]/10/20' : 'border border-gray-200'
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <Badge
                              className={
                                isLive
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : session.status === 'SCHEDULED'
                                  ? 'bg-[hsl(25,85%,48%)] text-white'
                                  : 'bg-[hsl(35,10%,94%)]0 text-white'
                              }
                            >
                              {isLive ? 'Ao Vivo Agora' : session.status === 'SCHEDULED' ? 'Agendada' : 'Finalizada'}
                            </Badge>
                            <span className="text-xs text-[hsl(20,5%,45%)] font-medium">
                              {session.duration} min
                            </span>
                          </div>
                          <CardTitle className="text-base mt-2">{session.title}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">
                            {session.description || 'Prática de conversação interativa em tempo real.'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs space-y-1 mb-4">
                            <div className="flex items-center gap-2 text-[hsl(20,5%,45%)]">
                              <Calendar className="h-4 w-4 text-[hsl(25,85%,48%)]" />
                              <span>
                                {new Date(session.scheduledFor).toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                  day: '2-digit',
                                  month: 'long',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[hsl(20,5%,45%)]">
                              <User className="h-4 w-4 text-[hsl(25,85%,48%)]" />
                              <span>Professor: {session.teacher.name || 'Sarah'}</span>
                            </div>
                          </div>

                          {isLive ? (
                            <Button
                              onClick={() => setPreCheckSession(session)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Entrar na Transmissão
                            </Button>
                          ) : session.status === 'SCHEDULED' ? (
                            <Button
                              onClick={() => setPreCheckSession(session)}
                              variant="outline"
                              className="w-full text-sky-700 border-sky-300 hover:bg-[hsl(25,85%,48%)]/5"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Testar Sala Virtual
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="w-full text-gray-400">
                              Aula Finalizada
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: AULAS GRAVADAS COM RETENÇÃO E EXPIRAÇÃO (VOD)                     */}
          {/* ========================================================================= */}
          {activeTab === 'recordings' && (
            <div className="space-y-6">
              {/* Player Modal / Inline quando o aluno clica para assistir */}
              {selectedVideo && (
                <Card className="border-2 border-sky-500 shadow-xl overflow-hidden mb-6">
                  <CardHeader className="bg-gradient-to-r from-gray-900 to-sky-950 text-white flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[hsl(25,85%,48%)] text-white">GRAVAÇÃO VOD</Badge>
                        <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
                          Expira em {selectedVideo.daysRemaining} dias
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-white">{selectedVideo.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVideo(null)}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Fechar Player
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0 bg-black flex justify-center">
                    <div className="w-full max-w-4xl aspect-video">
                      <video
                        src={selectedVideo.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recordings.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      icon={Film}
                      title="Nenhuma gravação arquivada"
                      description="As aulas gravadas ficam disponíveis temporariamente para revisão durante o período de retenção de 30 dias."
                    />
                  </div>
                ) : (
                  recordings.map((rec) => (
                    <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between border border-gray-200">
                      <div>
                        <div className="relative aspect-video bg-[hsl(20,10%,10%)] overflow-hidden group cursor-pointer" onClick={() => setSelectedVideo(rec)}>
                          <img
                            src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <div className="bg-[hsl(25,85%,48%)] text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                              <PlayCircle className="h-8 w-8" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                            {rec.durationMinutes || 45} min
                          </div>
                          {/* Badge de Expiração / Retenção */}
                          <div className="absolute top-2 left-2">
                            <Badge className={rec.isExpiringSoon ? 'bg-red-600 text-white font-bold' : 'bg-amber-600 text-white font-medium'}>
                              <Clock className="h-3 w-3 mr-1" />
                              Expira em {rec.daysRemaining} {rec.daysRemaining === 1 ? 'dia' : 'dias'}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="text-base line-clamp-1">{rec.title}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">
                            {rec.description || 'Revisão gravada de aula com vocabulário aplicado e correções.'}
                          </CardDescription>
                        </CardHeader>
                      </div>

                      <CardContent className="pt-2">
                        <div className="text-xs text-[hsl(20,5%,45%)] flex justify-between items-center mb-3">
                          <span>Gravada em: {new Date(rec.recordedAt).toLocaleDateString('pt-BR')}</span>
                          <span>Prof. {rec.teacher.name || 'Sarah'}</span>
                        </div>
                        <Button
                          onClick={() => setSelectedVideo(rec)}
                          className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)] text-white shadow-sm"
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Assistir Gravação
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: HISTÓRICO & PRESENÇA                                              */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(145,60%,45%)]" />
                    Relatório de Presença e Aulas Concluídas
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o seu progresso pedagógico e o histórico de aulas realizadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                        <span className="text-sm text-emerald-700 font-medium">Taxa de Presença</span>
                        <h3 className="text-2xl font-bold text-[hsl(145,60%,45%)] mt-1">100%</h3>
                      </div>
                      <div className="bg-[hsl(25,85%,48%)]/5 p-4 rounded-xl text-center border border-[hsl(25,85%,48%)]/20">
                        <span className="text-sm text-sky-700 font-medium">Aulas Concluídas</span>
                        <h3 className="text-2xl font-bold text-sky-900 mt-1">12</h3>
                      </div>
                      <div className="bg-[hsl(25,85%,48%)]/5 p-4 rounded-xl text-center border border-[hsl(25,85%,48%)]/20">
                        <span className="text-sm text-[hsl(25,85%,48%)] font-medium">Nível Atual</span>
                        <h3 className="text-2xl font-bold text-[hsl(220,25%,12%)] mt-1">B2 (Upper-Int)</h3>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-[hsl(35,10%,90%)] font-semibold text-xs text-[hsl(20,5%,45%)] uppercase grid grid-cols-12">
                        <div className="col-span-4">Aula / Tema</div>
                        <div className="col-span-3">Data & Hora</div>
                        <div className="col-span-3">Professor</div>
                        <div className="col-span-2 text-right">Status</div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="p-3 text-sm grid grid-cols-12 items-center hover:bg-[hsl(35,10%,94%)]">
                          <div className="col-span-4 font-medium text-[hsl(20,10%,10%)]">
                            Business Negotiation Simulation
                          </div>
                          <div className="col-span-3 text-[hsl(20,5%,45%)]">
                            03/08/2026 às 14:00
                          </div>
                          <div className="col-span-3 text-[hsl(20,5%,45%)]">
                            Prof. Alex
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge className="bg-emerald-600 text-white">Presente</Badge>
                          </div>
                        </div>

                        <div className="p-3 text-sm grid grid-cols-12 items-center hover:bg-[hsl(35,10%,94%)]">
                          <div className="col-span-4 font-medium text-[hsl(20,10%,10%)]">
                            Idioms & Natural Expressions
                          </div>
                          <div className="col-span-3 text-[hsl(20,5%,45%)]">
                            27/07/2026 às 14:00
                          </div>
                          <div className="col-span-3 text-[hsl(20,5%,45%)]">
                            Prof. Alex
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge className="bg-emerald-600 text-white">Presente</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Pre-Check Device Testing Modal */}
      {preCheckSession && (
        <DevicePreCheckModal
          open={Boolean(preCheckSession)}
          onClose={() => setPreCheckSession(null)}
          sessionTitle={preCheckSession.title}
          teacherName={preCheckSession.teacher.name || undefined}
          onConfirm={() => {
            const target = preCheckSession
            setPreCheckSession(null)
            setActiveLiveStream(target)
          }}
        />
      )}

      {/* Post-Class Feedback Modal */}
      {feedbackSession && (
        <ClassFeedbackModal
          open={Boolean(feedbackSession)}
          onClose={() => setFeedbackSession(null)}
          sessionTitle={feedbackSession.title}
          teacherName={feedbackSession.teacher.name || undefined}
          onSubmit={(feedback: { rating: number; tags: string[]; comment: string }) => {
            console.log('Feedback enviado:', feedback)
          }}
        />
      )}
    </DashboardShell>
  )
}
