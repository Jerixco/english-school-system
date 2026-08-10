export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/security'
import { checkRateLimit, aiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { AiTutorService } from '@/services/ai-tutor.service'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json(
        { error: 'A chave GEMINI_API_KEY não está configurada no ambiente.' },
        { status: 500 }
      )
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Sessão expirada. Por favor, faça login novamente.' }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(aiRateLimiter, getClientIdentifier(req))
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: '⏳ Limite de mensagens para o Tutor IA atingido. Por favor, aguarde 1 minuto.' },
        { status: 429 }
      )
    }

    const { message, history } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 })
    }

    const aiTutor = new AiTutorService(apiKey)
    const { text, isQuotaExceeded } = await aiTutor.getReply(message, history)

    if (!text) {
      if (isQuotaExceeded) {
        return NextResponse.json(
          { error: '⏳ O limite temporário de respostas por minuto da IA foi atingido. Aguarde 1 minuto.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: '⏳ O serviço de IA está temporariamente ocupado. Por favor, tente enviar novamente em alguns segundos.' },
        { status: 429 }
      )
    }

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error('Gemini AI Tutor error:', error)
    return NextResponse.json(
      { error: 'Ocorreu um erro temporário ao conectar com a IA. Tente novamente.' },
      { status: 500 }
    )
  }
}
