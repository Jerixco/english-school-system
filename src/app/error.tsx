'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured by Global Error Boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">
          Ops! Algo deu errado
        </h2>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Ocorreu um imprevisto ao carregar esta página. Nossa equipe de monitoramento foi notificada.
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs font-mono text-left mb-6 overflow-x-auto border border-red-200">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>

          <Button asChild variant="outline">
            <Link href="/" className="gap-2">
              <Home className="w-4 h-4" />
              Página Inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
