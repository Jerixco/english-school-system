import PlanCard from '@/components/PlanCard'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const PLANS = {
  basic: {
    name: 'Básico',
    description: 'Para quem está começando a jornada no inglês',
    price: 'R$ 297',
    features: [
      '4 aulas ao vivo por mês',
      'Material didático digital',
      'Suporte pedagógico por e-mail',
      'Acesso ao portal do aluno e gravação VOD',
    ],
    popular: false,
  },
  standard: {
    name: 'Padrão',
    description: 'O equilíbrio perfeito para evolução acelerada',
    price: 'R$ 497',
    features: [
      '8 aulas ao vivo por mês',
      'Material didático premium e exercícios práticos',
      'Suporte prioritário via WhatsApp',
      'Acesso total à biblioteca de aulas gravadas',
      'Prática com o Tutor IA Alex',
    ],
    popular: true,
  },
  premium: {
    name: 'Premium',
    description: 'Para resultados executivos e imersão total',
    price: 'R$ 797',
    features: [
      '12 aulas individuais e em grupo por mês',
      'Material executivo para entrevistas e reuniões',
      'Suporte dedicado 24/7',
      'Aulas gravadas com retenção estendida',
      'Preparação para exames internacionais (IELTS/TOEFL)',
      'Acesso ilimitado ao Tutor IA Alex',
    ],
    popular: false,
  },
}

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            English School
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition">Home</Link>
            <Link href="/sobre" className="text-sm text-gray-600 hover:text-indigo-600 transition">Sobre</Link>
            <Link href="/metodologia" className="text-sm text-gray-600 hover:text-indigo-600 transition">Metodologia</Link>
            <Link href="/professores" className="text-sm text-gray-600 hover:text-indigo-600 transition">Professores</Link>
            <Link href="/contato" className="text-sm text-gray-600 hover:text-indigo-600 transition">Contato</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="ghost">Cadastrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Planos Flexíveis Sem Fidelidade
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
            Invista no seu inglês com o plano ideal
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Aulas ao vivo com professores dedicados, materiais aplicados e simulações com o Tutor Alex.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {Object.entries(PLANS).map(([key, plan]) => (
              <PlanCard
                key={key}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                plan={key.toUpperCase() as 'BASIC' | 'STANDARD' | 'PREMIUM'}
                features={plan.features}
                popular={plan.popular}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50/80 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Como funciona o pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Aceitamos cartões de crédito e PIX com renovação mensal simplificada e proteção criptográfica de ponta a ponta. Você recebe comprovantes e faturas no seu portal do aluno.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Existe taxa de cancelamento ou fidelidade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Não! Todos os nossos planos são mensais e sem contrato de fidelidade. Você pode pausar ou cancelar a qualquer momento sem burocracia.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Como acesso as aulas e gravações?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Assim que sua matrícula é confirmada, seu portal é liberado imediatamente com link direto para as salas ao vivo WebRTC, biblioteca de gravações VOD e o chat do Tutor Alex.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-white">
        <div className="container mx-auto max-w-6xl text-center text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} English School. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-indigo-600">Início</Link>
            <Link href="/privacidade" className="hover:text-indigo-600 underline">Política de Privacidade (LGPD)</Link>
            <Link href="/contato" className="hover:text-indigo-600">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
