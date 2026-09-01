const DEFAULT_GRAPH_VERSION = 'v23.0'
const REQUEST_TIMEOUT_MS = 10_000
const MAX_TEXT_LENGTH = 4_096

export interface WhatsAppMessage {
  to: string
  message: string
}

export interface WhatsAppSendResult {
  success: boolean
  messageId?: string
  waId?: string
  error?: string
}

interface WhatsAppApiResponse {
  contacts?: Array<{ input?: string; wa_id?: string }>
  messages?: Array<{ id?: string }>
  error?: { message?: string; type?: string; code?: number; fbtrace_id?: string }
}

function getConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim()
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION?.trim() || DEFAULT_GRAPH_VERSION
  const defaultCountryCode = (process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '55').replace(/\D/g, '')

  if (!accessToken || !phoneNumberId) return null
  if (!/^v\d+\.\d+$/.test(graphVersion) || !/^\d+$/.test(phoneNumberId)) return null

  return { accessToken, phoneNumberId, graphVersion, defaultCountryCode }
}

/**
 * Converte números nacionais e internacionais para o formato aceito pela Meta.
 * O código padrão é 55 (Brasil), configurável por WHATSAPP_DEFAULT_COUNTRY_CODE.
 */
export function normalizeWhatsAppPhone(phone: string, defaultCountryCode = '55'): string {
  const digits = phone.replace(/\D/g, '')
  const countryCode = defaultCountryCode.replace(/\D/g, '')
  const withoutInternationalPrefix = digits.startsWith('00') ? digits.slice(2) : digits
  const normalized =
    countryCode && !withoutInternationalPrefix.startsWith(countryCode)
      ? `${countryCode}${withoutInternationalPrefix}`
      : withoutInternationalPrefix

  if (normalized.length < 10 || normalized.length > 15) {
    throw new Error('INVALID_WHATSAPP_PHONE')
  }

  return normalized
}

async function parseResponse(response: Response): Promise<WhatsAppApiResponse> {
  try {
    return (await response.json()) as WhatsAppApiResponse
  } catch {
    return {}
  }
}

export const sendWhatsAppMessage = async (
  to: string,
  message: string
): Promise<WhatsAppSendResult> => {
  const config = getConfig()

  if (!config) {
    console.error('WhatsApp Cloud API is not configured: missing or invalid server configuration')
    return { success: false, error: 'WhatsApp Business API não configurada.' }
  }

  let normalizedPhone: string
  try {
    normalizedPhone = normalizeWhatsAppPhone(to, config.defaultCountryCode)
  } catch {
    return { success: false, error: 'Número de WhatsApp inválido.' }
  }

  const trimmedMessage = message.trim()
  if (!trimmedMessage || trimmedMessage.length > MAX_TEXT_LENGTH) {
    return { success: false, error: 'Mensagem inválida para envio.' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(
      `https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'text',
          text: { preview_url: false, body: trimmedMessage },
        }),
        signal: controller.signal,
      }
    )

    const payload = await parseResponse(response)

    if (!response.ok) {
      // Registra apenas metadados do provedor; token, telefone e conteúdo nunca vão para o log.
      console.error('WhatsApp Cloud API rejected the message', {
        status: response.status,
        code: payload.error?.code,
        type: payload.error?.type,
        traceId: payload.error?.fbtrace_id,
      })
      return { success: false, error: 'O provedor do WhatsApp recusou a mensagem.' }
    }

    const messageId = payload.messages?.[0]?.id
    if (!messageId) {
      console.error('WhatsApp Cloud API returned no message identifier')
      return { success: false, error: 'Resposta inválida do provedor do WhatsApp.' }
    }

    return {
      success: true,
      messageId,
      waId: payload.contacts?.[0]?.wa_id,
    }
  } catch (error) {
    console.error('WhatsApp Cloud API request failed', {
      reason: error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network_error',
    })
    return { success: false, error: 'Não foi possível enviar a mensagem pelo WhatsApp.' }
  } finally {
    clearTimeout(timeout)
  }
}

export const sendWelcomeWhatsApp = async (phone: string, name: string) => {
  const message = `Olá, ${name}! 👋 Bem-vindo(a) à nossa escola de inglês! Estamos muito felizes em ter você conosco. 🎉

Para começar, agende sua primeira aula gratuita através do nosso site. Se tiver alguma dúvida, é só nos chamar!`

  return sendWhatsAppMessage(phone, message)
}

export const sendConsultationConfirmationWhatsApp = async (
  phone: string,
  name: string,
  date: string
) => {
  const message = `Olá, ${name}! ✅ Sua consulta foi confirmada!

📅 Data: ${date}
⏱️ Duração: 30 minutos
📹 Você receberá o link 15 minutos antes.

Não esqueça de preparar suas perguntas! Até logo! 🚀`

  return sendWhatsAppMessage(phone, message)
}

export const sendPaymentConfirmationWhatsApp = async (
  phone: string,
  name: string,
  amount: number
) => {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)

  const message = `Olá, ${name}! 💳 Pagamento confirmado!

Valor: ${formattedAmount}
Status: ✅ Pago

Sua assinatura está ativa! Já pode agendar suas aulas. 📚`

  return sendWhatsAppMessage(phone, message)
}

export const sendClassReminderWhatsApp = async (
  phone: string,
  name: string,
  date: string,
  teacher: string
) => {
  const message = `Olá, ${name}! ⏰ Lembrete de aula!

📅 Data: ${date}
👨‍🏫 Professor: ${teacher}

Prepare-se para sua aula! O link será enviado em breve. 📹`

  return sendWhatsAppMessage(phone, message)
}
