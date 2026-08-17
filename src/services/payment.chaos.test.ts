import { describe, it, expect, vi } from 'vitest'
import { SandboxPaymentAdapter, PaymentService, SERVER_PLAN_PRICES } from './payment.service'
import fc from 'fast-check'

describe('Payment Chaos & Tampering Testing (Resiliência e Idempotência)', () => {
  it('SandboxPaymentAdapter.verifySessionToken rejeita 100% de tokens adulterados (Fuzzing de Assinaturas)', () => {
    fc.assert(
      fc.property(fc.string(), (fuzzedToken) => {
        const verified = SandboxPaymentAdapter.verifySessionToken(fuzzedToken)
        // Qualquer token malformado ou com assinatura inválida deve retornar null
        expect(verified).toBeNull()
      }),
      { numRuns: 100 }
    )
  })

  it('gera tokens válidos que podem ser decodificados com fidelidade total de dados', async () => {
    const adapter = new SandboxPaymentAdapter()
    const session = await adapter.createCheckout({
      userId: 'user_test_123',
      userEmail: 'student@test.com',
      userName: 'Test Student',
      plan: 'STANDARD',
    })

    expect(session.url).toContain('session_token=')
    const token = session.url.split('session_token=')[1]

    const verified = SandboxPaymentAdapter.verifySessionToken(token)
    expect(verified).not.toBeNull()
    expect(verified.userId).toBe('user_test_123')
    expect(verified.plan).toBe('STANDARD')
    expect(verified.amount).toBe(SERVER_PLAN_PRICES.STANDARD.amount)
  })

  it('bloqueia adulteração de payload mesmo que o formato base64url seja válido', () => {
    const adapter = new SandboxPaymentAdapter()
    
    // Cria payload falso
    const fakeData = { userId: 'victim_user', plan: 'PREMIUM', amount: 100 }
    const fakePayload = Buffer.from(JSON.stringify(fakeData)).toString('base64url')
    const fakeToken = `${fakePayload}.invalid_fake_signature_12345`

    const verified = SandboxPaymentAdapter.verifySessionToken(fakeToken)
    expect(verified).toBeNull()
  })
})
