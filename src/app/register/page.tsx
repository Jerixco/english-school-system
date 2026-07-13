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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            English School
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para acessar o portal do aluno</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Mínimo 8 caracteres, com maiúscula, minúscula e número
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link href="/login" className="text-purple-600 hover:underline">
              Faça login
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link href="/" className="text-purple-600 hover:underline">
              Voltar para o site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
