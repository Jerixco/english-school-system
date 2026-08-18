'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, CreditCard, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SandboxCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionToken = searchParams.get('session_token')

  const [loading, setLoading] = useState(false)
  const [sessionDetails, setSessionDetails] = useState<any | null>(null)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!sessionToken) {
      setError('Token de sessão de checkout não fornecido ou inválido.')
      return
    }

    try {
      const [payloadBase64] = sessionToken.split('.')
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')))
        setSessionDetails(decoded)
      }
    } catch {
      setError('Não foi possível ler as informações da sessão de teste.')
    }
  }, [sessionToken])

  const handleAction = async (action: 'approve' | 'decline' | 'cancel') => {
    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/payments/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          action,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar simulação de pagamento')
      }

      if (data.status === 'COMPLETED') {
        setSuccessMsg(data.message || 'Pagamento aprovado com sucesso!')
        setTimeout(() => {
          router.push('/aluno')
        }, 2000)
      } else if (data.status === 'CANCELED') {
        router.push(data.redirectUrl || '/planos')
      } else if (data.status === 'FAILED') {
        setError(data.error || 'Pagamento recusado.')
      }
    } catch (err: any) {
      setError(err.message || 'Falha na comunicação com o gateway de teste.')
    } finally {
      setLoading(false)
    }
  }

  if (error && !sessionDetails) {
    return (
      <div className="min-h-screen bg-[hsl(38,20%,97%)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-tinted">
          <CardHeader>
            <CardTitle className="text-[hsl(0,70%,50%)] flex items-center gap-2 font-outfit">
              <AlertCircle className="h-5 w-5" />
              Sessão inválida
            </CardTitle>
            <CardDescription className="text-[hsl(20,5%,45%)]">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[hsl(25,85%,48%)] hover:bg-[hsl(25,85%,48%)/90] text-white font-semibold">
              <Link href="/planos">Voltar aos planos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(220,25%,12%)] text-white flex items-center justify-center p-4 grain">
      <Card className="max-w-lg w-full bg-[hsl(220,25%,16%)] border-[hsl(25,85%,48%)]/30 backdrop-blur-md shadow-2xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[hsl(25,85%,48%)]/20 p-2 rounded-lg text-[hsl(25,85%,48%)] border border-[hsl(25,85%,48%)]/30">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-white font-outfit">Ambiente seguro de pagamento</CardTitle>
                <CardDescription className="text-[hsl(20,5%,65%)] text-xs">
                  Gateway de Pagamentos Integrado (Modo Sandbox de Demonstração)
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-[hsl(25,85%,48%)]/20 text-[hsl(25,85%,48%)] border border-[hsl(25,85%,48%)]/40">
              Sandbox Test
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {sessionDetails && (
            <div className="bg-[hsl(20,10%,9%)]/80 rounded-xl p-4 border border-white/10 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[hsl(20,5%,65%)]">Plano selecionado:</span>
                <span className="font-bold text-white text-base">{sessionDetails.plan}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[hsl(20,5%,65%)]">Aluno:</span>
                <span className="text-[hsl(20,5%,75%)]">{sessionDetails.userEmail}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[hsl(20,5%,65%)] font-medium">Valor total:</span>
                <span className="text-2xl font-extrabold text-[hsl(145,60%,45%)]">
                  {((sessionDetails.amount || 0) / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: sessionDetails.currency || 'BRL',
                  })}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-[hsl(0,70%,50%)]/10 border border-[hsl(0,70%,50%)]/40 text-[hsl(0,70%,50%)] p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-[hsl(145,60%,45%)]/10 border border-[hsl(145,60%,45%)]/40 text-[hsl(145,60%,45%)] p-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{successMsg} Redirecionando para o portal...</span>
            </div>
          )}

          <div className="bg-[hsl(20,10%,9%)]/60 rounded-lg p-3 text-xs text-[hsl(20,5%,65%)] border border-white/10 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-[hsl(25,85%,48%)] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Simulador de transações:</strong> Escolha uma das opções abaixo para simular a resposta da adquirente (Stripe/Cartão/PIX). Ao aprovar, o status da matrícula e a fatura serão gerados com segurança no banco de dados.
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => handleAction('approve')}
              disabled={loading || !!successMsg}
              className="w-full bg-[hsl(145,60%,45%)] hover:bg-[hsl(145,60%,45%)/90] text-white font-bold h-11 gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando simulação...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Simular pagamento aprovado (ativar plano)
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleAction('decline')}
                disabled={loading || !!successMsg}
                className="bg-[hsl(0,70%,50%)]/10 border-[hsl(0,70%,50%)]/30 hover:bg-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,50%)] text-xs h-9"
              >
                Simular recusa
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('cancel')}
                disabled={loading || !!successMsg}
                className="bg-[hsl(20,10%,15%)] border-white/10 hover:bg-[hsl(20,10%,20%)] text-[hsl(20,5%,65%)] text-xs h-9"
              >
                Cancelar checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
