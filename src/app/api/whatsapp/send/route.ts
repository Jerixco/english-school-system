import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin, blockDemoMutations } from '@/lib/security'
import { WhatsAppService } from '@/services/whatsapp.service'
import { z } from 'zod'

const whatsappService = new WhatsAppService()

const whatsappSchema = z.object({
  type: z.enum(['welcome', 'consultation', 'payment', 'reminder', 'custom']),
  to: z.string().min(10, 'Phone number must be at least 10 digits'),
  data: z.record(z.any()).optional(),
  customMessage: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkRateLimit(apiRateLimiter, identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

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
    const validatedData = whatsappSchema.parse(body)

    const result = await whatsappService.sendMessage(validatedData)

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
    
    if (error.message === 'CUSTOM_MESSAGE_REQUIRED') {
      return NextResponse.json(
        { error: 'Custom messages require message content' },
        { status: 400 }
      )
    }

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
