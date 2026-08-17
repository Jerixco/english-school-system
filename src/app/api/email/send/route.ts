import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendWelcomeEmail, sendConsultationConfirmationEmail, sendPaymentConfirmationEmail, sendPaymentReminderEmail } from '@/lib/email'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin, blockDemoMutations } from '@/lib/security'
import { sanitizeRichHtml } from '@/lib/sanitize-html'
import { z } from 'zod'

const emailSchema = z.object({
  type: z.enum(['welcome', 'consultation', 'payment', 'reminder', 'custom']),
  to: z.string().email(),
  data: z.record(z.any()).optional(),
  customSubject: z.string().optional(),
  customHtml: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Somente ADMIN pode disparar e-mails — impede open relay para phishing/spam.
    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: user ? 403 : 401 }
      )
    }

    const demoBlock = blockDemoMutations(user)
    if (demoBlock) return demoBlock

    const body = await req.json()
    
    // Validate input
    const validatedData = emailSchema.parse(body)

    let result

    switch (validatedData.type) {
      case 'welcome':
        result = await sendWelcomeEmail(validatedData.to, validatedData.data?.name || '')
        break
      case 'consultation':
        result = await sendConsultationConfirmationEmail(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.date || ''
        )
        break
      case 'payment':
        result = await sendPaymentConfirmationEmail(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.amount || 0,
          validatedData.data?.plan || ''
        )
        break
      case 'reminder':
        result = await sendPaymentReminderEmail(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.dueDate || '',
          validatedData.data?.amount || 0
        )
        break
      case 'custom':
        if (!validatedData.customSubject || !validatedData.customHtml) {
          return NextResponse.json(
            { error: 'Custom emails require subject and html' },
            { status: 400 }
          )
        }
        result = await sendEmail(
          validatedData.to, 
          validatedData.customSubject, 
          sanitizeRichHtml(validatedData.customHtml)
        )
        break
    }

    if (result?.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result?.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error sending email:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
