'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ROLE_LABELS } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Home, Calendar, Shield, LayoutDashboard, LogOut, Users, UserCheck, Radio } from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || ''
  const { data: session } = useSession()
  const role = session?.user?.role || 'STUDENT'

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-4 flex flex-col">
      <div className="mb-6">
        <h4 className="font-bold text-xl mb-1">English School</h4>
        <small className="text-white/70">Portal {ROLE_LABELS[role] || 'Aluno'}</small>
      </div>

      <nav className="flex flex-col flex-1 space-y-1">
        {role === 'STUDENT' && (
          <>
            <Link
              href="/aluno"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/aluno' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link
              href="/aluno/aulas"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/aluno/aulas' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Minhas Aulas
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              Segurança
            </Link>
          </>
        )}

        {role === 'TEACHER' && (
          <>
            <Link
              href="/professor"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/professor' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link
              href="/professor/aulas"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/professor/aulas' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Aulas
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Shield className="h-4 w-4" />
              Segurança
            </Link>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && !currentTab ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Visão Geral (KPIs)
            </Link>
            <Link
              href="/admin?tab=leads"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'leads' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Users className="h-4 w-4" />
              CRM & Funil Leads
            </Link>
            <Link
              href="/admin?tab=students"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'students' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Alunos & Matrículas
            </Link>
            <Link
              href="/admin?tab=classes"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin' && currentTab === 'classes' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <Radio className="h-4 w-4" />
              Aulas & VOD
            </Link>
            <Link
              href="/seguranca"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/seguranca' ? 'bg-white/15 text-white font-medium' : 'text-white/85 hover:bg-white/10'
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
