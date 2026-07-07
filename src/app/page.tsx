import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, Award, Clock, Globe, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/sobre" className="text-sm hover:text-purple-600 transition">Sobre</Link>
            <Link href="/metodologia" className="text-sm hover:text-purple-600 transition">Metodologia</Link>
            <Link href="/professores" className="text-sm hover:text-purple-600 transition">Professores</Link>
            <Link href="/planos" className="text-sm hover:text-purple-600 transition">Planos</Link>
            <Link href="/contato" className="text-sm hover:text-purple-600 transition">Contato</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/agendar">
              <Button>Agendar Consulta Gratuita</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Aprenda Inglês com{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Professores Nativos
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Aulas online personalizadas com metodologia comprovada. Alcance fluência em menos tempo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/agendar">
                  <Button size="lg" className="w-full sm:w-auto">
                    Agendar Consulta Gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/metodologia">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Conhecer Metodologia
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Primeira aula grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Sem contrato</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center text-white">
                <div className="text-center">
                  <Users className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-2xl font-semibold">+500 Alunos Satisfeitos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossa escola?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Professores Nativos</CardTitle>
                <CardDescription>
                  Aprenda com professores nativos certificados com anos de experiência.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Horários Flexíveis</CardTitle>
                <CardDescription>
                  Aulas nos horários que funcionam para você, inclusive fins de semana.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Metodologia Comprovada</CardTitle>
                <CardDescription>
                  Método desenvolvido para garantir resultados rápidos e duradouros.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Aulas 100% Online</CardTitle>
                <CardDescription>
                  Participe das aulas de qualquer lugar com conexão estável.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Resultados Rápidos</CardTitle>
                <CardDescription>
                  Veja progresso significativo nas primeiras semanas de aula.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Material Exclusivo</CardTitle>
                <CardDescription>
                  Acesso a materiais didáticos premium e recursos adicionais.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Planos que se adaptam a você</h2>
          <p className="text-gray-600 text-center mb-12">Escolha o plano ideal para seus objetivos</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
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
                    <span>Material didático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Suporte por e-mail</span>
                  </li>
                </ul>
                <Link href="/planos" className="block mt-6">
                  <Button variant="outline" className="w-full">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-purple-600 shadow-lg">
              <CardHeader>
                <div className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full inline-block mb-2">
                  Mais Popular
                </div>
                <CardTitle>Padrão</CardTitle>
                <CardDescription>O equilíbrio perfeito</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 497</span>
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
                    <span>Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Acesso ao grupo de estudos</span>
                  </li>
                </ul>
                <Link href="/planos" className="block mt-6">
                  <Button className="w-full">Começar Agora</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Para resultados acelerados</CardDescription>
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
                    <span>Material exclusivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Suporte 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Aulas gravadas</span>
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

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar sua jornada?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende sua consulta gratuita e descubra como podemos ajudar você a alcançar fluência em inglês.
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
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">English School</h3>
              <p className="text-gray-600 text-sm">
                Transformando vidas através do ensino de inglês de qualidade.
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
            <p>© 2024 English School. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
