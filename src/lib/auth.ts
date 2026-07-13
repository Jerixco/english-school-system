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

        if (!user || !user.password) {
          throw new Error('Credenciais inválidas')
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
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
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
