import { z } from 'zod'

// ============================================
// VALIDAÇÕES GLOBAIS SEGURAS
// ============================================

export const emailSchema = z
  .string()
  .email('Email inválido')
  .toLowerCase()
  .max(255, 'Email muito longo')

export const passwordSchema = z
  .string()
  .min(12, 'Senha deve ter pelo menos 12 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter número')
  .regex(/[!@#$%^&*]/, 'Senha deve conter caractere especial')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Phone inválido')
  .max(20, 'Phone muito longo')
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

// ============================================
// STUDENT VALIDAÇÕES
// ============================================

export const studentPlanEnum = z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM'])

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
  // Campos que NÃO podem ser atualizados pelo usuário
  // role, id, email, password, twoFactorEnabled
})

export const studentFilterSchema = z.object({
  ...paginationSchema.shape,
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRIAL']).optional(),
  plan: studentPlanEnum.optional(),
  search: z.string().max(100).optional(), // nome ou email
})

// ============================================
// TEACHER VALIDAÇÕES
// ============================================

export const createTeacherSchema = z.object({
  userId: idSchema, // Admin passa o user ID
  calendlyUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(), // horários em formato ISO
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
// CLASS (AULA) VALIDAÇÕES
// ============================================

export const classStatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])

export const createClassSchema = z.object({
  studentId: idSchema,
  teacherId: idSchema,
  scheduledAt: z.coerce.date().refine(
    (date) => date > new Date(),
    'Data deve ser no futuro'
  ),
  duration: z.number().int().positive().max(480).default(60), // até 8h
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
// PAYMENT VALIDAÇÕES
// ============================================

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

// ============================================
// RESPONSE TYPES
// ============================================

export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  timestamp: z.date().optional(),
})

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
