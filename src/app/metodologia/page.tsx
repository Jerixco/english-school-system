import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, MessageSquare, Target, TrendingUp, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-[hsl(38,20%,97%)] grain">
      {/* Header */}
      <header className="border-b border-[hsl(35,10%,85%)]">
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
            <Link href="/professores" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Professores</Link>
            <Link href="/planos" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link>
            <Link href="/contato" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link>
          </nav>
          <Link href="/agendar">
            <Button className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
              Agendar consulta
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Nossa metodologia
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Um método comprovado para garantir fluência em inglês de forma eficiente e personalizada
          </p>
        </div>
      </section>

      {/* Method Overview */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">Como funciona</h2>
              <p className="text-[hsl(20,5%,45%)] mb-4 leading-relaxed">
                Nossa metodologia combina as melhores técnicas de ensino de idiomas com tecnologia moderna e professores nativos experientes.
              </p>
              <p className="text-[hsl(20,5%,45%)] mb-4 leading-relaxed">
                Cada aula é personalizada de acordo com seus objetivos, nível atual e estilo de aprendizado. Não seguimos um currículo rígido — adaptamos o conteúdo para você.
              </p>
              <p className="text-[hsl(20,5%,45%)] leading-relaxed">
                O foco é na comunicação real desde o primeiro dia, com ênfase na conversação, pronúncia e compreensão auditiva.
              </p>
            </div>
            <div className="bg-[hsl(220,25%,12%)] text-white rounded-xl p-8">
              <h3 className="font-outfit font-bold text-xl mb-6">Pilares do método</h3>
              <div className="space-y-5">
                {[
                  { icon: BookOpen, title: 'Comunicação real', desc: 'Foco em conversação desde o primeiro dia' },
                  { icon: MessageSquare, title: 'Personalização', desc: 'Aulas adaptadas ao seu perfil e objetivos' },
                  { icon: Target, title: 'Objetivos claros', desc: 'Metas definidas e acompanhamento de progresso' },
                  { icon: TrendingUp, title: 'Resultados mensuráveis', desc: 'Avaliações regulares para garantir evolução' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(25,85%,48%)]/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{title}</h4>
                      <p className="text-sm text-[hsl(20,5%,65%)]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            O que nos torna diferentes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Horários flexíveis', desc: 'Aulas nos horários que funcionam para você, inclusive fins de semana e horários noturnos.' },
              { icon: Users, title: 'Professores nativos', desc: 'Aprenda com professores nativos certificados com anos de experiência em ensino.' },
              { icon: BookOpen, title: 'Material premium', desc: 'Acesso a materiais didáticos exclusivos, exercícios e recursos complementares.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-card">
                <div className="w-12 h-12 rounded-lg bg-[hsl(25,85%,48%)]/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-[hsl(25,85%,48%)]" />
                </div>
                <h3 className="font-outfit font-bold text-[hsl(20,10%,10%)] mb-2">{title}</h3>
                <p className="text-sm text-[hsl(20,5%,45%)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            Nosso processo
          </h2>
          <div className="space-y-6">
            {[
              { num: '01', title: 'Avaliação inicial', desc: 'Avaliamos seu nível atual e definimos seus objetivos pessoais e profissionais.' },
              { num: '02', title: 'Plano personalizado', desc: 'Criamos um plano de estudos adaptado ao seu ritmo, disponibilidade e objetivos.' },
              { num: '03', title: 'Aulas dinâmicas', desc: 'Aulas interativas focadas em conversação, com feedback constante e correções.' },
              { num: '04', title: 'Acompanhamento', desc: 'Monitoramento contínuo do progresso com ajustes no plano conforme necessário.' },
              { num: '05', title: 'Resultados', desc: 'Alcance fluência e confiança para usar o inglês em qualquer situação.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[hsl(25,85%,48%)] text-white rounded-lg flex items-center justify-center font-outfit font-bold text-sm">
                  {num}
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-[hsl(20,10%,10%)] text-lg mb-1">{title}</h3>
                  <p className="text-[hsl(20,5%,45%)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Agende sua consulta gratuita e descubra como nossa metodologia pode ajudar você.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-tinted text-lg px-8">
              Agendar consulta gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(35,10%,85%)] py-12 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-sm text-[hsl(20,5%,45%)]">
            <p>© {new Date().getFullYear()} English School. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
