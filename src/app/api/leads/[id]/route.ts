export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, apiRateLimiter, getClientIdentifier } from '@/lib/rate-limiter'
import { getAuthenticatedUser, isAdmin, blockDemoMutations } from '@/lib/security'
import { idSchema } from '@/lib/validations'
import { LeadService } from '@/services/lead.service'
import { z } from 'zod'

const leadService = new LeadService()

const updateLeadSchema = z.object({
  status: z
    .enum([
      'NEW',
      'CONTACTED',
      'CONSULTATION_SCHEDULED',
      'CONSULTATION_COMPLETED',
      'PROPOSAL_SENT',
      'CONVERTED',
      'LOST',
    ])
    .optional(),
  notes: z.string().max(2000).optional(),
  assignedTo: z.string().max(100).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    idSchema.parse(id)

    const body = await req.json()
    const data = updateLeadSchema.parse(body)

    const lead = await leadService.updateLead(id, data)

    return NextResponse.json(lead)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    idSchema.parse(id)

    await leadService.deleteLead(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: error.errors },
        { status: 400 }
      )
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
