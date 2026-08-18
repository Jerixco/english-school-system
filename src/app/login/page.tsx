'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Conta criada com sucesso! Faça login para continuar.')
    }
    const errorParam = searchParams.get('error')
    if (errorParam === 'Configuration') {
      setError(
        'Erro de configuração do servidor de autenticação. Certifique-se de que NEXTAUTH_SECRET esteja cadastrada na Vercel.'
      )
    } else if (errorParam === 'CredentialsSignin') {
      setError('Email ou senha inválidos.')
    } else if (errorParam) {
      setError(`Erro na autenticação: ${errorParam}`)
    }
    router.prefetch('/admin')
    router.prefetch('/professor')
    router.prefetch('/aluno')
  }, [searchParams, router])

  const executeLogin = async (token?: string) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        twoFactorToken: token || undefined,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'TWO_FACTOR_REQUIRED') {
          setStep('twoFactor')
          setLoading(false)
          return
        }

        setError(
          result.error === 'CredentialsSignin'
            ? 'Email ou senha inválidos'
            : result.error
        )
        setLoading(false)
        return
      }

      if (result?.ok) {
        const session = await getSession()
        const targetUrl = getDashboardUrl(session?.user?.role || '')
        router.push(targetUrl)
        router.refresh()
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
      setLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeLogin()
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeLogin(twoFactorToken)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(38,20%,97%)]">
      <Card className="w-full max-w-md shadow-tinted">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[hsl(25,85%,48%)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-outfit font-bold text-[hsl(20,10%,10%)]">English School</span>
          </Link>
          <CardTitle className="text-2xl font-outfit font-bold text-[hsl(20,10%,10%)]">
            {step === 'credentials' ? 'Login' : 'Verificação em duas etapas'}
          </CardTitle>
          <CardDescription className="text-[hsl(20,5%,45%)]">
            {step === 'credentials'
              ? 'Entre com suas credenciais para acessar o sistema'
              : 'Digite o código de 6 dígitos do seu aplicativo autenticador'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="bg-[hsl(145,60%,45%)]/10 border border-[hsl(145,60%,45%)]/20 text-[hsl(145,60%,45%)] px-4 py-3 rounded-md text-sm mb-4">
              {success}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {error && (
                <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(20,10%,10%)] font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(20,10%,10%)] font-medium">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              {error && (
                <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="twoFactorToken" className="text-[hsl(20,10%,10%)] font-medium">Código de verificação</Label>
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
                  className="text-center text-2xl tracking-widest bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold" disabled={loading || twoFactorToken.length !== 6}>
                {loading ? 'Verificando...' : 'Confirmar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]"
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

          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/forgot-password" className="text-[hsl(25,85%,48%)] hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <div>
              <Link href="/register" className="text-[hsl(25,85%,48%)] hover:underline">
                Não tem uma conta? Cadastre-se
              </Link>
            </div>
            <div>
              <Link href="/" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[hsl(38,20%,97%)]">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
