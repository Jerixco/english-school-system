import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyTwoFactorToken, decryptTwoFactorSecret } from '@/lib/two-factor'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorToken: { label: '2FA Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.password || user.deletedAt) {
          throw new Error('Credenciais inválidas')
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          // Conta a falha e bloqueia após o limite (brute-force / stuffing).
          const MAX_FAILED = 5
          const LOCK_MS = 15 * 60 * 1000
          const nextCount = user.failedLoginCount + 1
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: nextCount,
              lastFailedLogin: new Date(),
              ...(nextCount >= MAX_FAILED
                ? { lockedUntil: new Date(Date.now() + LOCK_MS), failedLoginCount: 0 }
                : {}),
            },
          })
          throw new Error('Credenciais inválidas')
        }

        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorToken) {
            throw new Error('TWO_FACTOR_REQUIRED')
          }

          if (!user.twoFactorSecret) {
            throw new Error('Erro na configuração 2FA')
          }

          const secret = decryptTwoFactorSecret(user.twoFactorSecret)
          const isValidToken = verifyTwoFactorToken(credentials.twoFactorToken, secret)

          if (!isValidToken) {
            throw new Error('Token 2FA inválido')
          }
        }

        // Login completo com sucesso: zera contadores de bloqueio.
        if (user.failedLoginCount > 0 || user.lockedUntil || user.lastFailedLogin) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginCount: 0, lockedUntil: null, lastFailedLogin: null },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // No momento inicial de sign-in, os dados do usuário acabaram de ser validados
      if (user) {
        token.role = user.role
        token.id = user.id
        return token
      }

      // Em requisições subsequentes, valida se a conta continua ativa e se a senha não foi revogada
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { lockedUntil: true, deletedAt: true, passwordChangedAt: true },
        })

        if (dbUser?.deletedAt || (dbUser?.lockedUntil && dbUser.lockedUntil > new Date())) {
          return {} as any
        }

        // Invalida tokens emitidos antes da última troca de senha (reset/roubo).
        if (
          dbUser?.passwordChangedAt &&
          typeof token.iat === 'number' &&
          token.iat * 1000 < dbUser.passwordChangedAt.getTime()
        ) {
          return {} as any
        }
      }

      return token
    },
    async session({ session, token }) {
      if (!token.id || !session.user) {
        return {} as any
      }

      session.user.role = token.role as string
      session.user.id = token.id as string
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
