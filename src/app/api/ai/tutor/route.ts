export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getAuthenticatedUser } from '@/lib/security'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json(
        {
          error:
            'A chave GEMINI_API_KEY não está configurada no seu arquivo .env local ou nas variáveis da Vercel.',
        },
        { status: 500 }
      )
    }

    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado. Por favor, faça login.' }, { status: 401 })
    }

    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições enviadas. Aguarde alguns segundos.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const SYSTEM_INSTRUCTION = `You are Alex, an expert, warm, and encouraging English teacher at English School. 
Your goal is to help students practice conversational English.

Rules:
1. Always reply primarily in English, keeping your language clear, natural, and accessible.
2. If the student makes a grammatical or spelling mistake, gently point it out in a small "💡 Quick Tip:" section at the bottom of your message.
3. Keep your answers concise (2-4 sentences) and end with an engaging open-ended question to keep the conversation flowing.
4. Always be polite, positive, and supportive.`

    // Format and sanitize history for Google Generative AI SDK requirement:
    // 1. First item MUST have role 'user'.
    // 2. Alternating role turns.
    let formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
    if (Array.isArray(history)) {
      for (const item of history) {
        if (!item.parts || typeof item.parts !== 'string') continue
        const role = item.role === 'user' ? 'user' : 'model'

        // Ignore messages if the first element would be 'model'
        if (formattedHistory.length === 0 && role === 'model') {
          continue
        }

        // Avoid consecutive duplicate roles
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
          continue
        }

        formattedHistory.push({
          role,
          parts: [{ text: item.parts }],
        })
      }
    }

    const availableModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash']
    let responseText = ''
    let lastError = null

    for (const modelName of availableModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        })

        const chat = model.startChat({ history: formattedHistory })
        const result = await chat.sendMessage(message)
        responseText = result.response.text()
        if (responseText) break
      } catch (err) {
        lastError = err
        console.warn(`Model ${modelName} failed, trying fallback...`, err)
      }
    }

    if (!responseText) {
      throw lastError || new Error('Não foi possível obter resposta do Gemini AI.')
    }

    return NextResponse.json({ reply: responseText })
  } catch (error: any) {
    console.error('Gemini AI Tutor error:', error)
    return NextResponse.json(
      { error: error.message || 'Desculpe, ocorreu um erro ao conectar com o Tutor de IA.' },
      { status: 500 }
    )
  }
}
