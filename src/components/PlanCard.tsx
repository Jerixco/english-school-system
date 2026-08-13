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
    <Card className={`relative flex flex-col justify-between transition-all hover:shadow-xl ${popular ? 'border-2 border-indigo-600 shadow-indigo-100 shadow-lg' : 'border border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            Mais Escolhido
          </span>
        </div>
      )}
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-extrabold text-gray-900">{name}</CardTitle>
          <CardDescription className="text-gray-500">{description}</CardDescription>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-gray-900">{price}</span>
            <span className="text-gray-500 text-sm font-medium ml-1.5">/mês</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      <CardContent className="pt-0">
        {error && (
          <p className="text-xs text-red-600 mb-3 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}
        <Button
          onClick={handleSubscribe}
          className={`w-full h-11 font-bold shadow-sm transition-all ${
            popular
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
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
