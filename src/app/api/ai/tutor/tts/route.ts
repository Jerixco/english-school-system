export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { checkRateLimit, aiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { prisma } from '@/lib/prisma'

const ELEVENLABS_TTS_ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech'

const ttsSchema = z.object({
  text: z.string().trim().min(1, 'O texto não pode estar vazio.').max(3000, 'Texto muito longo para áudio.'),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Sessão expirada. Por favor, faça login novamente.' },
        { status: 401 }
      )
    }

    if (user.role === 'STUDENT' && !isAdmin(user)) {
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
        select: { status: true },
      })

      if (!student || (student.status !== 'ACTIVE' && student.status !== 'TRIAL')) {
        return NextResponse.json(
          { error: 'Seu plano de estudos precisa estar ativo para utilizar o Tutor IA.' },
          { status: 403 }
        )
      }
    }

    const rateLimit = await checkRateLimit(aiRateLimiter, `${getClientIdentifier(req)}:tts`)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: '⏳ Limite de áudio do Tutor IA atingido. Aguarde um minuto.' },
        { status: 429 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
    const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim()
    if (!apiKey || !voiceId) {
      return NextResponse.json(
        { error: 'A voz premium do Tutor IA ainda não está configurada.' },
        { status: 503 }
      )
    }

    const { text } = ttsSchema.parse(await req.json())
    const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2'
    const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || 'mp3_44100_128'
    const endpoint = `${ELEVENLABS_TTS_ENDPOINT}/${encodeURIComponent(voiceId)}/stream?output_format=${encodeURIComponent(outputFormat)}`

    const elevenLabsResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true,
          speed: 0.96,
        },
      }),
      cache: 'no-store',
    })

    if (!elevenLabsResponse.ok) {
      console.warn('ElevenLabs TTS request failed', {
        status: elevenLabsResponse.status,
        modelId,
      })
      return NextResponse.json(
        { error: 'A voz premium está temporariamente indisponível.' },
        { status: elevenLabsResponse.status === 429 ? 429 : 503 }
      )
    }

    return new NextResponse(await elevenLabsResponse.arrayBuffer(), {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Type': elevenLabsResponse.headers.get('content-type') || 'audio/mpeg',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      )
    }

    console.error('ElevenLabs TTS error:', error)
    return NextResponse.json(
      { error: 'Ocorreu um erro temporário ao gerar o áudio.' },
      { status: 503 }
    )
  }
}
