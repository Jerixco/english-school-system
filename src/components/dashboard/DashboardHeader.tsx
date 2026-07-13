'use client'

import { useSession } from 'next-auth/react'
import { ROLE_LABELS } from '@/lib/roles'
import { Badge } from '@/components/ui/badge'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="font-medium">{session?.user?.name}</div>
          <Badge className="bg-purple-600">{ROLE_LABELS[session?.user?.role || ''] || 'Usuário'}</Badge>
        </div>
      </div>
    </header>
  )
}
