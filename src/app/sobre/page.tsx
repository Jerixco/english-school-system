import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Target, Heart, Award, Users } from 'lucide-react'

export default function SobrePage() {
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
            <a href="/metodologia" className="text-sm hover:text-purple-600 transition">Metodologia</a>
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
          <h1 className="text-5xl font-bold mb-6">Sobre Nossa Escola</h1>
          <p className="text-xl text-gray-600">
            Transformando vidas através do ensino de inglês de qualidade desde 2020
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                Fundada em 2020 por professores nativos com paixão pelo ensino, nossa escola nasceu com o objetivo de tornar o aprendizado de inglês acessível, eficiente e personalizado.
              </p>
              <p className="text-gray-600 mb-4">
                Começamos com apenas 2 professores e 10 alunos. Hoje, somos uma equipe crescendo com mais de 500 alunos satisfeitos e planos de expansão para atender ainda mais pessoas.
              </p>
              <p className="text-gray-600">
                Nossa missão é simples: ajudar cada aluno a alcançar seus objetivos de fluência através de um método comprovado e professores excepcionais.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-sm">Alunos Satisfeitos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2</div>
                  <div className="text-sm">Professores Nativos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">40+</div>
                  <div className="text-sm">Aulas Semanais</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-sm">Taxa de Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Excelência</h3>
                <p className="text-sm text-gray-600">
                  Compromisso com a qualidade em cada aula e material didático.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Paixão</h3>
                <p className="text-sm text-gray-600">
                  Amor pelo ensino e dedicação ao sucesso de cada aluno.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Inovação</h3>
                <p className="text-sm text-gray-600">
                  Métodos modernos e tecnologia para melhor aprendizado.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Comunidade</h3>
                <p className="text-sm text-gray-600">
                  Ambiente acolhedor e suporte contínuo aos alunos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Proporcionar ensino de inglês de alta qualidade, acessível e personalizado, capacitando nossos alunos a alcançar fluência e conquistar seus objetivos pessoais e profissionais através de um método comprovado e professores excepcionais.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ser referência nacional no ensino de inglês online, reconhecidos pela excelência pedagógica, inovação tecnológica e pelo impacto positivo na vida de milhares de alunos que alcançam fluência e transformam suas carreiras.
                </p>
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
