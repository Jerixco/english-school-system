export function getDashboardUrl(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'TEACHER':
      return '/professor'
    case 'STUDENT':
      return '/aluno'
    default:
      return '/login'
  }
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  TEACHER: 'Professor',
  STUDENT: 'Aluno',
}
