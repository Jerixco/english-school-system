import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { registerSchema, loginSchema, leadSchema, sanitizeString, sanitizeEmail } from './validations'

describe('Validation & Sanitization Fuzz Testing (Entropia nas Entradas)', () => {
  it('sanitizeString nunca lança exceções e elimina caracteres nulos em qualquer string aleatória', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const sanitized = sanitizeString(input)
        expect(typeof sanitized).toBe('string')
        // Caractere nulo (null byte) deve ser completamente removido
        expect(sanitized.includes('\x00')).toBe(false)
        // Não deve conter tags HTML brutas < ou >
        expect(sanitized.includes('<')).toBe(false)
        expect(sanitized.includes('>')).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  it('sanitizeEmail sempre gera strings em minúsculas e sem espaços laterais', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const sanitized = sanitizeEmail(input)
        expect(sanitized).toBe(sanitized.trim().toLowerCase())
      }),
      { numRuns: 100 }
    )
  })

  it('loginSchema rejeita com segurança payloads maliciosos ou corrompidos sem travar o runtime', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: fc.string(),
          password: fc.string(),
        }),
        (data) => {
          const result = loginSchema.safeParse(data)
          expect(typeof result.success).toBe('boolean')
          if (!result.success) {
            expect(result.error).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('registerSchema valida com precisão e rejeita senhas fracas aleatórias', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          email: fc.emailAddress(),
          password: fc.string({ maxLength: 5 }), // Senha muito curta (< 8)
        }),
        (data) => {
          const result = registerSchema.safeParse(data)
          // Deve sempre falhar por causa da senha curta
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 50 }
    )
  })
})
