import { test, expect } from '@playwright/test'

test.describe('E2E: Autenticação e Login', () => {
  test('deve renderizar a página de login com sucesso', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/English School/i)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('deve exibir mensagem de erro para credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalido@englishschool.com')
    await page.fill('input[type="password"]', 'SenhaIncorreta123!')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible({ timeout: 5000 })
  })
})
