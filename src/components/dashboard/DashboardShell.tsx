'use client'

import { Suspense } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground grain md:flex-row">
      <Suspense fallback={<div className="w-full bg-gradient-to-b from-sidebar-from to-sidebar-to md:min-h-screen md:w-64" />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main id="main-content" className="flex-1 bg-background p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
