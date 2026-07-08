'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface PlanCardProps {
  name: string
  description: string
  price: string
  priceId: string
  features: string[]
  popular?: boolean
}

export default function PlanCard({ name, description, price, priceId, features, popular }: PlanCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Erro ao iniciar checkout. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative ${popular ? 'border-purple-500 shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Mais Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-600">/mês</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={handleSubscribe}
          className={`w-full ${popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Assinar Agora'}
        </Button>
      </CardContent>
    </Card>
  )
}
