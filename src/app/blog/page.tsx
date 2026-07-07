import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// This would typically fetch from API
const blogPosts = [
  {
    id: '1',
    title: '5 Dicas para Aprender Inglês Mais Rápido',
    slug: '5-dicas-para-aprender-ingles-mais-rapido',
    excerpt: 'Descubra as melhores estratégias para acelerar seu aprendizado de inglês e alcançar fluência em menos tempo.',
    author: 'Maria Silva',
    createdAt: '2024-01-15',
    tags: ['Aprendizado', 'Dicas'],
    coverImage: null,
  },
  {
    id: '2',
    title: 'Por Que Aprender com Professores Nativos?',
    slug: 'por-que-aprender-com-professores-nativos',
    excerpt: 'Entenda os benefícios de aprender inglês com professores nativos e como isso pode transformar sua pronúncia.',
    author: 'John Smith',
    createdAt: '2024-01-10',
    tags: ['Professores', 'Método'],
    coverImage: null,
  },
  {
    id: '3',
    title: 'Como Superar o Medo de Falar Inglês',
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            English School
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-purple-600 transition">Home</Link>
            <Link href="/sobre" className="text-sm hover:text-purple-600 transition">Sobre</Link>
            <Link href="/planos" className="text-sm hover:text-purple-600 transition">Planos</Link>
            <Link href="/contato" className="text-sm hover:text-purple-600 transition">Contato</Link>
          </nav>
          <Link href="/agendar">
            <Button>Agendar Consulta Gratuita</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-gray-600">
            Dicas, estratégias e insights para dominar o inglês
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <div className="flex gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" className="w-full">
                      Ler Mais
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Agende sua consulta gratuita e descubra como podemos ajudar você a alcançar fluência em inglês.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="text-lg px-8 py-6">
              Agendar Consulta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
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
