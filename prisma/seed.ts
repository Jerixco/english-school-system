import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Trava de segurança: impede execução acidental em produção
  if (process.env.NODE_ENV === 'production' && !process.env.FORCE_SEED) {
    console.error('🚫 ERRO DE SEGURANÇA: A execução do script de seed está bloqueada em ambiente de produção.')
    console.error('Para forçar a execução em ambiente controlado, defina FORCE_SEED=true.')
    process.exit(1)
  }

  console.log('🌱 Iniciando população controlada do banco de dados (Seed)...')

  const seedPassword = process.env.SEED_DEFAULT_PASSWORD || 'DevPass@English2026!'
  const defaultPassword = await bcrypt.hash(seedPassword, 12)

  // 1. Criar Usuário Admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@englishschool.com'
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Diretoria Executiva',
      password: defaultPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Usuário Admin preparado:', adminUser.email)

  // 2. Criar Usuário Professor
  const teacherEmail = process.env.SEED_TEACHER_EMAIL || 'teacher@englishschool.com'
  const teacherUser = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: {},
    create: {
      email: teacherEmail,
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
  console.log('✅ Perfil de Professor preparado:', teacherUser.email)

  // 3. Criar Usuário Aluno
  const studentEmail = process.env.SEED_STUDENT_EMAIL || 'student@englishschool.com'
  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
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
  console.log('✅ Perfil de Aluno preparado:', studentUser.email)

  // 3.5. Criar Usuário Avaliador / Demonstração (Read-Only)
  const demoEmail = process.env.DEMO_USER_EMAIL || 'preview.demo@englishschool.com'
  const demoPassword = await bcrypt.hash(process.env.DEMO_USER_PASSWORD || 'EnglishDemo@2026!#', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      password: demoPassword,
      role: 'ADMIN',
      name: 'Avaliador Demonstração',
    },
    create: {
      email: demoEmail,
      name: 'Avaliador Demonstração',
      password: demoPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Usuário Avaliador Demo preparado:', demoUser.email)

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

  // 7. Atualizar / Criar Aulas Gravadas (VOD com Expiração e Thumbnails Oficiais)
  await prisma.recording.deleteMany({
    where: { teacherId: teacher.id },
  })

  const sampleRecording1 = await prisma.recording.create({
    data: {
      title: 'Aula 01: Business English & Negotiation Skills',
      description: 'Técnicas de persuasão, vocabulário corporativo e simulações de negociação internacional.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: '/images/thumbnails/business-english-negotiation.png',
      durationMinutes: 45,
      recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Gravada há 3 dias
      expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // Expira em 27 dias
      teacherId: teacher.id,
      studentId: student.id,
    },
  })

  const sampleRecording2 = await prisma.recording.create({
    data: {
      title: 'Aula 02: Advanced Phrasal Verbs & Slang',
      description: 'Imersão nos phrasal verbs e expressões idiomáticas mais usadas em reuniões informais e conversação fluida.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: '/images/thumbnails/advanced-phrasal-verbs.png',
      durationMinutes: 52,
      recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Gravada há 7 dias
      expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // Expira em 23 dias
      teacherId: teacher.id,
      studentId: student.id,
    },
  })

  const sampleRecording3 = await prisma.recording.create({
    data: {
      title: 'Aula 03: Mastering Job Interviews in English',
      description: 'Como responder com confiança às perguntas mais difíceis, apresentar seus cases e negociar salário em inglês.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: '/images/thumbnails/mastering-job-interviews.png',
      durationMinutes: 48,
      recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Gravada há 10 dias
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Expira em 20 dias
      teacherId: teacher.id,
      studentId: student.id,
    },
  })
  console.log('✅ Gravações com thumbnails oficiais registradas:', [
    sampleRecording1.id,
    sampleRecording2.id,
    sampleRecording3.id,
  ])

  console.log('\n🎉 População inicial (Seed) concluída com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a população (Seed):', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
