import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQPage() {
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
          <h1 className="text-5xl font-bold mb-6">Perguntas Frequentes</h1>
          <p className="text-xl text-gray-600">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como funcionam as aulas?</AccordionTrigger>
              <AccordionContent>
                As aulas são 100% online via videoconferência. Você recebe um link antes de cada aula e pode participar de qualquer lugar com conexão estável. As aulas têm duração de 60 minutos e são individuais com professores nativos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Quais são os horários disponíveis?</AccordionTrigger>
              <AccordionContent>
                Oferecemos horários flexíveis, inclusive manhãs, tardes, noites e fins de semana. Você pode escolher os horários que funcionam melhor para sua agenda durante o agendamento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Preciso ter algum nível prévio de inglês?</AccordionTrigger>
              <AccordionContent>
                Não! Aceitamos alunos de todos os níveis, do iniciante ao avançado. Durante a consulta gratuita, avaliamos seu nível atual e criamos um plano personalizado para você.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Os professores são nativos?</AccordionTrigger>
              <AccordionContent>
                Sim! Todos os nossos professores são nativos de países de língua inglesa (EUA, Reino Unido, Canadá, etc.) e são certificados em ensino de inglês como segunda língua.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Posso cancelar ou remarcar aulas?</AccordionTrigger>
              <AccordionContent>
                Sim! Você pode cancelar ou remarcar aulas com até 24 horas de antecedência sem custo adicional. Cancelamentos com menos de 24 horas podem ser cobrados.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Existe contrato de fidelidade?</AccordionTrigger>
              <AccordionContent>
                Não! Todos os nossos planos são mensais e sem contrato. Você pode cancelar a qualquer momento sem multas ou taxas adicionais.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Quais são as formas de pagamento?</AccordionTrigger>
              <AccordionContent>
                Aceitamos cartões de crédito, débito e PIX. O pagamento é processado automaticamente todo mês através do Stripe, garantindo segurança e facilidade.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>Recebo algum material didático?</AccordionTrigger>
              <AccordionContent>
                Sim! Todos os alunos recebem material didático exclusivo de acordo com seu nível e objetivos. O material inclui exercícios, gramática, vocabulário e recursos complementares.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>Posso ter aulas gravadas?</AccordionTrigger>
              <AccordionContent>
                Sim! Nos planos Padrão e Premium, as aulas são gravadas e disponibilizadas para você assistir quantas vezes quiser, facilitando a revisão e o estudo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>Como faço para começar?</AccordionTrigger>
              <AccordionContent>
                É simples! Agende uma consulta gratuita através do nosso site. Durante a consulta, avaliamos seu nível, discutimos seus objetivos e apresentamos os planos disponíveis. Não há compromisso!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Não encontrou sua resposta?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Entre em contato conosco e teremos prazer em ajudar.
          </p>
          <a href="/contato">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-md hover:bg-purple-700 transition text-lg">
              Falar com a Equipe
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
