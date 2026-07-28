import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema, leadSchema, sanitizeString, sanitizeEmail } from './validation'

describe('Validation Schemas and Helpers', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      }
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail when password lacks requirements', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weakpassword', // no uppercase, no number
      }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should fail with invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'Password123',
      }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'Password123',
      }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail with empty password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: '',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Sanitization helpers', () => {
    it('should sanitize string inputs by removing HTML tags and control chars', () => {
      const raw = '  <script>alert("x5")</script>  Hello World\x00 '
      const sanitized = sanitizeString(raw)
      expect(sanitized).toBe('scriptalert("x5")/script  Hello World')
    })

    it('should sanitize email to lowercase and trimmed', () => {
      const email = '  USER@Example.COM  '
      expect(sanitizeEmail(email)).toBe('user@example.com')
    })
  })
})
