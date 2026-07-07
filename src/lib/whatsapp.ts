// WhatsApp Business API Integration
// This is a simplified implementation. For production, use the official WhatsApp Business API

export interface WhatsAppMessage {
  to: string
  message: string
}

export const sendWhatsAppMessage = async (
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In production, integrate with WhatsApp Business API
    // This is a placeholder implementation
    
    console.log(`WhatsApp message sent to ${to}: ${message}`)
    
    // Example using WhatsApp Business API (uncomment and configure):
    /*
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/\D/g, ''),
        type: 'text',
        text: { body: message },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message')
    }
    */

    return { success: true }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return { success: false, error: 'Failed to send message' }
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
    currency: 'BRL'
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
