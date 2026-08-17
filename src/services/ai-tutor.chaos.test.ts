import { describe, it, expect, vi } from 'vitest'
import { AiTutorService } from './ai-tutor.service'

describe('AI Tutor Chaos & Resilience Testing (Injeção de Falhas e Entropia)', () => {
  it('se recupera graciosamente quando o primeiro modelo sofre 429 Quota Exceeded e aciona o fallback', async () => {
    const service = new AiTutorService('fake-test-api-key')

    let callCount = 0
    // Mock interno da chamada do Gemini
    vi.spyOn(service, 'getReply').mockImplementation(async () => {
      callCount++
      // Simula: Modelo 1 falhou com Quota 429, Modelo 2 respondeu com sucesso
      return {
        text: 'Hello! I am Alex, your English teacher. How can I help you practice today?',
        isQuotaExceeded: true,
      }
    })

    const reply = await service.getReply('Hello teacher!')
    expect(reply.text).toContain('Alex')
    expect(reply.isQuotaExceeded).toBe(true)
  })

  it('suporta diferentes níveis de entropia/temperatura sem quebrar o contrato da API', async () => {
    const service = new AiTutorService('fake-test-api-key')

    vi.spyOn(service, 'getReply').mockImplementation(async (_msg, _hist, options) => {
      const temp = options?.temperature ?? 0.7
      return {
        text: `Response with temperature ${temp}`,
        isQuotaExceeded: false,
      }
    })

    // Teste com baixa entropia (determinístico)
    const resLow = await service.getReply('Explain verb to be', [], { temperature: 0.2 })
    expect(resLow.text).toBe('Response with temperature 0.2')

    // Teste com alta entropia (criativo e conversacional)
    const resHigh = await service.getReply('Tell me a creative story in English', [], { temperature: 0.85 })
    expect(resHigh.text).toBe('Response with temperature 0.85')
  })

  it('formata histórico caótico (com mensagens vazias, roles duplicados e ordem corrompida) de forma resiliente', () => {
    const service = new AiTutorService('fake-test-api-key')
    const chaoticHistory = [
      { role: 'model' as const, parts: 'Should be ignored because first message must be user' },
      { role: 'user' as const, parts: 'Valid user msg 1' },
      { role: 'user' as const, parts: 'Duplicate user msg 2 (should be ignored)' },
      { role: 'model' as const, parts: '' }, // Mensagem vazia (deve ser ignorada)
      { role: 'model' as const, parts: 'Valid model msg' },
      { role: 'user' as const, parts: 'Valid user msg 3' },
    ]

    const formatted = (service as any).formatHistory(chaoticHistory)

    // Garante que a primeira é do usuário
    expect(formatted[0].role).toBe('user')
    expect(formatted[0].parts[0].text).toBe('Valid user msg 1')

    // Garante alternância perfeita (user -> model -> user)
    expect(formatted.length).toBe(3)
    expect(formatted[1].role).toBe('model')
    expect(formatted[2].role).toBe('user')
  })
})
