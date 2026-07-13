'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'

export default function AlunoAulasPage() {
  return (
    <DashboardShell title="Minhas Aulas" subtitle="Histórico e aulas agendadas">
      <div className="card stat-card">
        <div className="card-body text-center py-5">
          <i className="bi bi-calendar-event display-4 text-muted mb-3 d-block" />
          <h5>Em breve</h5>
          <p className="text-muted mb-0">
            O calendário completo de aulas será disponibilizado na próxima etapa do projeto.
          </p>
        </div>
      </div>
    </DashboardShell>
  )
}
