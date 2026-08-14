'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONSENT_STORAGE_KEY = 'english_school_cookie_consent'

export type CookieConsentType = 'all' | 'essential' | null

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)
  const [consent, setConsent] = useState<CookieConsentType>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY) as CookieConsentType
    if (stored) {
      setConsent(stored)
    } else {
      setIsOpen(true)
    }
  }, [])

  const handleConsent = (choice: 'all' | 'essential') => {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice)
    setConsent(choice)
    setIsOpen(false)
  }

  // Previne renderização discrepante no SSR / hidratação
  if (!mounted || !isOpen) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de Cookies e Privacidade LGPD"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-4xl mx-auto bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="bg-indigo-600/30 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/30 flex-shrink-0 mt-0.5">
              <Cookie className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base text-white">Privacidade & Uso de Cookies</h4>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/30">
                  LGPD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Utilizamos cookies essenciais para autenticação segura e funcionamento da plataforma. Você também pode permitir cookies analíticos para nos ajudar a aprimorar a experiência de aprendizado. Consulte nossa{' '}
                <Link
                  href="/privacidade"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-medium transition"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConsent('essential')}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-600 hover:text-white text-xs h-9"
            >
              Apenas Essenciais
            </Button>
            <Button
              size="sm"
              onClick={() => handleConsent('all')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-md shadow-indigo-900/30"
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
