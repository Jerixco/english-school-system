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
    <header className="bg-card text-card-foreground border-b border-border px-4 py-3 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-outfit text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="text-left sm:text-right">
          <div className="max-w-[16rem] truncate font-medium text-foreground">{session?.user?.name}</div>
          <Badge className="bg-primary text-primary-foreground">
            {ROLE_LABELS[session?.user?.role || ''] || 'Usuário'}
          </Badge>
        </div>
      </div>
    </header>
  )
}
