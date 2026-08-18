import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function CanceledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(38,20%,97%)]">
      <Card className="max-w-md w-full shadow-tinted">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(0,70%,50%)]/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-[hsl(0,70%,50%)]" />
          </div>
          <CardTitle className="text-2xl font-outfit font-bold text-[hsl(20,10%,10%)]">
            Pagamento cancelado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-[hsl(20,5%,45%)]">
            O pagamento foi cancelado. Nada foi cobrado na sua conta.
          </p>
          <p className="text-sm text-[hsl(20,5%,45%)]">
            Se tiver alguma dúvida, entre em contato conosco.
          </p>
          <div className="space-y-2 pt-2">
            <Link href="/planos" className="block">
              <Button className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
                Tentar novamente
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-[hsl(35,10%,85%)] text-[hsl(20,10%,15%)]">
                <Home className="mr-2 h-4 w-4" />
                Ir para página inicial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
