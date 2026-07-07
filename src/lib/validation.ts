import { z } from 'zod'

// Lead validation schema
export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[\d\s-()]+$/.test(val),
    'Telefone inválido'
  ),
  source: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

// Student validation schema
export const studentSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  plan: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM']),
  subscriptionId: z.string().optional(),
  customerId: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

// Class validation schema
export const classSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno é obrigatório'),
  teacherId: z.string().min(1, 'ID do professor é obrigatório'),
  scheduledAt: z.string().or(z.date()).transform((val) => new Date(val)),
  duration: z.number().min(15, 'Duração mínima de 15 minutos').max(180, 'Duração máxima de 180 minutos'),
  meetLink: z.string().url('Link inválido').optional(),
  notes: z.string().max(1000).optional(),
})

// Teacher validation schema
export const teacherSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  calendlyUrl: z.string().url('URL do Calendly inválida').optional(),
  bio: z.string().max(2000).optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
})

// Stripe checkout validation schema
export const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  priceId: z.string().min(1, 'Price ID é obrigatório'),
})

// Sanitize string input
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
}

// Sanitize email
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

// Validate and sanitize lead data
export const validateLead = (data: any) => {
  const sanitized = {
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    phone: data.phone ? sanitizeString(data.phone) : undefined,
    source: data.source ? sanitizeString(data.source) : undefined,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
  }
  
  return leadSchema.parse(sanitized)
}

// Validate and sanitize student data
export const validateStudent = (data: any) => {
  const sanitized = {
    ...data,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
  }
  
  return studentSchema.parse(sanitized)
}

// Validate and sanitize class data
export const validateClass = (data: any) => {
  const sanitized = {
    ...data,
    meetLink: data.meetLink ? sanitizeString(data.meetLink) : undefined,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
  }
  
  return classSchema.parse(sanitized)
}

// Validate and sanitize teacher data
export const validateTeacher = (data: any) => {
  const sanitized = {
    ...data,
    calendlyUrl: data.calendlyUrl ? sanitizeString(data.calendlyUrl) : undefined,
    bio: data.bio ? sanitizeString(data.bio) : undefined,
  }
  
  return teacherSchema.parse(sanitized)
}

// Validate and sanitize checkout data
export const validateCheckout = (data: any) => {
  const sanitized = {
    email: sanitizeEmail(data.email),
    name: sanitizeString(data.name),
    priceId: data.priceId,
  }
  
  return checkoutSchema.parse(sanitized)
}
