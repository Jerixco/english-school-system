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

export function speakEnglishText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!isSpeechSynthesisSupported()) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  // Clean text: strip emojis and markdown formatting for cleaner speech
  const cleanText = text
    .replace(/[#*_`~]/g, '')
    .replace(/💡|⚠️|👋|💼|✈️|📚|☕|🎓|✨/g, '')
    .trim()

  if (!cleanText) return

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = 'en-US'
  utterance.rate = 0.95 // slightly slower for language learners
  utterance.pitch = 1.0

  // Try to pick a natural native English voice
  const voices = window.speechSynthesis.getVoices()
  const englishVoice =
    voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen'))
    ) || voices.find((v) => v.lang.startsWith('en'))

  if (englishVoice) {
    utterance.voice = englishVoice
  }

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
