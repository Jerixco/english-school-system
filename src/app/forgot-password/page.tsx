'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar solicitação')
        return
      }

      setMessage(data.message || 'Se o email estiver cadastrado, você receberá um link de recuperação.')
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
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
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-[hsl(20,5%,45%)]">
            Digite seu email para receber um link de redefinição
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
            <Button type="submit" className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <Link href="/login" className="text-[hsl(25,85%,48%)] hover:underline block">
              Lembrou a senha? Faça login
            </Link>
            <Link href="/" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">
              Voltar para o site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
