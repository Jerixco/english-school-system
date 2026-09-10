'use client'

import { useState, useEffect, useRef, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Video, Mic, MicOff, VideoOff, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react'

interface DevicePreCheckModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  sessionTitle: string
  teacherName?: string
}

export default function DevicePreCheckModal({
  open,
  onClose,
  onConfirm,
  sessionTitle,
  teacherName,
}: DevicePreCheckModalProps) {
  const [cameraActive, setCameraActive] = useState(true)
  const [micActive, setMicActive] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return

    let isMounted = true

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        setHasPermission(true)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Setup audio level meter
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass()
          audioContextRef.current = audioCtx
          const source = audioCtx.createMediaStreamSource(stream)
          const analyser = audioCtx.createAnalyser()
          analyser.fftSize = 64
          source.connect(analyser)
          analyserRef.current = analyser

          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          const updateAudioMeter = () => {
            if (analyserRef.current && isMounted) {
              analyserRef.current.getByteFrequencyData(dataArray)
              let sum = 0
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i]
              }
              const avg = sum / dataArray.length
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)))
              animationFrameRef.current = requestAnimationFrame(updateAudioMeter)
            }
          }
          updateAudioMeter()
        }
      } catch (err) {
        console.error('Device access error:', err)
        if (isMounted) setHasPermission(false)
      }
    }

    initMedia()

    return () => {
      isMounted = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [onClose, open])

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraActive(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicActive(audioTrack.enabled)
      }
    }
  }

  const handleJoin = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    onConfirm()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-800 p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 id={titleId} className="text-lg font-bold font-outfit text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Teste de Câmera e Microfone
            </h3>
            <p id={descriptionId} className="text-xs text-gray-400">
              {sessionTitle} {teacherName && `• ${teacherName}`}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar teste de dispositivos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Box */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-800 flex items-center justify-center">
          {hasPermission === false ? (
            <div className="text-center p-4">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-200">Acesso bloqueado</p>
              <p className="text-xs text-gray-400 mt-1">
                Por favor, autorize o acesso à câmera e microfone no navegador para entrar na aula.
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  !cameraActive ? 'hidden' : ''
                }`}
              />
              {!cameraActive && (
                <div className="text-center text-gray-500">
                  <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Câmera desativada</p>
                </div>
              )}
            </>
          )}

          {/* Quick Controls inside preview */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={toggleCamera}
              className={`p-2 rounded-full transition-colors ${
                cameraActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white'
              }`}
              title={cameraActive ? 'Desativar câmera' : 'Ativar câmera'}
              aria-label={cameraActive ? 'Desativar câmera' : 'Ativar câmera'}
              aria-pressed={cameraActive}
            >
              {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-full transition-colors ${
                micActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white'
              }`}
              title={micActive ? 'Desativar microfone' : 'Ativar microfone'}
              aria-label={micActive ? 'Desativar microfone' : 'Ativar microfone'}
              aria-pressed={micActive}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Audio Level Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              Nível do Microfone:
            </span>
            <span className="font-mono text-emerald-400">{audioLevel}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              role="progressbar"
              aria-label="Nível do microfone"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={micActive ? audioLevel : 0}
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-75"
              style={{ width: `${micActive ? audioLevel : 0}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Cancelar
          </Button>
          <Button
            onClick={handleJoin}
            className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Entrar na Sala de Aula
          </Button>
        </div>
      </div>
    </div>
  )
}
