export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { checkRateLimit, aiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { AiTutorService, ChatMessage } from '@/services/ai-tutor.service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const aiMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'A mensagem não pode estar vazia.')
    .max(1000, 'Mensagem muito longa. O limite é de 1.000 caracteres por envio.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.union([
          z.string(),
          z.array(z.object({ text: z.string().max(2000) })),
        ]),
      })
    )
    .max(10, 'Histórico de contexto excedeu o limite máximo.')
    .optional()
    .default([]),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Sessão expirada. Por favor, faça login novamente.' }, { status: 401 })
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey === 'mock') {
      return NextResponse.json(
        { error: 'O Tutor IA não está configurado neste ambiente.' },
        { status: 503 }
      )
    }

    // Validação de autorização: Aluno precisa estar com status ACTIVE ou TRIAL
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

    const rateLimit = await checkRateLimit(aiRateLimiter, getClientIdentifier(req))
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: '⏳ Limite de mensagens para o Tutor IA atingido. Por favor, aguarde 1 minuto.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { message, history } = aiMessageSchema.parse(body)

    const aiTutor = new AiTutorService(apiKey)
    const { text, isQuotaExceeded, errorCode } = await aiTutor.getReply(
      message,
      (history || []) as ChatMessage[]
    )

    if (!text) {
      if (isQuotaExceeded) {
        return NextResponse.json(
          { error: '⏳ O limite temporário de respostas por minuto da IA foi atingido. Aguarde 1 minuto.' },
          { status: 429 }
        )
      }

      if (errorCode === 'AUTHENTICATION') {
        return NextResponse.json(
          { error: 'A configuração do provedor de IA foi rejeitada. Verifique a chave do Gemini.' },
          { status: 503 }
        )
      }

      if (errorCode === 'MODEL') {
        return NextResponse.json(
          { error: 'Nenhum modelo Gemini configurado está disponível para esta conta.' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: '⏳ O serviço de IA está temporariamente ocupado. Por favor, tente enviar novamente em alguns segundos.' },
        { status: 429 }
      )
    }

    return NextResponse.json({ reply: text })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      )
    }

    console.error('Gemini AI Tutor error:', error)
    return NextResponse.json(
      { error: 'Ocorreu um erro temporário ao conectar com a IA. Tente novamente.' },
      { status: 500 }
    )
  }
}
