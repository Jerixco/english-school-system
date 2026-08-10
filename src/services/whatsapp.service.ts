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
  data?: Record<string, any>
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
        return sendWelcomeWhatsApp(to, data?.name || '')

      case 'consultation':
        return sendConsultationConfirmationWhatsApp(
          to,
          data?.name || '',
          data?.date || ''
        )

      case 'payment':
        return sendPaymentConfirmationWhatsApp(
          to,
          data?.name || '',
          data?.amount || 0
        )

      case 'reminder':
        return sendClassReminderWhatsApp(
          to,
          data?.name || '',
          data?.date || '',
          data?.teacher || ''
        )

      case 'custom':
        if (!customMessage) {
          throw new Error('CUSTOM_MESSAGE_REQUIRED')
        }
        return sendWhatsAppMessage(to, customMessage)

      default:
        throw new Error('INVALID_MESSAGE_TYPE')
    }
  }
}
