'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const PLANS = {
  basic: {
    name: 'Básico',
    description: 'Para quem está começando',
    price: 'R$ 297',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
    features: [
      '4 aulas por mês',
      'Material didático básico',
      'Suporte por e-mail',
      'Acesso ao portal do aluno',
    ],
    popular: false,
  },
  standard: {
    name: 'Padrão',
    description: 'O equilíbrio perfeito',
    price: 'R$ 497',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
    features: [
      '8 aulas por mês',
      'Material didático premium',
      'Suporte prioritário',
      'Acesso ao grupo de estudos',
      'Aulas gravadas',
    ],
    popular: true,
  },
  premium: {
    name: 'Premium',
    description: 'Para resultados acelerados',
    price: 'R$ 797',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
    features: [
      '12 aulas por mês',
      'Material exclusivo',
      'Suporte 24/7',
      'Aulas gravadas',
      'Professor dedicado',
      'Preparação para exames',
    ],
    popular: false,
  },
}

export default function PlanosPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planKey: string, priceId: string) => {
    setLoading(planKey)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com', // In production, get from auth
          name: 'User Name',
          priceId,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm hover:text-purple-600 transition">Home</a>
            <a href="/sobre" className="text-sm hover:text-purple-600 transition">Sobre</a>
            <a href="/metodologia" className="text-sm hover:text-purple-600 transition">Metodologia</a>
            <a href="/professores" className="text-sm hover:text-purple-600 transition">Professores</a>
            <a href="/contato" className="text-sm hover:text-purple-600 transition">Contato</a>
          </nav>
          <a href="/agendar">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Agendar Consulta Gratuita
            </button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">Nossos Planos</h1>
          <p className="text-xl text-gray-600">
            Escolha o plano ideal para seus objetivos e orçamento
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card key={key} className={plan.popular ? 'border-purple-600 shadow-lg' : ''}>
                <CardHeader>
                  {plan.popular && (
                    <div className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full inline-block mb-2">
                      Mais Popular
                    </div>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => plan.priceId && handleSubscribe(key, plan.priceId)}
                    disabled={loading === key || !plan.priceId}
                  >
                    {loading === key ? 'Processando...' : 'Começar Agora'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso mudar de plano?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sim! Você pode alterar seu plano a qualquer momento. As alterações entram em vigor no próximo ciclo de faturamento.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existe contrato de fidelidade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Não! Todos os nossos planos são mensais e sem contrato. Você pode cancelar a qualquer momento sem multas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funcionam as aulas?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  As aulas são 100% online via videoconferência. Você recebe um link antes de cada aula e pode participar de qualquer lugar com conexão estável.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quais são as formas de pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Aceitamos cartões de crédito, débito e PIX. O pagamento é processado automaticamente todo mês através do Stripe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ainda com dúvidas?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende uma consulta gratuita e vamos encontrar o plano ideal para você.
          </p>
          <a href="/agendar">
            <Button size="lg" className="text-lg px-8 py-6">
              Agendar Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 English School. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
