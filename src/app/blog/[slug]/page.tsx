import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { sanitizeRichHtml } from '@/lib/sanitize-html'

const blogPost = {
  title: '5 Dicas para Aprender Inglês Mais Rápido',
  slug: '5-dicas-para-aprender-ingles-mais-rapido',
  content: `
    <h2>1. Imersão Diária</h2>
    <p>A melhor forma de aprender inglês é através da imersão. Tente expor-se ao idioma todos os dias, seja ouvindo músicas, assistindo filmes ou lendo artigos em inglês.</p>
    
    <h2>2. Pratique Conversação</h2>
    <p>Encontrar parceiros de conversação é essencial. Participe de grupos de estudo, use aplicativos de troca de idiomas ou contrate um professor particular.</p>
    
    <h2>3. Use Aplicativos de Flashcards</h2>
    <p>Aplicativos como Anki ou Quizlet ajudam a memorizar vocabulário de forma eficiente. Dedique 15-20 minutos diários para revisar as palavras.</p>
    
    <h2>4. Estabeleça Metas Claras</h2>
    <p>Defina objetivos específicos e mensuráveis. Por exemplo: "Aprender 50 novas palavras por semana" ou "Assistir a um filme sem legendas".</p>
    
    <h2>5. Seja Consistente</h2>
    <p>A consistência é mais importante que a intensidade. É melhor estudar 30 minutos todos os dias do que 4 horas apenas nos fins de semana.</p>
  `,
  author: 'Maria Silva',
  createdAt: '2024-01-15',
  tags: ['Aprendizado', 'Dicas'],
  seoTitle: '5 Dicas para Aprender Inglês Mais Rápido | English School',
  seoDescription: 'Descubra as melhores estratégias para acelerar seu aprendizado de inglês e alcançar fluência em menos tempo.',
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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
            <Link href="/blog" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Blog</Link>
            <Link href="/planos" className="text-sm font-medium text-[hsl(20,5%,45%)] hover:text-[hsl(25,85%,48%)] transition-colors">Planos</Link>
          </nav>
          <Link href="/agendar">
            <Button className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
              Agendar consulta
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-[hsl(25,85%,48%)] hover:text-[hsl(25,85%,48%)/80] mb-8 text-sm font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao blog
          </Link>

          <header className="mb-8">
            <div className="flex gap-2 mb-4">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-4 leading-tight">
              {blogPost.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[hsl(20,5%,45%)]">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-[hsl(25,85%,48%)]" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[hsl(25,85%,48%)]" />
                <span>{new Date(blogPost.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </header>

          <Card className="bg-[hsl(35,10%,94%)] border-none">
            <CardContent className="pt-6">
              <div
                className="text-[hsl(20,5%,45%)] leading-relaxed prose prose-lg max-w-none"
                style={{ fontFamily: 'var(--font-inter)' }}
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(blogPost.content) }}
              />
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between items-center">
            <Link href="/blog">
              <Button variant="outline" className="border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao blog
              </Button>
            </Link>
            <Button variant="outline" className="border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Gostou do artigo
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Agende sua consulta gratuita e descubra como podemos ajudar você a alcançar fluência em inglês.
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
