import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(38,20%,97%)]">
      <Card className="max-w-md w-full shadow-tinted">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(145,60%,45%)]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-[hsl(145,60%,45%)]" />
          </div>
          <CardTitle className="text-2xl font-outfit font-bold text-[hsl(20,10%,10%)]">
            Pagamento confirmado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-[hsl(20,5%,45%)]">
            Sua assinatura foi ativada com sucesso. Você receberá um e-mail de confirmação com os detalhes.
          </p>
          <p className="text-sm text-[hsl(20,5%,45%)]">
            Bem-vindo à English School.
          </p>
          <Link href="/" className="block">
            <Button className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Ir para página inicial
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
