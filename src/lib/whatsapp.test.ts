import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizeWhatsAppPhone, sendWhatsAppMessage } from './whatsapp'

describe('WhatsApp Cloud API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('normalizes Brazilian national numbers to E.164 digits', () => {
    expect(normalizeWhatsAppPhone('(11) 99999-9999')).toBe('5511999999999')
    expect(normalizeWhatsAppPhone('005511999999999')).toBe('5511999999999')
  })

  it('rejects numbers outside the provider length limits', () => {
    expect(() => normalizeWhatsAppPhone('123')).toThrow('INVALID_WHATSAPP_PHONE')
    expect(() => normalizeWhatsAppPhone('1'.repeat(20))).toThrow('INVALID_WHATSAPP_PHONE')
  })

  it('fails explicitly when server credentials are not configured', async () => {
    vi.stubEnv('WHATSAPP_ACCESS_TOKEN', '')
    vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(sendWhatsAppMessage('11999999999', 'Olá')).resolves.toEqual({
      success: false,
      error: 'WhatsApp Business API não configurada.',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends a text message through the official messages endpoint', async () => {
    vi.stubEnv('WHATSAPP_ACCESS_TOKEN', 'server-token')
    vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '123456789012345')
    vi.stubEnv('WHATSAPP_GRAPH_VERSION', 'v23.0')
    vi.stubEnv('WHATSAPP_DEFAULT_COUNTRY_CODE', '55')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          contacts: [{ wa_id: '5511999999999' }],
          messages: [{ id: 'wamid.test' }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )

    const result = await sendWhatsAppMessage('11999999999', ' Olá, aluno! ')
    expect(result).toEqual({ success: true, messageId: 'wamid.test', waId: '5511999999999' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://graph.facebook.com/v23.0/123456789012345/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer server-token' }),
        body: expect.stringContaining('5511999999999'),
      })
    )
  })

  it('does not expose provider error details to callers', async () => {
    vi.stubEnv('WHATSAPP_ACCESS_TOKEN', 'server-token')
    vi.stubEnv('WHATSAPP_PHONE_NUMBER_ID', '123456789012345')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: { code: 131026, message: 'Sensitive provider detail' } }), {
        status: 400,
      })
    )

    await expect(sendWhatsAppMessage('11999999999', 'Olá')).resolves.toEqual({
      success: false,
      error: 'O provedor do WhatsApp recusou a mensagem.',
    })
  })
})
