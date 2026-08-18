import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[hsl(38,20%,97%)] grain flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[hsl(25,85%,48%)]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-outfit font-black text-[hsl(25,85%,48%)]">404</span>
        </div>
        <h1 className="text-3xl font-outfit font-bold text-[hsl(20,10%,10%)] mb-3">
          Página não encontrada
        </h1>
        <p className="text-[hsl(20,5%,45%)] mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida. Verifique a URL e tente novamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold shadow-tinted">
              <Home className="mr-2 h-4 w-4" />
              Voltar para página inicial
            </Button>
          </Link>
          <Link href="/planos">
            <Button variant="outline" className="border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]">
              <Search className="mr-2 h-4 w-4" />
              Ver planos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
