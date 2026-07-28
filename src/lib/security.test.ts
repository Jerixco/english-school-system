import { describe, it, expect } from 'vitest'
import { hasRole, isAdmin, isTeacher, isStudent, isOwnerOrAdmin, sanitizeUserData, sanitizePaymentData } from './security'
import { Role } from '@prisma/client'

describe('Security and Authorization Helpers', () => {
  const adminUser = { id: 'u1', email: 'admin@test.com', role: Role.ADMIN, name: 'Admin' }
  const teacherUser = { id: 'u2', email: 'teacher@test.com', role: Role.TEACHER, name: 'Teacher' }
  const studentUser = { id: 'u3', email: 'student@test.com', role: Role.STUDENT, name: 'Student' }

  describe('Role checks', () => {
    it('isAdmin should correctly identify admin role', () => {
      expect(isAdmin(adminUser)).toBe(true)
      expect(isAdmin(studentUser)).toBe(false)
    })

    it('isTeacher should correctly identify teacher role', () => {
      expect(isTeacher(teacherUser)).toBe(true)
      expect(isTeacher(adminUser)).toBe(false)
    })

    it('isStudent should correctly identify student role', () => {
      expect(isStudent(studentUser)).toBe(true)
      expect(isStudent(teacherUser)).toBe(false)
    })

    it('hasRole should check against list of roles', () => {
      expect(hasRole(teacherUser, [Role.ADMIN, Role.TEACHER])).toBe(true)
      expect(hasRole(studentUser, [Role.ADMIN, Role.TEACHER])).toBe(false)
    })

    it('isOwnerOrAdmin should allow owner or admin', () => {
      expect(isOwnerOrAdmin(studentUser, 'u3')).toBe(true)
      expect(isOwnerOrAdmin(studentUser, 'u1')).toBe(false)
      expect(isOwnerOrAdmin(adminUser, 'u3')).toBe(true)
    })
  })

  describe('Data sanitization', () => {
    it('sanitizeUserData should strip password and twoFactorSecret', () => {
      const userWithSecrets = {
        id: 'u1',
        email: 'test@test.com',
        password: 'hashedpassword',
        twoFactorSecret: 'secret123',
        name: 'Test',
      }
      const sanitized = sanitizeUserData(userWithSecrets)
      expect(sanitized).not.toHaveProperty('password')
      expect(sanitized).not.toHaveProperty('twoFactorSecret')
      expect(sanitized).toHaveProperty('email', 'test@test.com')
    })

    it('sanitizePaymentData should mask stripePaymentId', () => {
      const payment = {
        id: 'p1',
        amount: 100,
        stripePaymentId: 'pi_123456789abcdef',
      }
      const sanitized = sanitizePaymentData(payment)
      expect(sanitized).not.toHaveProperty('stripePaymentId')
      expect(sanitized.maskedPaymentId).toBe('***cdef')
    })
  })
})
