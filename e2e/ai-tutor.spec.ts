import { test, expect } from '@playwright/test'

test.describe('E2E: Alex AI Tutor Interface', () => {
  test('deve rejeitar acesso ao endpoint de IA sem autenticação', async ({ request }) => {
    const response = await request.post('/api/ai/tutor', {
      data: { message: 'Hello Alex!' },
    })
    expect(response.status()).toBe(401)
  })
})
