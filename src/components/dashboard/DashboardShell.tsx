'use client'

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
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
