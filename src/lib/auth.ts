import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyTwoFactorToken } from '@/lib/two-factor'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorToken: { label: '2FA Token', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            student: true,
            teacher: true,
          }
        })

        if (!user || !user.password) {
          throw new Error('Credenciais inválidas')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas')
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorToken) {
            throw new Error('TWO_FACTOR_REQUIRED')
          }

          if (!user.twoFactorSecret) {
            throw new Error('Erro na configuração 2FA')
          }

          const isValidToken = verifyTwoFactorToken(
            credentials.twoFactorToken as string,
            user.twoFactorSecret
          )

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
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
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
}
