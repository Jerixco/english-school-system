import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Award, Clock, Globe, Zap, Bot, LayoutDashboard, ShieldCheck } from 'lucide-react'
import LeadForm from '@/components/LeadForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sobre" className="text-sm font-medium hover:text-purple-600 transition">Sobre</Link>
            <Link href="/metodologia" className="text-sm font-medium hover:text-purple-600 transition">Metodologia</Link>
            <Link href="/professores" className="text-sm font-medium hover:text-purple-600 transition">Professores</Link>
            <Link href="/planos" className="text-sm font-medium hover:text-purple-600 transition">Planos</Link>
            <Link href="/contato" className="text-sm font-medium hover:text-purple-600 transition">Contato</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="ghost">Cadastrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
                Aulas 100% Online & Ao Vivo
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 tracking-tight">
                Aprenda Inglês com{' '}
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Professores Nativos
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Aulas ao vivo personalizadas com inteligência artificial, suporte em tempo real e metodologia acelerada para a sua fluência.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/agendar">
                  <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200">
                    Agendar Aula Gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/metodologia">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-purple-200 hover:bg-purple-50">
                    Conhecer Metodologia
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Primeira aula grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Sem contrato de fidelidade</span>
                </div>
              </div>
            </div>

            {/* Imagem do Hero Principal */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <Image
                  src="/images/hero-student.jpg"
                  alt="Aluna em aula online de inglês com professor nativo"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover rounded-xl"
                  priority
                />
              </div>

              {/* Card Flutuante — Professor Nativo (Canva Imagem 2) */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-white p-3 rounded-xl shadow-xl border border-purple-100 max-w-xs animate-fade-in">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 border-purple-500">
                  <Image
                    src="/images/hero-teacher.jpg"
                    alt="Professor Nativo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Professores Certificados</p>
                  <p className="text-xs text-gray-500">Nativos dos EUA, Reino Unido e Canadá</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Por que Escolher Nossa Escola com Mockup 3D */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a nossa escola?</h2>
            <p className="text-gray-600 text-lg">
              Combinamos ensino humano altamente qualificado com uma plataforma tecnológica completa para acelerar seu aprendizado.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-purple-100 bg-purple-50/50 p-2">
              <Image
                src="/images/features-3d.jpg"
                alt="Plataforma de aprendizado 3D e métricas do aluno"
                width={700}
                height={500}
                className="w-full h-auto rounded-xl"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-purple-100 shadow-sm hover:shadow-md transition">
                <CardHeader className="p-5">
                  <Users className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Professores Nativos</CardTitle>
                  <CardDescription className="text-xs">
                    Professores qualificados para desenvolver sua pronúncia e conversação natural.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-100 shadow-sm hover:shadow-md transition">
                <CardHeader className="p-5">
                  <Clock className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Horários Flexíveis</CardTitle>
                  <CardDescription className="text-xs">
                    Agende suas aulas com facilidade e estude nos horários mais convenientes.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-100 shadow-sm hover:shadow-md transition">
                <CardHeader className="p-5">
                  <Bot className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Tutor com IA 24/7</CardTitle>
                  <CardDescription className="text-xs">
                    Pratique gramática e diálogos a qualquer hora com o assistente Gemini Pro.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-100 shadow-sm hover:shadow-md transition">
                <CardHeader className="p-5">
                  <Award className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Resultados Rápidos</CardTitle>
                  <CardDescription className="text-xs">
                    Sinta a diferença e ganhe confiança para falar em poucas semanas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: Tecnologia SaaS, Automação & CRM Integrado */}
      <section className="py-20 px-4 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">Plataforma & Automação</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
              Um Ecossistema Integrado para o Seu Sucesso
            </h2>
            <p className="text-slate-400 text-lg">
              Notificações automáticas via WhatsApp, acompanhamento de desempenho em tempo real e agendamentos simplificados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Canva Imagem 3: Fluxo de Automação WhatsApp / E-mail / Bot */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 bg-slate-900/80 p-2">
                <Image
                  src="/images/automation-flow.jpg"
                  alt="Fluxo de automação inteligente com WhatsApp, E-mail e Bot"
                  width={600}
                  height={750}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                🤖 Automação de lembretes de aula, confirmação de agendamentos e avisos via WhatsApp.
              </p>
            </div>

            {/* Canva Imagem 4: Dashboard SaaS com Métricas */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-900/80 p-2">
                <Image
                  src="/images/dashboard-preview.jpg"
                  alt="Painel de controle com acompanhamento de progresso do aluno"
                  width={600}
                  height={750}
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                📊 Portal exclusivo com relatórios de presença, desempenho e históricos de aula.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Planos que se adaptam a você</h2>
          <p className="text-gray-600 text-center mb-12">Escolha o plano ideal para seus objetivos de fluência</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para quem está começando</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 297</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>4 aulas por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Material didático digital</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Acesso ao Tutor de IA 24/7</span>
                  </li>
                </ul>
                <Link href="/planos" className="block mt-6">
                  <Button variant="outline" className="w-full">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-600 shadow-xl relative bg-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Mais Escolhido
              </div>
              <CardHeader className="pt-8">
                <CardTitle>Padrão</CardTitle>
                <CardDescription>O equilíbrio ideal para fluência rápida</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">R$ 497</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>8 aulas por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Material didático premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Acesso ilimitado ao Tutor IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Lembretes por WhatsApp</span>
                  </li>
                </ul>
                <Link href="/planos" className="block mt-6">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Começar Agora</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Para resultados intensivos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 797</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>12 aulas por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Acompanhamento VIP 1-on-1</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Relatórios de evolução da IA</span>
                  </li>
                </ul>
                <Link href="/planos" className="block mt-6">
                  <Button variant="outline" className="w-full">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA with Lead Form */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar seu inglês?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Preencha seus dados para agendar uma conversa experimental sem compromisso e avaliar seu nível gratuitamente.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700 font-medium">Primeira aula experimental grátis</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700 font-medium">Teste de nivelamento por IA</span>
                </div>
              </div>
            </div>
            <LeadForm 
              title="Agende sua Consulta"
              description="Preencha o formulário e entraremos em contato"
              source="home"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-700">English School</h3>
              <p className="text-gray-600 text-sm">
                Transformando vidas através do ensino de inglês de alta qualidade com tecnologia de ponta.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="text-gray-600 hover:text-purple-600">Sobre</Link></li>
                <li><Link href="/metodologia" className="text-gray-600 hover:text-purple-600">Metodologia</Link></li>
                <li><Link href="/professores" className="text-gray-600 hover:text-purple-600">Professores</Link></li>
                <li><Link href="/planos" className="text-gray-600 hover:text-purple-600">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-gray-600 hover:text-purple-600">FAQ</Link></li>
                <li><Link href="/contato" className="text-gray-600 hover:text-purple-600">Contato</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-purple-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>contato@englishschool.com</li>
                <li>+55 (11) 99999-9999</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2026 English School. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
