import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando população do banco de dados (Seed)...')

  const defaultPassword = await bcrypt.hash('Senha123!', 10)

  // 1. Criar Usuário Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@englishschool.com' },
    update: {},
    create: {
      email: 'admin@englishschool.com',
      name: 'Diretoria Executiva',
      password: defaultPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Usuário Admin criado:', adminUser.email)

  // 2. Criar Usuário Professor
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@englishschool.com' },
    update: {},
    create: {
      email: 'teacher@englishschool.com',
      name: 'Prof. Sarah Jenkins',
      password: defaultPassword,
      role: 'TEACHER',
      emailVerified: new Date(),
    },
  })

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      calendlyUrl: 'https://calendly.com/prof-sarah',
      bio: 'Native English speaker from London with over 8 years of teaching experience.',
      specialties: ['Business English', 'IELTS Prep', 'Conversation'],
      availability: ['Mon 09:00-18:00', 'Wed 09:00-18:00', 'Fri 09:00-18:00'],
    },
  })
  console.log('✅ Perfil de Professor criado:', teacherUser.email)

  // 3. Criar Usuário Aluno
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@englishschool.com' },
    update: {},
    create: {
      email: 'student@englishschool.com',
      name: 'Lucas Silva',
      password: defaultPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  })

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      plan: 'STANDARD',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  })
  console.log('✅ Perfil de Aluno criado:', studentUser.email)

  // 4. Criar Aula de Exemplo (Idempotente)
  const existingClass = await prisma.class.findFirst({
    where: { studentId: student.id, teacherId: teacher.id },
  })

  if (!existingClass) {
    const sampleClass = await prisma.class.create({
      data: {
        studentId: student.id,
        teacherId: teacher.id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
        duration: 60,
        status: 'SCHEDULED',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Aula focada em apresentações corporativas',
      },
    })
    console.log('✅ Aula demonstrativa agendada ID:', sampleClass.id)
  } else {
    console.log('ℹ️ Aula demonstrativa já existente:', existingClass.id)
  }

  // 5. Criar Pagamento de Exemplo (Idempotente)
  const existingPayment = await prisma.payment.findFirst({
    where: { studentId: student.id },
  })

  if (!existingPayment) {
    const samplePayment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: 49700, // R$ 497,00 em centavos
        currency: 'BRL',
        status: 'COMPLETED',
        paymentMethod: 'card',
        dueDate: new Date(),
        paidAt: new Date(),
      },
    })
    console.log('✅ Pagamento demonstrativo criado ID:', samplePayment.id)
  } else {
    console.log('ℹ️ Pagamento demonstrativo já existente:', existingPayment.id)
  }

  // 6. Criar Aula Ao Vivo de Demonstração (Idempotente)
  const existingLive = await prisma.liveSession.findFirst({
    where: { teacherId: teacher.id },
  })

  if (!existingLive) {
    const sampleLive = await prisma.liveSession.create({
      data: {
        title: 'Masterclass: Business English & Negotiation Skills',
        description: 'Imersão ao vivo com foco em simulações de negociação e vocabulário corporativo.',
        roomName: 'english-school-live-demo-room',
        meetLink: 'https://meet.jit.si/english-school-live-demo-room',
        status: 'LIVE',
        scheduledFor: new Date(),
        startedAt: new Date(),
        duration: 60,
        teacherId: teacher.id,
        studentId: student.id,
      },
    })
    console.log('✅ Aula Ao Vivo demonstrativa criada ID:', sampleLive.id)
  }

  // 7. Criar Aulas Gravadas (VOD com Expiração)
  const existingRecording = await prisma.recording.findFirst({
    where: { teacherId: teacher.id },
  })

  if (!existingRecording) {
    const sampleRecording1 = await prisma.recording.create({
      data: {
        title: 'Aula 01: Mastering Small Talk in Corporate Meetings',
        description: 'Técnicas de quebra-gelo e conversação fluida para reuniões internacionais.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
        durationMinutes: 45,
        recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Gravada há 5 dias
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Expira em 25 dias (plano Standard 30 dias)
        teacherId: teacher.id,
        studentId: student.id,
      },
    })

    const sampleRecording2 = await prisma.recording.create({
      data: {
        title: 'Aula 02: Advanced Email Writing & Phrasal Verbs',
        description: 'Como estruturar e-mails formais com precisão, clareza e impacto.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
        durationMinutes: 52,
        recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Gravada há 10 dias
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Expira em 20 dias
        teacherId: teacher.id,
        studentId: student.id,
      },
    })
    console.log('✅ Gravações demonstrativas criadas:', [sampleRecording1.id, sampleRecording2.id])
  }

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('--------------------------------------------------')
  console.log('🔑 Credenciais de Teste:')
  console.log('Admin:   admin@englishschool.com   / Senha123!')
  console.log('Teacher: teacher@englishschool.com / Senha123!')
  console.log('Student: student@englishschool.com / Senha123!')
  console.log('--------------------------------------------------')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a população (Seed):', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
