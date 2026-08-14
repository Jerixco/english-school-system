'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ROLE_LABELS } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import {
  Home,
  Calendar,
  Shield,
  LayoutDashboard,
  LogOut,
  Users,
  UserCheck,
  Radio,
  CreditCard,
  Eye,
} from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || ''
  const { data: session } = useSession()
  const role = session?.user?.role || 'STUDENT'
  const userEmail = session?.user?.email?.toLowerCase().trim() || ''
  const isDemo = userEmail === 'preview.demo@englishschool.com' || userEmail === 'demo@englishschool.com'

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-4 flex flex-col">
      <div className="mb-6">
        <h4 className="font-bold text-xl mb-1">English School</h4>
        {isDemo ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-medium">
            <Eye className="h-3.5 w-3.5" />
            Modo Demonstração (Leitura)
          </div>
        ) : (
          <small className="text-white/70">Portal {ROLE_LABELS[role] || 'Aluno'}</small>
        )}
      </div>

      <nav className="flex flex-col flex-1 space-y-1 overflow-y-auto pr-1">
        {isDemo ? (
          <>
            {/* Seção Administrador */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-3 pt-2 pb-1">
              🏢 Administração (Demo)
            </div>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/admin' && (!currentTab || currentTab === 'overview')
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-sky-400" />
              Visão Geral (KPIs)
            </Link>
            <Link
              href="/admin?tab=leads"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/admin' && currentTab === 'leads'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Users className="h-4 w-4 text-blue-400" />
              CRM & Funil Leads
            </Link>
            <Link
              href="/admin?tab=students"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/admin' && currentTab === 'students'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              Alunos & Matrículas
            </Link>
            <Link
              href="/admin?tab=classes"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/admin' && currentTab === 'classes'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Radio className="h-4 w-4 text-rose-400" />
              Aulas Ao Vivo & VOD
            </Link>
            <Link
              href="/admin?tab=financial"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/admin' && currentTab === 'financial'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <CreditCard className="h-4 w-4 text-amber-400" />
              Financeiro & Faturamento
            </Link>

            {/* Seção Aluno */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-3 pt-4 pb-1">
              🎓 Portal do Aluno (Demo)
            </div>
            <Link
              href="/aluno"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/aluno' && (!currentTab || currentTab === 'overview')
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4 text-emerald-300" />
              Início do Aluno
            </Link>
            <Link
              href="/aluno/aulas"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/aluno/aulas'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4 text-sky-300" />
              Minhas Aulas
            </Link>
            <Link
              href="/aluno?tab=financeiro"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/aluno' && currentTab === 'financeiro'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <CreditCard className="h-4 w-4 text-emerald-400" />
              Controle Financeiro
            </Link>

            {/* Seção Professor */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-3 pt-4 pb-1">
              👨‍🏫 Portal Professor (Demo)
            </div>
            <Link
              href="/professor"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/professor'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4 text-indigo-300" />
              Início do Professor
            </Link>
            <Link
              href="/professor/aulas"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/professor/aulas'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4 text-purple-300" />
              Grade de Aulas
            </Link>

            {/* Segurança */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-3 pt-4 pb-1">
              🛡️ Segurança
            </div>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === '/seguranca'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4 text-slate-300" />
              Segurança & Logs
            </Link>
          </>
        ) : role === 'STUDENT' ? (
          <>
            <Link
              href="/aluno"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/aluno' && (!currentTab || currentTab === 'overview')
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              Início & Aulas
            </Link>
            <Link
              href="/aluno/aulas"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/aluno/aulas'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Minhas Aulas
            </Link>
            <Link
              href="/aluno?tab=financeiro"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/aluno' && currentTab === 'financeiro'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <CreditCard className="h-4 w-4 text-emerald-400" />
              Controle Financeiro
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              Segurança
            </Link>
          </>
        ) : role === 'TEACHER' ? (
          <>
            <Link
              href="/professor"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/professor'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link
              href="/professor/aulas"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/professor/aulas'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Aulas
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              Segurança
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && (!currentTab || currentTab === 'overview')
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Visão Geral (KPIs)
            </Link>
            <Link
              href="/admin?tab=leads"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'leads'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Users className="h-4 w-4" />
              CRM & Funil Leads
            </Link>
            <Link
              href="/admin?tab=students"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'students'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Alunos & Matrículas
            </Link>
            <Link
              href="/admin?tab=classes"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'classes'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Radio className="h-4 w-4" />
              Aulas & VOD
            </Link>
            <Link
              href="/admin?tab=financial"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'financial'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <CreditCard className="h-4 w-4 text-emerald-400" />
              Financeiro & Faturamento
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca'
                  ? 'bg-white/15 text-white font-medium shadow-xs'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              Segurança & Logs
            </Link>
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <div className="text-sm text-white/70 mb-3 truncate">{session?.user?.email}</div>
        <Button
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
