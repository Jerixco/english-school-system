import PlanCard from '@/components/PlanCard'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

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
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-purple-600 transition">Home</Link>
            <Link href="/sobre" className="text-sm hover:text-purple-600 transition">Sobre</Link>
            <Link href="/metodologia" className="text-sm hover:text-purple-600 transition">Metodologia</Link>
            <Link href="/professores" className="text-sm hover:text-purple-600 transition">Professores</Link>
            <Link href="/contato" className="text-sm hover:text-purple-600 transition">Contato</Link>
          </nav>
          <Link href="/agendar">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Agendar Consulta Gratuita
            </button>
          </Link>
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
              plan.priceId ? (
                <PlanCard
                  key={key}
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  priceId={plan.priceId}
                  features={plan.features}
                  popular={plan.popular}
                />
              ) : null
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
          <Link href="/agendar">
            <Button size="lg" className="text-lg px-8 py-6">
              Agendar Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
