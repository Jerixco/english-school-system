export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[hsl(38,20%,97%)]">
      {children}
    </div>
  )
}
