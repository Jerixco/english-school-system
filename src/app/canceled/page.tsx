import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function CanceledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            O pagamento foi cancelado. Não se preocupe, você pode tentar novamente a qualquer momento.
          </p>
          <p className="text-sm text-gray-500">
            Se tiver alguma dúvida, entre em contato conosco.
          </p>
          <div className="space-y-2">
            <Link href="/planos">
              <Button className="w-full">
                Tentar Novamente
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Ir para Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
