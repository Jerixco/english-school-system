'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface PlanCardProps {
  name: string
  description: string
  price: string
  plan: 'BASIC' | 'STANDARD' | 'PREMIUM'
  features: string[]
  popular?: boolean
}

export default function PlanCard({ name, description, price, plan, features, popular }: PlanCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (response.status === 401) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent('/planos')}`
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar sessão de pagamento')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de redirecionamento não retornada pelo servidor')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      setError(error.message || 'Erro ao iniciar checkout. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative flex flex-col justify-between border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-tinted ${popular ? 'border-2 border-primary' : 'border'}`}>
      {popular && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md">
            Mais Escolhido
          </span>
        </div>
      )}
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-extrabold text-card-foreground">{name}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-card-foreground">{price}</span>
            <span className="ml-1.5 text-sm font-medium text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-2.5 mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-sm text-card-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      <CardContent className="pt-0">
        {error && (
          <p className="mb-3 rounded border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </p>
        )}
        <Button
          onClick={handleSubscribe}
          className={`w-full h-11 font-bold shadow-sm transition-all ${
            popular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Iniciando Pagamento...
            </>
          ) : (
            'Matricular-se Agora'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
