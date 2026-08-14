import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const demoEmail = process.env.DEMO_USER_EMAIL || 'preview.demo@englishschool.com'
  const rawPassword = process.env.DEMO_USER_PASSWORD || 'EnglishDemo@2026!#'
  const hashedPassword = await bcrypt.hash(rawPassword, 12)

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Avaliador Demonstração',
      twoFactorEnabled: false,
    },
    create: {
      email: demoEmail,
      name: 'Avaliador Demonstração',
      password: hashedPassword,
      role: 'ADMIN',
      twoFactorEnabled: false,
      emailVerified: new Date(),
    },
  })

  console.log('----------------------------------------------------')
  console.log('✅ Conta de Demonstração (Read-Only) criada/atualizada com sucesso!')
  console.log(`👤 Email: ${user.email}`)
  console.log(`🔑 Senha: ${rawPassword}`)
  console.log('🛡️ Permissão no Sistema: Apenas Leitura / Visualizador Multi-Portal')
  console.log('----------------------------------------------------')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar conta de demonstração:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
