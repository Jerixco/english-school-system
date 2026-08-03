export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getAuthenticatedUser } from '@/lib/security'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave GEMINI_API_KEY não configurada nas variáveis de ambiente' }, { status: 500 })
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde um instante.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const SYSTEM_INSTRUCTION = `You are Alex, an expert, warm, and encouraging English teacher at English School. 
Your goal is to help students practice conversational English.

Rules:
1. Always reply primarily in English, keeping your language clear, natural, and accessible.
2. If the student makes a grammatical or spelling mistake, gently point it out in a small "💡 Quick Tip:" section at the bottom of your message.
3. Keep your answers concise (2-4 sentences) and end with an engaging open-ended question to keep the conversation flowing.
4. Always be polite, positive, and supportive.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    const chatHistory = Array.isArray(history)
      ? history.map((item: { role: string; parts: string }) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.parts }],
        }))
      : []

    const chat = model.startChat({ history: chatHistory })
    const result = await chat.sendMessage(message)
    const responseText = result.response.text()

    return NextResponse.json({ reply: responseText })
  } catch (error: any) {
    console.error('Gemini AI Tutor error:', error)
    return NextResponse.json(
      { error: 'Desculpe, ocorreu um erro ao conectar com o Tutor de IA.' },
      { status: 500 }
    )
  }
}
