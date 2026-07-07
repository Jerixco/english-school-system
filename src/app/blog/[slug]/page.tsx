import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

// This would typically fetch from API based on slug
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-purple-600 transition">Home</Link>
            <Link href="/blog" className="text-sm hover:text-purple-600 transition">Blog</Link>
            <Link href="/planos" className="text-sm hover:text-purple-600 transition">Planos</Link>
          </nav>
          <Link href="/agendar">
            <Button>Agendar Consulta Gratuita</Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Blog
          </Link>

          <header className="mb-8">
            <div className="flex gap-2 mb-4">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blogPost.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </header>

          <Card>
            <CardContent className="pt-6">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between items-center">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Button>
            </Link>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Gostou do artigo?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende sua consulta gratuita e descubra como podemos ajudar você a alcançar fluência em inglês.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="text-lg px-8 py-6">
              Agendar Consulta Gratuita
            </Button>
          </Link>
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
