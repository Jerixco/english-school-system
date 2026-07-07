import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { calendlyUrl, bio, specialties, availability, isActive } = await req.json()

    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        calendlyUrl,
        bio,
        specialties,
        availability,
        isActive,
      },
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.teacher.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    )
  }
}
