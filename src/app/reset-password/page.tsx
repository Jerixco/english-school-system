'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao redefinir senha')
        return
      }

      setMessage('Senha redefinida com sucesso. Redirecionando para o login...')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(38,20%,97%)]">
        <Card className="w-full max-w-md shadow-tinted">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-outfit font-bold text-[hsl(0,70%,50%)]">Link inválido</CardTitle>
            <CardDescription className="text-[hsl(20,5%,45%)]">O link de recuperação é inválido ou está incompleto.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/forgot-password">
              <Button className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
                Solicitar novo link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
            Redefinir senha
          </CardTitle>
          <CardDescription className="text-[hsl(20,5%,45%)]">
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="bg-[hsl(145,60%,45%)]/10 border border-[hsl(145,60%,45%)]/20 text-[hsl(145,60%,45%)] px-4 py-3 rounded-md text-sm mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(20,10%,10%)] font-medium">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[hsl(20,10%,10%)] font-medium">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-white"
              />
            </div>
            <Button type="submit" className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors text-sm">
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[hsl(38,20%,97%)]">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
