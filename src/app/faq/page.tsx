import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FAQPage() {
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
            Perguntas frequentes
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {[
              { q: 'Como funcionam as aulas?', a: 'As aulas são 100% online via videoconferência. Você recebe um link antes de cada aula e pode participar de qualquer lugar com conexão estável. As aulas têm duração de 60 minutos e são individuais com professores nativos.' },
              { q: 'Quais são os horários disponíveis?', a: 'Oferecemos horários flexíveis, inclusive manhãs, tardes, noites e fins de semana. Você pode escolher os horários que funcionam melhor para sua agenda durante o agendamento.' },
              { q: 'Preciso ter algum nível prévio de inglês?', a: 'Não! Aceitamos alunos de todos os níveis, do iniciante ao avançado. Durante a consulta gratuita, avaliamos seu nível atual e criamos um plano personalizado para você.' },
              { q: 'Os professores são nativos?', a: 'Sim! Todos os nossos professores são nativos de países de língua inglesa (EUA, Reino Unido, Canadá, etc.) e são certificados em ensino de inglês como segunda língua.' },
              { q: 'Posso cancelar ou remarcar aulas?', a: 'Sim! Você pode cancelar ou remarcar aulas com até 24 horas de antecedência sem custo adicional. Cancelamentos com menos de 24 horas podem ser cobrados.' },
              { q: 'Existe contrato de fidelidade?', a: 'Não! Todos os nossos planos são mensais e sem contrato. Você pode cancelar a qualquer momento sem multas ou taxas adicionais.' },
              { q: 'Quais são as formas de pagamento?', a: 'Aceitamos cartões de crédito, débito e PIX. O pagamento é processado automaticamente todo mês através do Stripe, garantindo segurança e facilidade.' },
              { q: 'Recebo algum material didático?', a: 'Sim! Todos os alunos recebem material didático exclusivo de acordo com seu nível e objetivos. O material inclui exercícios, gramática, vocabulário e recursos complementares.' },
              { q: 'Posso ter aulas gravadas?', a: 'Sim! Nos planos Padrão e Premium, as aulas são gravadas e disponibilizadas para você assistir quantas vezes quiser, facilitando a revisão e o estudo.' },
              { q: 'Como faço para começar?', a: 'É simples! Agende uma consulta gratuita através do nosso site. Durante a consulta, avaliamos seu nível, discutimos seus objetivos e apresentamos os planos disponíveis. Não há compromisso!' },
            ].map(({ q, a }) => (
              <AccordionItem key={q} value={q} className="border border-[hsl(35,10%,85%)] rounded-lg px-4">
                <AccordionTrigger className="text-left font-outfit font-semibold text-[hsl(20,10%,10%)] hover:text-[hsl(25,85%,48%)] transition-colors py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[hsl(20,5%,45%)] leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Não encontrou sua resposta
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Entre em contato conosco e teremos prazer em ajudar.
          </p>
          <Link href="/contato">
            <Button size="lg" className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-tinted text-lg px-8">
              Falar com a equipe
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
