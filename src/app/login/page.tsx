'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDashboardUrl } from '@/lib/roles'

type LoginStep = 'credentials' | 'twoFactor'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<LoginStep>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [userRole, setUserRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Conta criada com sucesso! Faça login para continuar.')
    }
  }, [searchParams])

  const completeLogin = async (token?: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      twoFactorToken: token || undefined,
      redirect: false,
    })

    if (result?.error) {
      if (result.error === 'TWO_FACTOR_REQUIRED') {
        setStep('twoFactor')
        setError('')
        return
      }
      setError(
        result.error === 'CredentialsSignin'
          ? 'Email ou senha inválidos'
          : result.error
      )
      return
    }

    if (result?.ok) {
      router.push(getDashboardUrl(userRole))
      router.refresh()
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Email ou senha inválidos')
        return
      }

      setUserRole(data.user.role)

      if (data.twoFactorRequired) {
        setStep('twoFactor')
        return
      }

      await completeLogin()
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await completeLogin(twoFactorToken)
    } catch {
      setError('Erro ao verificar código. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            English School
          </div>
          <CardTitle className="text-2xl">
            {step === 'credentials' ? 'Login' : 'Verificação em Duas Etapas'}
          </CardTitle>
          <CardDescription>
            {step === 'credentials'
              ? 'Entre com suas credenciais para acessar o sistema'
              : 'Digite o código de 6 dígitos do seu aplicativo autenticador'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4">
              {success}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="twoFactorToken">Código de Verificação</Label>
                <Input
                  id="twoFactorToken"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                  required
                  autoComplete="one-time-code"
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || twoFactorToken.length !== 6}>
                {loading ? 'Verificando...' : 'Confirmar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('credentials')
                  setTwoFactorToken('')
                  setError('')
                }}
              >
                Voltar
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm space-y-2">
            <Link href="/register" className="text-purple-600 hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
            <div>
              <Link href="/" className="text-purple-600 hover:underline">
                Voltar para o site
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
