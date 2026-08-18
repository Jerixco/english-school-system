import PlanCard from '@/components/PlanCard'
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
    <div className="min-h-screen bg-[hsl(38,20%,97%)] grain">
      {/* Header */}
      <header className="border-b border-[hsl(35,10%,85%)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="text-xl font-outfit font-bold text-[hsl(20,10%,10%)] flex items-center gap-2">
            <div className="w-8 h-8 bg-[hsl(25,85%,48%)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            English School
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Home</Link>
            <Link href="/sobre" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Sobre</Link>
            <Link href="/metodologia" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Metodologia</Link>
            <Link href="/professores" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Professores</Link>
            <Link href="/contato" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="ghost" className="text-[hsl(20,10%,15%)]">Cadastrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] text-xs font-semibold px-3 py-1.5 rounded-sm uppercase tracking-wider mb-6">
            Planos flexíveis sem fidelidade
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-black tracking-tight text-[hsl(20,10%,10%)] mb-6">
            Invista no seu inglês com o plano ideal
          </h1>
          <p className="text-lg md:text-xl text-[hsl(20,5%,45%)] max-w-2xl mx-auto leading-relaxed">
            Aulas ao vivo com professores dedicados, materiais aplicados e simulações com o Tutor Alex.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6 items-start">
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
      <section className="py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Como funciona o pagamento?', a: 'Aceitamos cartões de crédito e PIX com renovação mensal simplificada e proteção criptográfica de ponta a ponta. Você recebe comprovantes e faturas no seu portal do aluno.' },
              { q: 'Existe taxa de cancelamento ou fidelidade?', a: 'Não. Todos os nossos planos são mensais e sem contrato de fidelidade. Você pode pausar ou cancelar a qualquer momento sem burocracia.' },
              { q: 'Como acesso as aulas e gravações?', a: 'Assim que sua matrícula é confirmada, seu portal é liberado imediatamente com link direto para as salas ao vivo WebRTC, biblioteca de gravações VOD e o chat do Tutor Alex.' },
            ].map(({ q, a }) => (
              <Card key={q} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-outfit font-semibold text-[hsl(20,10%,10%)]">{q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(20,5%,45%)] text-sm leading-relaxed">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(35,10%,85%)] py-10 px-4 bg-white">
        <div className="container mx-auto max-w-7xl text-sm text-[hsl(20,5%,45%)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} English School. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-[hsl(25,85%,48%)] transition-colors">Início</Link>
            <Link href="/privacidade" className="hover:text-[hsl(25,85%,48%)] underline underline-offset-4 transition-colors">Política de Privacidade (LGPD)</Link>
            <Link href="/contato" className="hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
