import {
  sendWhatsAppMessage,
  sendWelcomeWhatsApp,
  sendConsultationConfirmationWhatsApp,
  sendPaymentConfirmationWhatsApp,
  sendClassReminderWhatsApp,
} from '@/lib/whatsapp'

export interface WhatsAppSendParams {
  type: 'welcome' | 'consultation' | 'payment' | 'reminder' | 'custom'
  to: string
  data?: Record<string, string | number | undefined>
  customMessage?: string
}

export class WhatsAppService {
  /**
   * Envia uma mensagem via WhatsApp com base no tipo especificado.
   */
  async sendMessage(params: WhatsAppSendParams) {
    const { type, to, data, customMessage } = params

    switch (type) {
      case 'welcome':
        return sendWelcomeWhatsApp(to, String(data?.name || ''))

      case 'consultation':
        return sendConsultationConfirmationWhatsApp(
          to,
          String(data?.name || ''),
          String(data?.date || '')
        )

      case 'payment':
        return sendPaymentConfirmationWhatsApp(
          to,
          String(data?.name || ''),
          Number(data?.amount || 0)
        )

      case 'reminder':
        return sendClassReminderWhatsApp(
          to,
          String(data?.name || ''),
          String(data?.date || ''),
          String(data?.teacher || '')
        )

      case 'custom':
        if (!customMessage || customMessage.trim().length === 0) {
          throw new Error('CUSTOM_MESSAGE_REQUIRED')
        }
        return sendWhatsAppMessage(to, customMessage.trim())

      default:
        throw new Error('INVALID_MESSAGE_TYPE')
    }
  }
}
