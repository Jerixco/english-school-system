import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: '1',
    title: '5 dicas para aprender inglês mais rápido',
    slug: '5-dicas-para-aprender-ingles-mais-rapido',
    excerpt: 'Descubra as melhores estratégias para acelerar seu aprendizado de inglês e alcançar fluência em menos tempo.',
    author: 'Maria Silva',
    createdAt: '2024-01-15',
    tags: ['Aprendizado', 'Dicas'],
    coverImage: null,
  },
  {
    id: '2',
    title: 'Por que aprender com professores nativos?',
    slug: 'por-que-aprender-com-professores-nativos',
    excerpt: 'Entenda os benefícios de aprender inglês com professores nativos e como isso pode transformar sua pronúncia.',
    author: 'John Smith',
    createdAt: '2024-01-10',
    tags: ['Professores', 'Método'],
    coverImage: null,
  },
  {
    id: '3',
    title: 'Como superar o medo de falar inglês',
    slug: 'como-superar-o-medo-de-falar-ingles',
    excerpt: 'Muitos alunos têm medo de falar inglês. Confira técnicas práticas para superar essa barreira.',
    author: 'Ana Costa',
    createdAt: '2024-01-05',
    tags: ['Psicologia', 'Conversação'],
    coverImage: null,
  },
]

export default function BlogPage() {
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
            Blog
          </h1>
          <p className="text-xl text-[hsl(20,5%,45%)] leading-relaxed max-w-2xl mx-auto">
            Dicas, estratégias e insights para dominar o inglês
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                <CardHeader>
                  <div className="flex gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-[hsl(25,85%,48%)]/10 text-[hsl(25,85%,48%)] uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg font-outfit font-bold text-[hsl(20,10%,10%)] group-hover:text-[hsl(25,85%,48%)] transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(20,5%,45%)] mb-4 line-clamp-3 leading-relaxed text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[hsl(20,5%,45%)] mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-[hsl(25,85%,48%)]" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[hsl(25,85%,48%)]" />
                      <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" className="w-full border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)] hover:bg-[hsl(25,85%,48%)]/5">
                      Ler mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-[hsl(35,10%,94%)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
            Agende sua consulta gratuita e descubra como podemos ajudar você a alcançar fluência em inglês.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-tinted text-lg px-8">
              Agendar consulta gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
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
