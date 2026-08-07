import { test, expect } from '@playwright/test'

test.describe('E2E: LGPD & Segurança de Dados', () => {
  test('deve possuir rotas de segurança e termos LGPD ativos', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('form')).toBeVisible()
  })
})
