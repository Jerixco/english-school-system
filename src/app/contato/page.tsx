import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export default function ContatoPage() {
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
            Entre em contato
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Estamos aqui para ajudar. Fale conosco por qualquer canal.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
                Informações de contato
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, title: 'E-mail', lines: ['contato@englishschool.com', 'suporte@englishschool.com'] },
                  { icon: Phone, title: 'Telefone', lines: ['+55 (11) 99999-9999', 'Segunda a Sexta, 9h às 18h'] },
                  { icon: MapPin, title: 'Localização', lines: ['100% Online', 'Atendemos alunos de todo o Brasil'] },
                ].map(({ icon: Icon, title, lines }) => (
                  <Card key={title} className="bg-[hsl(35,10%,94%)] border-none">
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-lg bg-[hsl(25,85%,48%)]/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-[hsl(25,85%,48%)]" />
                        </div>
                        <div>
                          <h3 className="font-outfit font-semibold text-[hsl(20,10%,10%)] mb-1">{title}</h3>
                          {lines.map((line, i) => (
                            <p key={i} className="text-sm text-[hsl(20,5%,45%)]">{line}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Prefere falar pessoalmente?
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Agende uma consulta gratuita e converse com um de nossos professores.
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
