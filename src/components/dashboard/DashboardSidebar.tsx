'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { ROLE_LABELS } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Home, Calendar, Shield, LayoutDashboard, LogOut } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  STUDENT: [
    { href: '/aluno', label: 'Início', icon: <Home className="h-4 w-4" /> },
    { href: '/aluno/aulas', label: 'Minhas Aulas', icon: <Calendar className="h-4 w-4" /> },
    { href: '/seguranca', label: 'Segurança', icon: <Shield className="h-4 w-4" /> },
  ],
  TEACHER: [
    { href: '/professor', label: 'Início', icon: <Home className="h-4 w-4" /> },
    { href: '/professor/aulas', label: 'Aulas', icon: <Calendar className="h-4 w-4" /> },
    { href: '/seguranca', label: 'Segurança', icon: <Shield className="h-4 w-4" /> },
  ],
  ADMIN: [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/seguranca', label: 'Segurança', icon: <Shield className="h-4 w-4" /> },
  ],
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role || 'STUDENT'
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.STUDENT

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-4 flex flex-col">
      <div className="mb-6">
        <h4 className="font-bold text-xl mb-1">English School</h4>
        <small className="text-white/70">Portal {ROLE_LABELS[role] || 'Aluno'}</small>
      </div>

      <nav className="flex flex-col flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-white/15 text-white'
                : 'text-white/85 hover:bg-white/10'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <div className="text-sm text-white/70 mb-3">{session?.user?.email}</div>
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
