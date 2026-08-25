import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Check, Users, Award, Clock, Globe, Bot, LayoutDashboard, ShieldCheck, Sparkles, Star } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ParallaxHero from '@/components/landing/ParallaxHero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[hsl(38,20%,97%)] grain">
      {/* Header */}
      <header className="border-b border-[hsl(35,10%,85%)] bg-white/80 backdrop-blur-md z-50 sticky top-0">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="text-xl font-outfit font-bold text-[hsl(20,10%,10%)] flex items-center gap-2">
            <div className="w-8 h-8 bg-[hsl(25,85%,48%)] rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            English School
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/sobre" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Sobre</Link>
            <Link href="/metodologia" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Metodologia</Link>
            <Link href="/professores" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Professores</Link>
            <Link href="/planos" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link>
            <Link href="/contato" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="ghost" className="text-[hsl(20,10%,15%)]">Cadastrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-sm">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Interactive Parallax Hero Section */}
      <ParallaxHero />

      {/* Features — asymmetric, not 3 equal columns */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-4">
              Por que escolher a nossa escola
            </h2>
            <p className="text-[hsl(20,5%,45%)] text-lg leading-relaxed">
              Combinação de ensino humano qualificado com plataforma tecnológica para acelerar seu aprendizado.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-[hsl(35,10%,85%)]/50 bg-[hsl(35,10%,90%)] p-2">
              <Image
                src="/images/features-3d.jpg"
                alt="Plataforma de aprendizado 3D e métricas do aluno"
                width={700}
                height={500}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div className="space-y-4">
              {[
                { icon: Users, title: 'Professores nativos', desc: 'Qualificados para desenvolver sua pronúncia e conversação natural.' },
                { icon: Clock, title: 'Horários flexíveis', desc: 'Agende suas aulas com facilidade e estude nos horários mais convenientes.' },
                { icon: Bot, title: 'Tutor com IA 24/7', desc: 'Pratique gramática e diálogos a qualquer hora com o assistente Gemini Pro.' },
                { icon: Award, title: 'Resultados rápidos', desc: 'Sinta a diferença e ganhe confiança para falar em poucas semanas.' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[hsl(35,10%,94%)] transition-colors duration-200">
                  <div className="w-11 h-11 rounded-lg bg-[hsl(25,85%,48%)]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[hsl(20,10%,10%)] mb-1">{title}</h3>
                    <p className="text-sm text-[hsl(20,5%,45%)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform section — dark navy */}
      <section className="py-20 px-4 md:px-6 bg-[hsl(220,25%,12%)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,25%,12%)] via-[hsl(220,25%,12%)] to-[hsl(25,85%,48%)]/5 pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative">
          <div className="max-w-2xl mb-14">
            <span className="text-[hsl(25,85%,48%)] font-semibold text-xs uppercase tracking-widest">Plataforma & Automação</span>
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mt-3 mb-4 text-white">
              Um ecossistema integrado para seu sucesso
            </h2>
            <p className="text-[hsl(20,5%,65%)] text-lg leading-relaxed">
              Notificações automáticas via WhatsApp, acompanhamento de desempenho em tempo real e agendamentos simplificados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2">
                <Image
                  src="/images/automation-flow.jpg"
                  alt="Fluxo de automação inteligente com WhatsApp, E-mail e Bot"
                  width={600}
                  height={750}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <p className="text-xs text-[hsl(20,5%,55%)] mt-3 text-center">
                Automação de lembretes de aula, confirmação de agendamentos e avisos via WhatsApp.
              </p>
            </div>

            <div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2">
                <Image
                  src="/images/dashboard-preview.jpg"
                  alt="Painel de controle com acompanhamento de progresso do aluno"
                  width={600}
                  height={750}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <p className="text-xs text-[hsl(20,5%,55%)] mt-3 text-center">
                Portal exclusivo com relatórios de presença, desempenho e históricos de aula.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — asymmetric, highlighted standard */}
      <section className="py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-4">
              Planos que se adaptam a você
            </h2>
            <p className="text-[hsl(20,5%,45%)] text-lg">
              Escolha o plano ideal para seus objetivos de fluência
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Basic */}
            <Card className="bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="mb-6">
                  <h3 className="font-outfit font-bold text-xl text-[hsl(20,10%,10%)]">Básico</h3>
                  <p className="text-sm text-[hsl(20,5%,45%)] mt-1">Para quem está começando</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-outfit font-black text-[hsl(20,10%,10%)]">R$ 297</span>
                    <span className="text-[hsl(20,5%,45%)] ml-2">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['4 aulas por mês', 'Material didático digital', 'Acesso ao Tutor de IA 24/7'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[hsl(20,5%,45%)]">
                      <Check className="h-4 w-4 text-[hsl(25,85%,48%)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/planos" className="block">
                  <Button variant="outline" className="w-full border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)] hover:bg-[hsl(25,85%,48%)]/5">
                    Ver detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Standard — highlighted */}
            <Card className="bg-white border-[hsl(25,85%,48%)]/30 shadow-tinted md:-mt-3 md:mb-3">
              <div className="px-6 pt-4">
                <div className="inline-flex items-center gap-1.5 bg-[hsl(25,85%,48%)] text-white text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wide">
                  Mais escolhido
                </div>
              </div>
              <CardContent className="pt-6 pb-6">
                <div className="mb-6">
                  <h3 className="font-outfit font-bold text-xl text-[hsl(20,10%,10%)]">Padrão</h3>
                  <p className="text-sm text-[hsl(20,5%,45%)] mt-1">O equilíbrio ideal para fluência rápida</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-outfit font-black text-[hsl(25,85%,48%)]">R$ 497</span>
                    <span className="text-[hsl(20,5%,45%)] ml-2">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['8 aulas por mês', 'Material didático premium', 'Acesso ilimitado ao Tutor IA', 'Lembretes por WhatsApp'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[hsl(20,5%,45%)]">
                      <Check className="h-4 w-4 text-[hsl(25,85%,48%)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/planos" className="block">
                  <Button className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
                    Começar agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="bg-white">
              <CardContent className="pt-6 pb-6">
                <div className="mb-6">
                  <h3 className="font-outfit font-bold text-xl text-[hsl(20,10%,10%)]">Premium</h3>
                  <p className="text-sm text-[hsl(20,5%,45%)] mt-1">Para resultados intensivos</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-outfit font-black text-[hsl(20,10%,10%)]">R$ 797</span>
                    <span className="text-[hsl(20,5%,45%)] ml-2">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['12 aulas por mês', 'Acompanhamento VIP 1-on-1', 'Relatórios de evolução da IA'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[hsl(20,5%,45%)]">
                      <Check className="h-4 w-4 text-[hsl(25,85%,48%)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/planos" className="block">
                  <Button variant="outline" className="w-full border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)] hover:bg-[hsl(25,85%,48%)]/5">
                    Ver detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA with Lead Form */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6 leading-tight">
                Pronto para transformar seu inglês?
              </h2>
              <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
                Preencha seus dados para agendar uma conversa experimental sem compromisso e avaliar seu nível gratuitamente.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                  <span className="text-[hsl(20,10%,15%)] font-medium">Primeira aula experimental grátis</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                  <span className="text-[hsl(20,10%,15%)] font-medium">Teste de nivelamento por IA</span>
                </div>
              </div>
            </div>
            <LeadForm
              title="Agende sua consulta"
              description="Preencha o formulário e entraremos em contato"
              source="home"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(35,10%,85%)] py-12 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-outfit font-bold text-lg text-[hsl(20,10%,10%)] mb-3 flex items-center gap-2">
                <div className="w-7 h-7 bg-[hsl(25,85%,48%)] rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">E</span>
                </div>
                English School
              </div>
              <p className="text-[hsl(20,5%,45%)] text-sm leading-relaxed">
                Ensino de inglês online com professores nativos e tecnologia de ponta.
              </p>
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[hsl(20,10%,10%)] mb-4 uppercase tracking-wide">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Sobre</Link></li>
                <li><Link href="/metodologia" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Metodologia</Link></li>
                <li><Link href="/professores" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Professores</Link></li>
                <li><Link href="/planos" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[hsl(20,10%,10%)] mb-4 uppercase tracking-wide">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">FAQ</Link></li>
                <li><Link href="/contato" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Contato</Link></li>
                <li><Link href="/blog" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Blog</Link></li>
                <li><Link href="/privacidade" className="text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Privacidade & LGPD</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[hsl(20,10%,10%)] mb-4 uppercase tracking-wide">Contato</h4>
              <ul className="space-y-2 text-sm text-[hsl(20,5%,45%)]">
                <li>contato@englishschool.com</li>
                <li>+55 (11) 99999-9999</li>
                <li>Segunda a Sexta, 9h às 18h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[hsl(35,10%,85%)] mt-8 pt-8 text-sm text-[hsl(20,5%,45%)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} English School. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacidade" className="hover:text-[hsl(25,85%,48%)] underline underline-offset-4 transition-colors">Política de Privacidade (LGPD)</Link>
              <Link href="/contato" className="hover:text-[hsl(25,85%,48%)] transition-colors">Fale conosco</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
