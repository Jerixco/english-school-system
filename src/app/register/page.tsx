'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'A senha deve ter pelo menos 8 caracteres'
    if (!/[A-Z]/.test(pwd)) return 'A senha deve conter pelo menos uma letra maiúscula'
    if (!/[a-z]/.test(pwd)) return 'A senha deve conter pelo menos uma letra minúscula'
    if (!/[0-9]/.test(pwd)) return 'A senha deve conter pelo menos um número'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      let data
      try {
        data = await response.json()
      } catch {
        setError('Erro de comunicação com o servidor. Verifique se o banco de dados está ativo.')
        return
      }

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
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
          <CardTitle className="text-2xl font-outfit font-bold text-[hsl(20,10%,10%)]">Criar conta</CardTitle>
          <CardDescription className="text-[hsl(20,5%,45%)]">Cadastre-se para acessar o portal do aluno</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[hsl(20,10%,10%)] font-medium">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(20,10%,10%)] font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(20,10%,10%)] font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-white"
              />
              <p className="text-xs text-[hsl(20,5%,45%)]">
                Mínimo 8 caracteres, com maiúscula, minúscula e número
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[hsl(20,10%,10%)] font-medium">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="bg-white"
              />
            </div>
            <Button type="submit" className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-[hsl(20,5%,45%)]">Já tem uma conta? </span>
              <Link href="/login" className="text-[hsl(25,85%,48%)] hover:underline">
                Faça login
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
