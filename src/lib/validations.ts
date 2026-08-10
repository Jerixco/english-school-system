import { z } from 'zod'

// ============================================
// VALIDAÇÕES GLOBAIS SEGURAS & SCHEMAS DE AUTH
// ============================================

export const emailSchema = z
  .string()
  .email('Email inválido')
  .toLowerCase()
  .max(255, 'Email muito longo')

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido')
  .max(20, 'Telefone muito longo')
  .optional()

export const idSchema = z
  .string()
  .cuid('ID inválido')

export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const twoFactorTokenSchema = z.object({
  token: z.string().length(6, 'O código deve ter 6 dígitos').regex(/^\d+$/, 'Apenas números'),
})

// ============================================
// LEAD SCHEMAS & VALIDAÇÃO
// ============================================

export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: emailSchema,
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[\d\s-()]+$/.test(val),
    'Telefone inválido'
  ),
  source: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

// ============================================
// STUDENT SCHEMAS & VALIDAÇÃO
// ============================================

export const studentPlanEnum = z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM'])

export const studentSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  plan: studentPlanEnum,
  subscriptionId: z.string().optional(),
  customerId: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export const createStudentSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  plan: studentPlanEnum.default('BASIC'),
})

export const updateStudentSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  plan: studentPlanEnum.optional(),
})

export const studentFilterSchema = z.object({
  ...paginationSchema.shape,
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRIAL']).optional(),
  plan: studentPlanEnum.optional(),
  search: z.string().max(100).optional(),
})

// ============================================
// TEACHER SCHEMAS & VALIDAÇÃO
// ============================================

export const teacherSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  calendlyUrl: z.string().url('URL do Calendly inválida').optional(),
  bio: z.string().max(2000).optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
})

export const createTeacherSchema = z.object({
  userId: idSchema,
  calendlyUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
})

export const updateTeacherSchema = z.object({
  calendlyUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

export const teacherFilterSchema = z.object({
  ...paginationSchema.shape,
  isActive: z.boolean().optional(),
  search: z.string().max(100).optional(),
  specialty: z.string().optional(),
})

// ============================================
// CLASS (AULA) SCHEMAS & VALIDAÇÃO
// ============================================

export const classStatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])

export const classSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno é obrigatório'),
  teacherId: z.string().min(1, 'ID do professor é obrigatório'),
  scheduledAt: z.string().or(z.date()).transform((val) => new Date(val)),
  duration: z.number().min(15, 'Duração mínima de 15 minutos').max(180, 'Duração máxima de 180 minutos'),
  meetLink: z.string().url('Link inválido').optional(),
  notes: z.string().max(1000).optional(),
})

export const createClassSchema = z.object({
  studentId: idSchema,
  teacherId: idSchema,
  scheduledAt: z.coerce.date().refine(
    (date) => date > new Date(),
    'Data deve ser no futuro'
  ),
  duration: z.number().int().positive().max(480).default(60),
  meetLink: z.string().url().optional(),
})

export const updateClassSchema = z.object({
  status: classStatusEnum.optional(),
  meetLink: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
  scheduledAt: z.coerce.date().refine(
    (date) => date > new Date(),
    'Data deve ser no futuro'
  ).optional(),
})

export const classFilterSchema = z.object({
  ...paginationSchema.shape,
  status: classStatusEnum.optional(),
  teacherId: idSchema.optional(),
  studentId: idSchema.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

// ============================================
// STRIPE CHECKOUT & PAYMENT SCHEMAS
// ============================================

export const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
})

export const paymentStatusEnum = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])

export const createPaymentSchema = z.object({
  studentId: idSchema,
  amount: z.number().positive().max(999999.99),
  currency: z.string().length(3).default('BRL'),
  paymentMethod: z.string().max(50),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(),
    'Data de vencimento deve ser no futuro'
  ),
  invoiceUrl: z.string().url().optional(),
})

export const updatePaymentSchema = z.object({
  status: paymentStatusEnum.optional(),
  paidAt: z.coerce.date().optional(),
})

export const paymentFilterSchema = z.object({
  ...paginationSchema.shape,
  status: paymentStatusEnum.optional(),
  studentId: idSchema.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  timestamp: z.date().optional(),
})

// ============================================
// BLOG SCHEMAS & VALIDAÇÃO
// ============================================

const slugSchema = z
  .string()
  .min(1, 'Slug é obrigatório')
  .max(200, 'Slug muito longo')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (use apenas letras minúsculas, números e hífens)')

export const createBlogSchema = z.object({
  title: z.string().min(2, 'Título muito curto').max(200, 'Título muito longo'),
  slug: slugSchema,
  content: z.string().min(1, 'Conteúdo é obrigatório').max(100000, 'Conteúdo muito longo'),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url('URL de capa inválida').optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
  author: z.string().min(2, 'Autor é obrigatório').max(100),
  tags: z.array(z.string().max(50)).max(20).optional().default([]),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
})

export const updateBlogSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  content: z.string().min(1).max(100000).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
})

// ============================================
// HELPER SANITIZERS & VALIDATORS
// ============================================

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
}

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

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

export const validateStudent = (data: any) => {
  const sanitized = {
    ...data,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
  }
  return studentSchema.parse(sanitized)
}

export const validateClass = (data: any) => {
  const sanitized = {
    ...data,
    meetLink: data.meetLink ? sanitizeString(data.meetLink) : undefined,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
  }
  return classSchema.parse(sanitized)
}

export const validateTeacher = (data: any) => {
  const sanitized = {
    ...data,
    calendlyUrl: data.calendlyUrl ? sanitizeString(data.calendlyUrl) : undefined,
    bio: data.bio ? sanitizeString(data.bio) : undefined,
  }
  return teacherSchema.parse(sanitized)
}

export const validateCheckout = (data: any) => {
  const plan = typeof data?.plan === 'string' ? data.plan.toUpperCase() : data?.plan
  return checkoutSchema.parse({ plan })
}

export const validateRegister = (data: unknown) => {
  const parsed = registerSchema.parse(data)
  return {
    name: sanitizeString(parsed.name),
    email: sanitizeEmail(parsed.email),
    password: parsed.password,
  }
}

export const validateLogin = (data: unknown) => {
  const parsed = loginSchema.parse(data)
  return {
    email: sanitizeEmail(parsed.email),
    password: parsed.password,
  }
}

export type EmailSchema = z.infer<typeof emailSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>
export type CreateStudentSchema = z.infer<typeof createStudentSchema>
export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>
export type CreateTeacherSchema = z.infer<typeof createTeacherSchema>
export type UpdateTeacherSchema = z.infer<typeof updateTeacherSchema>
export type CreateClassSchema = z.infer<typeof createClassSchema>
export type UpdateClassSchema = z.infer<typeof updateClassSchema>
export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>
export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>
