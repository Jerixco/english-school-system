import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, MessageSquare, Target, TrendingUp, Clock, Users } from 'lucide-react'

export default function MetodologiaPage() {
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
            <a href="/professores" className="text-sm hover:text-purple-600 transition">Professores</a>
            <a href="/planos" className="text-sm hover:text-purple-600 transition">Planos</a>
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
          <h1 className="text-5xl font-bold mb-6">Nossa Metodologia</h1>
          <p className="text-xl text-gray-600">
            Um método comprovado para garantir fluência em inglês de forma eficiente e personalizada
          </p>
        </div>
      </section>

      {/* Method Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Como Funciona</h2>
              <p className="text-gray-600 mb-4">
                Nossa metodologia combina as melhores técnicas de ensino de idiomas com tecnologia moderna e professores nativos experientes.
              </p>
              <p className="text-gray-600 mb-4">
                Cada aula é personalizada de acordo com seus objetivos, nível atual e estilo de aprendizado. Não seguimos um currículo rígido - adaptamos o conteúdo para você.
              </p>
              <p className="text-gray-600">
                O foco é na comunicação real desde o primeiro dia, com ênfase na conversação, pronúncia e compreensão auditiva.
              </p>
            </div>
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Pilares do Método</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Comunicação Real</h4>
                    <p className="text-sm opacity-90">Foco em conversação desde o primeiro dia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Personalização</h4>
                    <p className="text-sm opacity-90">Aulas adaptadas ao seu perfil e objetivos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Objetivos Claros</h4>
                    <p className="text-sm opacity-90">Metas definidas e acompanhamento de progresso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Resultados Medíveis</h4>
                    <p className="text-sm opacity-90">Avaliações regulares para garantir evolução</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">O que nos torna diferentes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Horários Flexíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Aulas nos horários que funcionam para você, inclusive fins de semana e horários noturnos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Professores Nativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Aprenda com professores nativos certificados com anos de experiência em ensino.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Material Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesso a materiais didáticos exclusivos, exercícios e recursos complementares.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nosso Processo</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Avaliação Inicial</h3>
                <p className="text-gray-600">
                  Avaliamos seu nível atual e definimos seus objetivos pessoais e profissionais.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Plano Personalizado</h3>
                <p className="text-gray-600">
                  Criamos um plano de estudos adaptado ao seu ritmo, disponibilidade e objetivos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Aulas Dinâmicas</h3>
                <p className="text-gray-600">
                  Aulas interativas focadas em conversação, com feedback constante e correções.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Acompanhamento</h3>
                <p className="text-gray-600">
                  Monitoramento contínuo do progresso com ajustes no plano conforme necessário.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Resultados</h3>
                <p className="text-gray-600">
                  Alcance fluência e confiança para usar o inglês em qualquer situação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende sua consulta gratuita e descubra como nossa metodologia pode ajudar você.
          </p>
          <a href="/agendar">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-md hover:bg-purple-700 transition text-lg">
              Agendar Consulta Gratuita
            </button>
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
