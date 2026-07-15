export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, notes, assignedTo } = await req.json()

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
    const { id } = await params
    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}
