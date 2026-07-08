import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import ScheduleForm from '@/components/ScheduleForm'
import Link from 'next/link'

export default function AgendarPage() {
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
            <Link href="/planos" className="text-sm hover:text-purple-600 transition">Planos</Link>
          </nav>
          <Link href="/contato">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Contato
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">Agende sua Consulta Gratuita</h1>
          <p className="text-xl text-gray-600">
            Conheça nossa metodologia e descubra como podemos ajudar você a alcançar fluência em inglês
          </p>
        </div>
      </section>

      {/* Schedule Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScheduleForm />
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">O que esperar da consulta?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-lg">30 Minutos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uma conversa rápida e eficiente para entender suas necessidades e objetivos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-lg">Avaliação Gratuita</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Avaliamos seu nível atual de inglês e identificamos áreas de melhoria.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-lg">Plano Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receba recomendações personalizadas baseadas em seus objetivos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por que agendar uma consulta?</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Sem compromisso</h3>
                    <p className="text-gray-600">A consulta é 100% gratuita e sem obrigação de contratar.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Conheça os professores</h3>
                    <p className="text-gray-600">Interaja com nossos professores nativos e sinta o estilo de ensino.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Tire suas dúvidas</h3>
                    <p className="text-gray-600">Esclareça todas as dúvidas sobre metodologia, planos e valores.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Comece certo</h3>
                    <p className="text-gray-600">Inicie sua jornada de aprendizado com o plano ideal para você.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
