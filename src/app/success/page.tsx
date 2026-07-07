import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Sua assinatura foi ativada com sucesso. Você receberá um e-mail de confirmação com os detalhes.
          </p>
          <p className="text-sm text-gray-500">
            Bem-vindo à English School!
          </p>
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Ir para Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
