import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AiTutorService } from './ai-tutor.service'

const sdkMocks = vi.hoisted(() => ({
  getGenerativeModel: vi.fn(),
  startChat: vi.fn(),
  sendMessage: vi.fn(),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function () {
    return {
      getGenerativeModel: sdkMocks.getGenerativeModel,
    }
  }),
}))

describe('AI Tutor: integração e resiliência', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.GEMINI_MODEL
    sdkMocks.getGenerativeModel.mockReturnValue({ startChat: sdkMocks.startChat })
    sdkMocks.startChat.mockReturnValue({ sendMessage: sdkMocks.sendMessage })
    sdkMocks.sendMessage.mockResolvedValue({ response: { text: () => 'Hello! Let\'s practice.' } })
  })

  it('faz uma chamada real através do contrato do SDK e retorna a resposta', async () => {
    const service = new AiTutorService('fake-test-api-key')

    const reply = await service.getReply('Hello teacher!')

    expect(reply).toMatchObject({ text: "Hello! Let's practice." })
    expect(sdkMocks.getGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.5-flash', systemInstruction: expect.any(String) })
    )
    expect(sdkMocks.startChat).toHaveBeenCalledWith({ history: [] })
    expect(sdkMocks.sendMessage).toHaveBeenCalledWith('Hello teacher!')
  })

  it('aciona o fallback quando um modelo não está disponível', async () => {
    sdkMocks.getGenerativeModel
      .mockImplementationOnce(() => {
        throw Object.assign(new Error('Model not found'), { status: 404 })
      })
      .mockReturnValue({ startChat: sdkMocks.startChat })

    const reply = await new AiTutorService('fake-test-api-key').getReply('Practice English')

    expect(reply.text).toBe("Hello! Let's practice.")
    expect(sdkMocks.getGenerativeModel).toHaveBeenCalledTimes(2)
  })

  it('classifica quota esgotada sem mascarar o estado como sucesso', async () => {
    sdkMocks.getGenerativeModel.mockImplementation(() => {
      throw Object.assign(new Error('Resource exhausted: quota'), { status: 429 })
    })

    const reply = await new AiTutorService('fake-test-api-key').getReply('Practice English')

    expect(reply).toMatchObject({ text: '', isQuotaExceeded: true, errorCode: 'QUOTA' })
    expect(sdkMocks.getGenerativeModel).toHaveBeenCalledTimes(3)
  })

  it('preserva mensagens repetidas consolidando o contexto por papel', () => {
    const service = new AiTutorService('fake-test-api-key')
    const formatted = (service as any).formatHistory([
      { role: 'model' as const, parts: 'Resposta inicial ignorada' },
      { role: 'user' as const, parts: 'Valid user msg 1' },
      { role: 'user' as const, parts: 'Valid user msg 2' },
      { role: 'model' as const, parts: [{ text: 'Valid model msg' }] },
    ])

    expect(formatted).toEqual([
      { role: 'user', parts: [{ text: 'Valid user msg 1\nValid user msg 2' }] },
      { role: 'model', parts: [{ text: 'Valid model msg' }] },
    ])
  })

  it('respeita o modelo configurado pelo ambiente', async () => {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash'

    await new AiTutorService('fake-test-api-key').getReply('Hello')

    expect(sdkMocks.getGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-3.6-flash' })
    )
  })
})
