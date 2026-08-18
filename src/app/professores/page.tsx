import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Globe, GraduationCap, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfessoresPage() {
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
            Nossos professores
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Conheça os professores nativos que vão transformar seu inglês
          </p>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                initials: 'JS',
                name: 'John Smith',
                role: 'Professor de Inglês',
                country: 'Estados Unidos',
                degree: 'Mestre em Ensino de Inglês como Segunda Língua',
                experience: '10+ anos de experiência',
                specialty: 'Conversação e pronúncia',
                bio: 'John é apaixonado por ajudar alunos a alcançar fluência natural. Seu método foca em conversação real e correções construtivas.',
              },
              {
                initials: 'EW',
                name: 'Emily Watson',
                role: 'Professora de Inglês',
                country: 'Reino Unido',
                degree: 'Bacharel em Literatura Inglesa',
                experience: '8+ anos de experiência',
                specialty: 'Gramática e escrita',
                bio: 'Emily tem uma abordagem paciente e detalhista, ideal para alunos que querem fortalecer a base gramatical e escrita.',
              },
            ].map(({ initials, name, role, country, degree, experience, specialty, bio }) => (
              <Card key={name} className="bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[hsl(25,85%,48%)]/10 flex items-center justify-center text-[hsl(25,85%,48%)] text-xl font-outfit font-bold shrink-0">
                      {initials}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-outfit font-bold text-[hsl(20,10%,10%)]">{name}</CardTitle>
                      <p className="text-sm text-[hsl(20,5%,45%)]">{role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {[
                      { icon: Globe, text: `Nativo(a) do ${country}` },
                      { icon: GraduationCap, text: degree },
                      { icon: Award, text: experience },
                      { icon: MessageSquare, text: specialty },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 text-sm text-[hsl(20,5%,45%)]">
                        <Icon className="h-4 w-4 text-[hsl(25,85%,48%)] shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[hsl(20,5%,45%)] text-sm leading-relaxed">{bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Teachers */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-outfit font-bold text-center text-[hsl(20,10%,10%)] mb-12">
            Por que nossos professores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: 'Certificados', desc: 'Todos os professores são certificados e têm formação acadêmica em ensino de idiomas.' },
              { icon: Award, title: 'Experiência', desc: 'Anos de experiência ensinando alunos de diferentes níveis e nacionalidades.' },
              { icon: MessageSquare, title: 'Comunicação', desc: 'Habilidade excepcional de explicar conceitos complexos de forma simples e clara.' },
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

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Conheça nossos professores pessoalmente
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Agende uma consulta gratuita e experimente uma aula com um de nossos professores.
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
