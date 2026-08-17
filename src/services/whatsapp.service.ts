import {
  sendWhatsAppMessage,
  sendWelcomeWhatsApp,
  sendConsultationConfirmationWhatsApp,
  sendPaymentConfirmationWhatsApp,
  sendClassReminderWhatsApp,
} from '@/lib/whatsapp'

export interface WhatsAppSendParams {
  type: 'welcome' | 'consultation' | 'payment' | 'reminder'
  to: string
  data?: Record<string, string | number>
}

export class WhatsAppService {
  /**
   * Envia uma mensagem via WhatsApp com base no tipo especificado.
   */
  async sendMessage(params: WhatsAppSendParams) {
    const { type, to, data } = params

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
          String(data?.name || ''),
          String(data?.date || ''),
          String(data?.teacher || '')
        )

      default:
        throw new Error('INVALID_MESSAGE_TYPE')
    }
  }
}
