import { NextRequest, NextResponse } from 'next/server'
import { 
  sendWhatsAppMessage, 
  sendWelcomeWhatsApp, 
  sendConsultationConfirmationWhatsApp, 
  sendPaymentConfirmationWhatsApp, 
  sendClassReminderWhatsApp 
} from '@/lib/whatsapp'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { z } from 'zod'

const whatsappSchema = z.object({
  type: z.enum(['welcome', 'consultation', 'payment', 'reminder', 'custom']),
  to: z.string().min(10, 'Phone number must be at least 10 digits'),
  data: z.record(z.any()).optional(),
  customMessage: z.string().optional(),
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

    const body = await req.json()
    
    // Validate input
    const validatedData = whatsappSchema.parse(body)

    let result

    switch (validatedData.type) {
      case 'welcome':
        result = await sendWelcomeWhatsApp(validatedData.to, validatedData.data?.name || '')
        break
      case 'consultation':
        result = await sendConsultationConfirmationWhatsApp(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.date || ''
        )
        break
      case 'payment':
        result = await sendPaymentConfirmationWhatsApp(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.amount || 0
        )
        break
      case 'reminder':
        result = await sendClassReminderWhatsApp(
          validatedData.to,
          validatedData.data?.name || '',
          validatedData.data?.date || '',
          validatedData.data?.teacher || ''
        )
        break
      case 'custom':
        if (!validatedData.customMessage) {
          return NextResponse.json(
            { error: 'Custom messages require message content' },
            { status: 400 }
          )
        }
        result = await sendWhatsAppMessage(validatedData.to, validatedData.customMessage)
        break
    }

    if (result?.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: result?.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    )
  }
}
