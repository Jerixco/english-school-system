'use client'

import DashboardShell from '@/components/dashboard/DashboardShell'
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <DashboardShell title="Dashboard Administrativo" subtitle="Visão geral do sistema">
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Total de Alunos</p>
                  <h3 className="fw-bold mb-0">—</h3>
                </div>
                <Users className="text-muted" size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Alunos Ativos</p>
                  <h3 className="fw-bold mb-0">—</h3>
                </div>
                <TrendingUp className="text-muted" size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Receita Mensal</p>
                  <h3 className="fw-bold mb-0">—</h3>
                </div>
                <DollarSign className="text-muted" size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Aulas Agendadas</p>
                  <h3 className="fw-bold mb-0">—</h3>
                </div>
                <Calendar className="text-muted" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card stat-card h-100">
            <div className="card-body">
              <h5 className="fw-bold">Gerenciar Alunos</h5>
              <p className="text-muted small">Visualize e gerencie todos os alunos cadastrados</p>
              <span className="text-primary fw-medium small">Em breve →</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card h-100">
            <div className="card-body">
              <h5 className="fw-bold">Gerenciar Leads</h5>
              <p className="text-muted small">Acompanhe e converta leads em alunos</p>
              <span className="text-primary fw-medium small">Em breve →</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card h-100">
            <div className="card-body">
              <h5 className="fw-bold">Gerenciar Aulas</h5>
              <p className="text-muted small">Visualize e gerencie todas as aulas agendadas</p>
              <span className="text-primary fw-medium small">Em breve →</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
