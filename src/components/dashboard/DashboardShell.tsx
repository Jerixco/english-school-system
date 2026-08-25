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
    <div className="flex flex-col md:flex-row min-h-screen grain">
      <Suspense fallback={<div className="w-64 min-h-screen bg-gradient-to-b from-purple-900 to-blue-900" />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
