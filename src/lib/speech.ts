/**
 * Speech Recognition (STT) and Speech Synthesis (TTS) Helper
 * for AI Tutor Alex English Practice
 */

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

type VoiceLike = Pick<SpeechSynthesisVoice, 'lang' | 'name' | 'localService' | 'default'>

const NATURAL_ENGLISH_VOICE_PATTERNS = [
  /microsoft\s+(ava|aria|jenny|guy|davis|ryan|emma|brian|libby|sara|sonia).*\b(online|natural)\b/i,
  /google\s+us\s+english/i,
  /\b(samantha|alex|daniel|karen|serena|moira)\b/i,
]

function normalizeLocale(locale: string): string {
  return locale.trim().replace('_', '-').toLowerCase()
}

/**
 * Escolhe uma voz inglesa nativa quando ela existe no dispositivo.
 * A Web Speech API expõe as vozes instaladas/fornecidas pelo navegador, então
 * não é seguro usar simplesmente a primeira voz cujo idioma começa com "en".
 */
export function selectEnglishVoice<T extends VoiceLike>(
  voices: T[],
  preferredLocale = 'en-US'
): T | undefined {
  const targetLocale = normalizeLocale(preferredLocale)
  const englishVoices = voices.filter((voice) => {
    const locale = normalizeLocale(voice.lang)
    const descriptor = `${voice.name} ${locale}`
    return locale.startsWith('en-') && !/\ben-in\b|\bindia\b|\bindian\b/i.test(descriptor)
  })

  if (englishVoices.length === 0) return undefined

  return englishVoices.reduce((best, voice) => {
    const score = scoreEnglishVoice(voice, targetLocale)
    return score > scoreEnglishVoice(best, targetLocale) ? voice : best
  })
}

function scoreEnglishVoice(voice: VoiceLike, targetLocale: string): number {
  const locale = normalizeLocale(voice.lang)
  const name = voice.name.toLowerCase()
  let score = 0

  if (locale === targetLocale) score += 160
  else if (locale === 'en-us') score += 120
  else if (locale === 'en-gb') score += 90
  else score += 40

  if (NATURAL_ENGLISH_VOICE_PATTERNS.some((pattern) => pattern.test(voice.name))) score += 80
  if (/online|natural|neural|premium/.test(name)) score += 45
  if (voice.localService === false) score += 15
  if (voice.default) score += 5

  return score
}

async function getSpeechSynthesisVoices(): Promise<SpeechSynthesisVoice[]> {
  const synthesis = window.speechSynthesis
  const voices = synthesis.getVoices()
  if (voices.length > 0) return voices

  return new Promise((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      synthesis.removeEventListener('voiceschanged', finish)
      window.clearTimeout(timeoutId)
      resolve(synthesis.getVoices())
    }
    const timeoutId = window.setTimeout(finish, 750)

    // Chrome e alguns navegadores carregam as vozes de forma assíncrona.
    synthesis.addEventListener('voiceschanged', finish)
  })
}

export function startSpeechRecognition({
  onResult,
  onError,
  onEnd,
}: {
  onResult: (transcript: string) => void
  onError?: (error: string) => void
  onEnd?: () => void
}): any {
  if (!isSpeechRecognitionSupported()) {
    onError?.('Reconhecimento de voz não suportado neste navegador.')
    return null
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = true

  recognition.onresult = (event: any) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    onError?.(event.error || 'Erro no reconhecimento de voz.')
  }

  recognition.onend = () => {
    onEnd?.()
  }

  recognition.start()
  return recognition
}

let speechRequestId = 0

export async function speakEnglishText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!isSpeechSynthesisSupported()) return

  const requestId = ++speechRequestId

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  // Clean text: strip emojis and markdown formatting for cleaner speech
  const cleanText = text
    .replace(/[#*_`~]/g, '')
    .replace(/💡|⚠️|👋|💼|✈️|📚|☕|🎓|✨/g, '')
    .trim()

  if (!cleanText) return

  const voices = await getSpeechSynthesisVoices()
  // Uma parada/reprodução mais recente invalida qualquer carregamento pendente.
  if (requestId !== speechRequestId) return

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = 'en-US'
  utterance.rate = 0.92 // ligeiramente mais lento para facilitar o aprendizado
  utterance.pitch = 1.0
  utterance.volume = 1.0

  const englishVoice = selectEnglishVoice(voices)

  if (englishVoice) {
    utterance.voice = englishVoice
    // A voz escolhida define o sotaque real; o idioma continua como fallback.
    utterance.lang = englishVoice.lang
  }

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  speechRequestId += 1
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
