export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getAuthenticatedUser } from '@/lib/security'
import { checkRateLimit, aiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

const SYSTEM_INSTRUCTION = `You are Alex, an expert, warm, and encouraging English teacher at English School. 
Your goal is to help students practice conversational English. Always reply primarily in English. 
If the student makes a grammatical error, include a gentle "💡 Quick Tip:" section at the end.`

const AVAILABLE_MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b']

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

    // Formata o histórico garantindo que a 1ª mensagem seja do tipo 'user' (Exigência do SDK)
    const formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item.parts || typeof item.parts !== 'string') continue
        const role = item.role === 'user' ? 'user' : 'model'
        if (formattedHistory.length === 0 && role === 'model') continue
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) continue

        formattedHistory.push({ role, parts: [{ text: item.parts }] })
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    let replyText = ''
    let isQuotaExceeded = false

    for (const modelName of AVAILABLE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION })
        const chat = model.startChat({ history: formattedHistory })
        const result = await chat.sendMessage(message)
        replyText = result.response.text()
        if (replyText) break
      } catch (err: any) {
        const errMsg = err?.message || String(err || '')
        if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('Too Many Requests')) {
          isQuotaExceeded = true
        }
        console.warn(`Model ${modelName} notice:`, errMsg)
      }
    }

    if (!replyText) {
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

    return NextResponse.json({ reply: replyText })
  } catch (error: any) {
    console.error('Gemini AI Tutor error:', error)
    return NextResponse.json(
      { error: 'Ocorreu um erro temporário ao conectar com a IA. Tente novamente.' },
      { status: 500 }
    )
  }
}
