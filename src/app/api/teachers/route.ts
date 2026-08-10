export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdmin } from '@/lib/security'
import { validateTeacher } from '@/lib/validations'
import { TeacherService } from '@/services/teacher.service'
import { ZodError } from 'zod'

const teacherService = new TeacherService()

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('activeOnly') !== 'false' && (!user || !isAdmin(user))

    // Email é PII: só exposto para admin.
    const isAdminUser = Boolean(user && isAdmin(user))

    const teachers = await teacherService.listTeachers({
      activeOnly,
      showEmail: isAdminUser,
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: 'Erro ao buscar professores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = validateTeacher(body)

    const teacher = await teacherService.createTeacher(validatedData)

    return NextResponse.json(teacher, { status: 201 })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    if (error.message === 'TEACHER_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'Usuário já possui perfil de professor registrado' }, { status: 409 })
    }

    console.error('Error creating teacher:', error)
    return NextResponse.json({ error: 'Erro ao criar professor' }, { status: 500 })
  }
}
