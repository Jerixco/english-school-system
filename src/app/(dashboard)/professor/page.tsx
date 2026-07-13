'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'

export default function ProfessorDashboardPage() {
  return (
    <DashboardShell title="Portal do Professor" subtitle="Gerencie suas aulas e alunos">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card stat-card">
            <div className="card-body text-center py-5">
              <i className="bi bi-calendar-week display-4 text-primary mb-3 d-block" />
              <h5>Aulas de Hoje</h5>
              <p className="text-muted mb-0">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card stat-card">
            <div className="card-body text-center py-5">
              <i className="bi bi-people display-4 text-primary mb-3 d-block" />
              <h5>Meus Alunos</h5>
              <p className="text-muted mb-0">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
