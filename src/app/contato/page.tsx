import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContatoPage() {
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
            <a href="/professores" className="text-sm hover:text-purple-600 transition">Professores</a>
            <a href="/planos" className="text-sm hover:text-purple-600 transition">Planos</a>
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
          <h1 className="text-5xl font-bold mb-6">Entre em Contato</h1>
          <p className="text-xl text-gray-600">
            Estamos aqui para ajudar. Entre em contato conosco!
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">E-mail</h3>
                        <p className="text-gray-600">contato@englishschool.com</p>
                        <p className="text-gray-600">suporte@englishschool.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Telefone</h3>
                        <p className="text-gray-600">+55 (11) 99999-9999</p>
                        <p className="text-sm text-gray-500">Segunda a Sexta, 9h às 18h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Localização</h3>
                        <p className="text-gray-600">100% Online</p>
                        <p className="text-sm text-gray-500">Atendemos alunos de todo o Brasil</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" placeholder="Assunto da mensagem" />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Escreva sua mensagem..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Prefere falar pessoalmente?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende uma consulta gratuita e converse com um de nossos professores.
          </p>
          <a href="/agendar">
            <Button size="lg" className="text-lg px-8 py-6">
              Agendar Consulta Gratuita
            </Button>
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
