'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    scheduledClasses: 0,
  })

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        // In production, fetch from actual API
        // const response = await fetch('/api/admin/stats')
        // const data = await response.json()
        // setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">+5% em relação ao mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aulas Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledClasses}</div>
              <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Gerenciar Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Visualize e gerencie todos os alunos cadastrados
              </p>
              <button className="text-purple-600 font-medium text-sm">
                Acessar →
              </button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Gerenciar Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acompanhe e converta leads em alunos
              </p>
              <button className="text-purple-600 font-medium text-sm">
                Acessar →
              </button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Gerenciar Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Visualize e gerencie todas as aulas agendadas
              </p>
              <button className="text-purple-600 font-medium text-sm">
                Acessar →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
