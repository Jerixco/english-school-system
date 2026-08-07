export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRequestUserId } from '@/lib/request-user'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getRequestUserId(req)
    const { id } = await params
    const { status, notes, assignedTo } = await req.json()

    const existingLead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
      select: { id: true },
    })

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found for this user' },
        { status: 404 }
      )
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status,
        notes,
        assignedTo,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    if (error instanceof Error && error.message.includes('X-User-Id')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
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
    const userId = getRequestUserId(req)
    const { id } = await params
    const deleted = await prisma.lead.deleteMany({
      where: {
        id,
        userId,
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Lead not found for this user' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes('X-User-Id')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
