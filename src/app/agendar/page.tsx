import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import ScheduleForm from '@/components/ScheduleForm'
import Link from 'next/link'

export default function AgendarPage() {
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
            <Link href="/metodologia" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Metodologia</Link>
            <Link href="/professores" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Professores</Link>
            <Link href="/planos" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link>
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
          <h1 className="text-4xl md:text-5xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Agende sua consulta gratuita
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Conheça nossa metodologia e descubra como podemos ajudar você a alcançar fluência em inglês
          </p>
        </div>
      </section>

      {/* Schedule Form */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <ScheduleForm />
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            O que esperar da consulta?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: '30 minutos', desc: 'Uma conversa rápida e eficiente para entender suas necessidades e objetivos.' },
              { icon: CheckCircle, title: 'Avaliação gratuita', desc: 'Avaliamos seu nível atual de inglês e identificamos áreas de melhoria.' },
              { icon: Calendar, title: 'Plano personalizado', desc: 'Receba recomendações personalizadas baseadas em seus objetivos.' },
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

      {/* Benefits */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            Por que agendar uma consulta
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Sem compromisso', desc: 'A consulta é 100% gratuita e sem obrigação de contratar.' },
              { title: 'Conheça os professores', desc: 'Interaja com nossos professores nativos e sinta o estilo de ensino.' },
              { title: 'Tire suas dúvidas', desc: 'Esclareça todas as dúvidas sobre metodologia, planos e valores.' },
              { title: 'Comece certo', desc: 'Inicie sua jornada de aprendizado com o plano ideal para você.' },
            ].map(({ title, desc }) => (
              <Card key={title} className="bg-[hsl(35,10%,94%)] border-none">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(145,60%,45%)]/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-[hsl(145,60%,45%)]" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-semibold text-[hsl(20,10%,10%)] mb-1">{title}</h3>
                      <p className="text-sm text-[hsl(20,5%,45%)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
