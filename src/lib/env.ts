import { z } from 'zod'

/**
 * Validação rigorosa de Variáveis de Ambiente (Zod)
 * Assegura que o sistema falhe imediatamente na inicialização/build caso chaves obrigatórias falhem.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET deve ter no mínimo 16 caracteres'),
  NEXTAUTH_URL: z.string().url().optional(),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY deve ter 32 caracteres para AES-256-GCM'),
  GEMINI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  KV_REST_API_URL: z.string().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

let parsedEnv: z.infer<typeof envSchema>

try {
  parsedEnv = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n')
    // Em produção, variáveis inválidas são fatais: aborta o boot em vez de rodar
    // com segredos ausentes/fracos (ex.: ENCRYPTION_KEY curta, NEXTAUTH_SECRET vazio).
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[ENV VALIDATION FAILED]\n' + missingVars)
    }
    console.warn('⚠️ [ENV VALIDATION NOTICE]:\n' + missingVars)
  } else {
    throw error
  }
  parsedEnv = process.env as any
}

export const env = parsedEnv
