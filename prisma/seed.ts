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

  // 4. Criar Aula de Exemplo
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

  // 5. Criar Pagamento de Exemplo
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
