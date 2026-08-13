import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentService, SandboxPaymentAdapter, SERVER_PLAN_PRICES } from './payment.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email', () => ({
  sendPaymentConfirmationEmail: vi.fn().mockResolvedValue(true),
}))

describe('PaymentService & Security Controls', () => {
  let paymentService: PaymentService

  beforeEach(() => {
    paymentService = new PaymentService(new SandboxPaymentAdapter())
    vi.clearAllMocks()
  })

  it('should enforce server-side pricing catalog for all purchasable plans', () => {
    expect(SERVER_PLAN_PRICES.BASIC.amount).toBe(29700)
    expect(SERVER_PLAN_PRICES.STANDARD.amount).toBe(49700)
    expect(SERVER_PLAN_PRICES.PREMIUM.amount).toBe(79700)
  })

  it('should create a signed sandbox checkout session for valid plan', async () => {
    vi.mocked(prisma.student.upsert).mockResolvedValue({
      id: 'student-123',
      userId: 'user-123',
      plan: 'STANDARD',
      status: 'TRIAL',
      startDate: new Date(),
      nextPaymentDate: null,
      subscriptionId: null,
      customerId: null,
      notes: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const checkout = await paymentService.createCheckout({
      userId: 'user-123',
      userEmail: 'student@example.com',
      userName: 'John Doe',
      plan: 'STANDARD',
    })

    expect(checkout.provider).toBe('sandbox')
    expect(checkout.url).toContain('/checkout/sandbox?session_token=')
    expect(checkout.sessionId).toMatch(/^sbx_sess_/)
  })

  it('should reject invalid or custom plans from checkout', async () => {
    await expect(
      paymentService.createCheckout({
        userId: 'user-123',
        userEmail: 'student@example.com',
        plan: 'CUSTOM' as any,
      })
    ).rejects.toThrow(/Plano inválido/)
  })

  it('should process successful payment idempotently without creating duplicate records', async () => {
    const mockStudent = {
      id: 'student-123',
      userId: 'user-123',
      plan: 'TRIAL',
      user: { name: 'Lucas', email: 'lucas@example.com' },
    }

    vi.mocked(prisma.student.findFirst).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce(null) // Primeira vez: não existe
    vi.mocked(prisma.payment.create).mockResolvedValue({ id: 'pay-new-1' } as any)
    vi.mocked(prisma.student.update).mockResolvedValue({} as any)

    const event = {
      transactionId: 'tx_abc_123',
      userId: 'user-123',
      plan: 'STANDARD' as const,
      amountInCents: 49700,
      currency: 'BRL',
      paymentMethod: 'sandbox_card',
      status: 'COMPLETED' as const,
    }

    const firstRun = await paymentService.processSuccessfulPayment(event)
    expect(firstRun.success).toBe(true)
    expect(firstRun.paymentId).toBe('pay-new-1')
    expect(prisma.payment.create).toHaveBeenCalledTimes(1)

    // Segunda vez com a mesma transactionId: deve ignorar (idempotência)
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce({ id: 'pay-new-1' } as any)
    const secondRun = await paymentService.processSuccessfulPayment(event)
    expect(secondRun.success).toBe(true)
    expect(secondRun.alreadyProcessed).toBe(true)
    expect(prisma.payment.create).toHaveBeenCalledTimes(1) // Continua 1, não duplicou
  })

  it('should correctly verify HMAC session token signatures and reject tampered or expired tokens', () => {
    const adapter = new SandboxPaymentAdapter()
    const sessionData = {
      sessionId: 'sbx_123',
      userId: 'user-1',
      plan: 'PREMIUM',
      amount: 79700,
      createdAt: Date.now(),
    }

    const validToken = (adapter as any).signSession(sessionData)
    const verified = SandboxPaymentAdapter.verifySessionToken(validToken)
    expect(verified).not.toBeNull()
    expect(verified.plan).toBe('PREMIUM')

    // Token adulterado
    const tamperedToken = validToken.substring(0, validToken.length - 4) + 'abcd'
    const rejected = SandboxPaymentAdapter.verifySessionToken(tamperedToken)
    expect(rejected).toBeNull()

    // Token expirado (> 1 hora)
    const expiredData = {
      ...sessionData,
      createdAt: Date.now() - 3600000 - 10000, // 1h e 10s atrás
    }
    const expiredToken = (adapter as any).signSession(expiredData)
    const expiredResult = SandboxPaymentAdapter.verifySessionToken(expiredToken)
    expect(expiredResult).toBeNull()
  })
})
