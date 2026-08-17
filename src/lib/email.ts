import nodemailer from 'nodemailer'

let transporterInstance: nodemailer.Transporter | null = null

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  return transporterInstance
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = getTransporter()
    if (!transporter) {
      console.warn(`[EMAIL NOTICE]: SMTP não configurado. Email para ${to} registrado (Subject: "${subject}")`)
      return { success: true, mocked: true }
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@englishschool.com',
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bem-vindo(a) à Nossa Escola de Inglês!</h1>
        </div>
        <div class="content">
          <p>Olá, ${name}!</p>
          <p>É um prazer ter você conosco. Estamos muito animados em começar essa jornada de aprendizado de inglês com você.</p>
          <p>Para começar, agende sua primeira aula gratuita através do nosso calendário.</p>
          <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL}" class="button">Agendar Aula Gratuita</a>
          <p style="margin-top: 30px;">Se tiver alguma dúvida, não hesite em nos contatar.</p>
          <p>Atenciosamente,<br>Equipe da Escola de Inglês</p>
        </div>
        <div class="footer">
          <p>© 2024 Escola de Inglês. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, 'Bem-vindo à Nossa Escola de Inglês!', html)
}

export const sendConsultationConfirmationEmail = async (
  email: string,
  name: string,
  date: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Consulta Confirmada!</h1>
        </div>
        <div class="content">
          <p>Olá, ${name}!</p>
          <p>Sua consulta foi agendada com sucesso. Aqui estão os detalhes:</p>
          <div class="details">
            <p><strong>Data:</strong> ${date}</p>
            <p><strong>Duração:</strong> 30 minutos</p>
            <p><strong>Formato:</strong> Videoconferência</p>
          </div>
          <p>Você receberá um link de acesso 15 minutos antes da consulta.</p>
          <p>Atenciosamente,<br>Equipe da Escola de Inglês</p>
        </div>
        <div class="footer">
          <p>© 2024 Escola de Inglês. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, 'Sua Consulta foi Confirmada!', html)
}

export const sendPaymentConfirmationEmail = async (
  email: string,
  name: string,
  amount: number,
  plan: string
) => {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pagamento Confirmado!</h1>
        </div>
        <div class="content">
          <p>Olá, ${name}!</p>
          <p>Seu pagamento foi processado com sucesso.</p>
          <div class="details">
            <p><strong>Plano:</strong> ${plan}</p>
            <p><strong>Valor:</strong> ${formattedAmount}</p>
            <p><strong>Status:</strong> Pago</p>
          </div>
          <p>Sua assinatura está ativa e você já pode agendar suas aulas.</p>
          <p>Atenciosamente,<br>Equipe da Escola de Inglês</p>
        </div>
        <div class="footer">
          <p>© 2024 Escola de Inglês. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, 'Pagamento Confirmado - Assinatura Ativa', html)
}

export const sendPaymentReminderEmail = async (
  email: string,
  name: string,
  dueDate: string,
  amount: number
) => {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Lembrete de Pagamento</h1>
        </div>
        <div class="content">
          <p>Olá, ${name}!</p>
          <p>Este é um lembrete sobre seu próximo pagamento.</p>
          <div class="details">
            <p><strong>Valor:</strong> ${formattedAmount}</p>
            <p><strong>Data de vencimento:</strong> ${dueDate}</p>
          </div>
          <p>O pagamento será processado automaticamente através do cartão cadastrado.</p>
          <p>Atenciosamente,<br>Equipe da Escola de Inglês</p>
        </div>
        <div class="footer">
          <p>© 2024 Escola de Inglês. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, 'Lembrete de Pagamento', html)
}

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperação de Senha</h1>
        </div>
        <div class="content">
          <p>Olá!</p>
          <p>Você solicitou a recuperação de senha para sua conta na Escola de Inglês.</p>
          <p>Clique no botão abaixo para definir uma nova senha:</p>
          <a href="${resetUrl}" class="button">Redefinir Senha</a>
          <p style="margin-top: 30px;">Se você não solicitou isso, por favor ignore este email.</p>
          <p>Atenciosamente,<br>Equipe da Escola de Inglês</p>
        </div>
        <div class="footer">
          <p>© 2026 Escola de Inglês. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
  return sendEmail(email, 'Recuperação de Senha - Escola de Inglês', html)
}
