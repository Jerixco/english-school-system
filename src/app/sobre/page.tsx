import { Card, CardContent } from '@/components/ui/card'
import { Target, Heart, Award, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SobrePage() {
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
            <Link href="/metodologia" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Metodologia</Link>
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
            Sobre nossa escola
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Ensino de inglês online com professores nativos e tecnologia de ponta desde 2020
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">Nossa história</h2>
              <p className="text-[hsl(20,5%,45%)] mb-4 leading-relaxed">
                Fundada em 2020 por professores nativos com paixão pelo ensino, nossa escola nasceu com o objetivo de tornar o aprendizado de inglês acessível, eficiente e personalizado.
              </p>
              <p className="text-[hsl(20,5%,45%)] mb-4 leading-relaxed">
                Começamos com apenas 2 professores e 10 alunos. Hoje, temos mais de 500 alunos satisfeitos e planos de expansão para atender ainda mais pessoas.
              </p>
              <p className="text-[hsl(20,5%,45%)] leading-relaxed">
                Nossa missão é ajudar cada aluno a alcançar seus objetivos de fluência através de um método comprovado e professores excepcionais.
              </p>
            </div>
            <div className="bg-[hsl(220,25%,12%)] rounded-xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '500+', label: 'Alunos ativos' },
                  { value: '15+', label: 'Professores nativos' },
                  { value: '40+', label: 'Aulas semanais' },
                  { value: '98%', label: 'Taxa de satisfação' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl font-outfit font-black text-[hsl(25,85%,48%)] mb-1">{value}</div>
                    <div className="text-sm text-[hsl(20,5%,65%)]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            Nossos valores
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Excelência', desc: 'Compromisso com a qualidade em cada aula e material didático.' },
              { icon: Heart, title: 'Paixão', desc: 'Amor pelo ensino e dedicação ao sucesso de cada aluno.' },
              { icon: Award, title: 'Inovação', desc: 'Métodos modernos e tecnologia para melhor aprendizado.' },
              { icon: Users, title: 'Comunidade', desc: 'Ambiente acolhedor e suporte contínuo aos alunos.' },
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

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[hsl(35,10%,94%)] border-none">
              <CardContent className="pt-6">
                <h2 className="font-outfit font-bold text-xl text-[hsl(20,10%,10%)] mb-3">Nossa missão</h2>
                <p className="text-[hsl(20,5%,45%)] leading-relaxed">
                  Proporcionar ensino de inglês de alta qualidade, acessível e personalizado, capacitando nossos alunos a alcançar fluência e conquistar seus objetivos pessoais e profissionais.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(35,10%,94%)] border-none">
              <CardContent className="pt-6">
                <h2 className="font-outfit font-bold text-xl text-[hsl(20,10%,10%)] mb-3">Nossa visão</h2>
                <p className="text-[hsl(20,5%,45%)] leading-relaxed">
                  Ser referência nacional no ensino de inglês online, reconhecidos pela excelência pedagógica, inovação tecnológica e pelo impacto positivo na vida de milhares de alunos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(220,25%,12%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-white mb-6">
            Faça parte da nossa história
          </h2>
          <p className="text-lg text-[hsl(20,5%,65%)] mb-8 leading-relaxed">
            Junte-se a centenas de alunos que já transformaram seu inglês conosco.
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
