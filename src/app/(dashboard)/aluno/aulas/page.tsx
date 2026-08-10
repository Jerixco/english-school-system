'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

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
      subtitle="Acesse suas aulas ao vivo, assista às gravações com retenção e acompanhe seu histórico."
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
          Aulas Ao Vivo & Agendadas
          {liveSessions.some((s) => s.status === 'LIVE') && (
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
          Aulas Gravadas (VOD)
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {recordings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="h-4 w-4" />
          Histórico & Presença
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando aulas e transmissões...</p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ABA 1: AULAS AO VIVO & TRANSMISSÃO WEBRTC                                */}
          {/* ========================================================================= */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              {/* Se o aluno abriu a sala de aula ao vivo */}
              {activeLiveStream ? (
                <Card className="border-2 border-purple-500 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-500 text-white animate-pulse">AO VIVO</Badge>
                        <span className="text-xs text-purple-200">
                          Prof. {activeLiveStream.teacher.name || 'Alex'}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-white">{activeLiveStream.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveLiveStream(null)}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Minimizar Sala
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0 bg-black">
                    <div className="relative w-full h-[600px]">
                      <iframe
                        src={`${activeLiveStream.meetLink}#userInfo.displayName="Aluno"&config.prejoinPageEnabled=false`}
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        className="w-full h-full border-0"
                        title="Sala de Aula Ao Vivo"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveSessions.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Radio className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-700">Nenhuma transmissão ao vivo agendada</h4>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                      Quando o seu professor iniciar uma aula ao vivo ou agendar uma mentoria, ela aparecerá automaticamente aqui.
                    </p>
                  </div>
                ) : (
                  liveSessions.map((session) => {
                    const isLive = session.status === 'LIVE'
                    return (
                      <Card
                        key={session.id}
                        className={`transition-all hover:shadow-md ${
                          isLive ? 'border-2 border-red-500 ring-2 ring-red-100' : ''
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <Badge
                              className={
                                isLive
                                  ? 'bg-red-600 animate-pulse text-white'
                                  : session.status === 'SCHEDULED'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-500 text-white'
                              }
                            >
                              {isLive
                                ? 'Transmitindo Agora'
                                : session.status === 'SCHEDULED'
                                ? 'Agendada'
                                : 'Concluída'}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {session.duration} min
                            </span>
                          </div>
                          <CardTitle className="text-base line-clamp-2">{session.title}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">
                            {session.description || 'Aula prática de conversação e pronúncia com feedback em tempo real.'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-xs space-y-1.5 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span>
                                {new Date(session.scheduledFor).toLocaleDateString('pt-BR', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="h-4 w-4 text-purple-600" />
                              <span>Professor: {session.teacher.name || 'Alex'}</span>
                            </div>
                          </div>

                          {isLive ? (
                            <Button
                              onClick={() => setActiveLiveStream(session)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-md animate-bounce"
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Entrar na Transmissão
                            </Button>
                          ) : session.status === 'SCHEDULED' ? (
                            <Button
                              onClick={() => setActiveLiveStream(session)}
                              variant="outline"
                              className="w-full text-purple-700 border-purple-300 hover:bg-purple-50"
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
                <Card className="border-2 border-purple-500 shadow-xl overflow-hidden mb-6">
                  <CardHeader className="bg-gradient-to-r from-gray-900 to-purple-900 text-white flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-purple-600 text-white">GRAVAÇÃO VOD</Badge>
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
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-700">Nenhuma gravação disponível</h4>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                      As aulas gravadas ficam disponíveis temporariamente para revisão de acordo com o seu plano de estudos.
                    </p>
                  </div>
                ) : (
                  recordings.map((rec) => (
                    <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video bg-gray-900 overflow-hidden group cursor-pointer" onClick={() => setSelectedVideo(rec)}>
                          <img
                            src={rec.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <div className="bg-purple-600 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
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
                        <div className="text-xs text-gray-500 flex justify-between items-center mb-3">
                          <span>Gravada em: {new Date(rec.recordedAt).toLocaleDateString('pt-BR')}</span>
                          <span>Prof. {rec.teacher.name || 'Alex'}</span>
                        </div>
                        <Button
                          onClick={() => setSelectedVideo(rec)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Relatório de Presença e Aulas Concluídas
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o seu progresso pedagógico e o histórico de aulas realizadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-purple-50 p-4 rounded-xl text-center">
                        <span className="text-sm text-purple-700 font-medium">Taxa de Presença</span>
                        <h3 className="text-2xl font-bold text-purple-900 mt-1">100%</h3>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl text-center">
                        <span className="text-sm text-green-700 font-medium">Aulas Concluídas</span>
                        <h3 className="text-2xl font-bold text-green-900 mt-1">12</h3>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <span className="text-sm text-blue-700 font-medium">Nível Atual</span>
                        <h3 className="text-2xl font-bold text-blue-900 mt-1">B2 (Upper-Int)</h3>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-gray-100 font-semibold text-xs text-gray-600 uppercase grid grid-cols-12">
                        <div className="col-span-4">Aula / Tema</div>
                        <div className="col-span-3">Data & Hora</div>
                        <div className="col-span-3">Professor</div>
                        <div className="col-span-2 text-right">Status</div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="p-3 text-sm grid grid-cols-12 items-center hover:bg-gray-50">
                          <div className="col-span-4 font-medium text-gray-900">
                            Business Negotiation Simulation
                          </div>
                          <div className="col-span-3 text-gray-500">
                            03/08/2026 às 14:00
                          </div>
                          <div className="col-span-3 text-gray-700">
                            Prof. Alex
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge className="bg-green-600">Presente</Badge>
                          </div>
                        </div>

                        <div className="p-3 text-sm grid grid-cols-12 items-center hover:bg-gray-50">
                          <div className="col-span-4 font-medium text-gray-900">
                            Idioms & Natural Expressions
                          </div>
                          <div className="col-span-3 text-gray-500">
                            27/07/2026 às 14:00
                          </div>
                          <div className="col-span-3 text-gray-700">
                            Prof. Alex
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge className="bg-green-600">Presente</Badge>
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
    </DashboardShell>
  )
}
