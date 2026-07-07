import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Globe, GraduationCap, MessageSquare } from 'lucide-react'

export default function ProfessoresPage() {
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
            <a href="/metodologia" className="text-sm hover:text-purple-600 transition">Metodologia</a>
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
          <h1 className="text-5xl font-bold mb-6">Nossos Professores</h1>
          <p className="text-xl text-gray-600">
            Conheça os professores nativos que vão transformar seu inglês
          </p>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:Grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                  JS
                </div>
                <CardTitle className="text-center">John Smith</CardTitle>
                <p className="text-center text-gray-600">Professor de Inglês</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Nativo dos Estados Unidos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span>Mestre em Ensino de Inglês como Segunda Língua</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>10+ anos de experiência</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span>Especialista em conversação e pronúncia</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    John é apaixonado por ajudar alunos a alcançar fluência natural. Seu método foca em conversação real e correções construtivas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                  EW
                </div>
                <CardTitle className="text-center">Emily Watson</CardTitle>
                <p className="text-center text-gray-600">Professora de Inglês</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Nativa do Reino Unido</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span>Bacharel em Literatura Inglesa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>8+ anos de experiência</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span>Especialista em gramática e escrita</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    Emily tem um abordagem paciente e detalhista, ideal para alunos que querem fortalecer a base gramatical e escrita.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Our Teachers */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por que nossos professores?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Certificados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Todos os professores são certificados e têm formação acadêmica em ensino de idiomas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Experiência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Anos de experiência ensinando alunos de diferentes níveis e nacionalidades.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Comunicação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Habilidade excepcional de explicar conceitos complexos de forma simples e clara.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Conheça nossos professores pessoalmente</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende uma consulta gratuita e experimente uma aula com um de nossos professores.
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
