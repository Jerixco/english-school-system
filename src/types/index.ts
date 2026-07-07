export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: 'NEW' | 'CONTACTED' | 'CONSULTATION_SCHEDULED' | 'CONSULTATION_COMPLETED' | 'PROPOSAL_SENT' | 'CONVERTED' | 'LOST'
  source?: string
  notes?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student {
  id: string
  userId: string
  plan: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL'
  startDate: Date
  nextPaymentDate?: Date
  subscriptionId?: string
  customerId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Teacher {
  id: string
  userId: string
  calendlyUrl?: string
  availability: string[]
  bio?: string
  specialties: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Class {
  id: string
  studentId: string
  teacherId: string
  scheduledAt: Date
  duration: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  meetLink?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  stripePaymentId?: string
  dueDate: Date
  paidAt?: Date
  invoiceUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  published: boolean
  author: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalLeads: number
  activeStudents: number
  monthlyRevenue: number
  recurringRevenue: number
  conversionRate: number
  scheduledClasses: number
  pendingPayments: number
}
