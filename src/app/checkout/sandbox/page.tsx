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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Sessão Inválida
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/planos">Voltar aos Planos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-slate-900/90 border-indigo-500/40 backdrop-blur-md text-white shadow-2xl">
        <CardHeader className="border-b border-indigo-500/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600/30 p-2 rounded-lg text-indigo-400 border border-indigo-500/30">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Ambiente Seguro de Pagamento</CardTitle>
                <CardDescription className="text-indigo-200 text-xs">
                  Gateway de Pagamentos Integrado (Modo Sandbox de Demonstração)
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Sandbox Test
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {sessionDetails && (
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-gray-400">Plano Selecionado:</span>
                <span className="font-bold text-white text-base">{sessionDetails.plan}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-gray-400">Aluno:</span>
                <span className="text-indigo-200">{sessionDetails.userEmail}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 font-medium">Valor Total:</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {((sessionDetails.amount || 0) / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: sessionDetails.currency || 'BRL',
                  })}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{successMsg} Redirecionando para o portal...</span>
            </div>
          )}

          <div className="bg-indigo-950/40 rounded-lg p-3 text-xs text-indigo-300 border border-indigo-800/50 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Simulador de Transações:</strong> Escolha uma das opções abaixo para simular a resposta da adquirente (Stripe/Cartão/PIX). Ao aprovar, o status da matrícula e a fatura serão gerados com segurança no banco de dados.
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => handleAction('approve')}
              disabled={loading || !!successMsg}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 gap-2 shadow-lg shadow-emerald-900/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando Simulação...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Simular Pagamento Aprovado (Ativar Plano)
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleAction('decline')}
                disabled={loading || !!successMsg}
                className="bg-red-950/30 border-red-800/50 hover:bg-red-900/40 text-red-300 text-xs h-9"
              >
                Simular Recusa
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('cancel')}
                disabled={loading || !!successMsg}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-gray-300 text-xs h-9"
              >
                Cancelar Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
