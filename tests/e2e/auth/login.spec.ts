/**
 * Behavioral tests — Authentication.
 * Acceptance criteria from Phase 2, run against the real app.
 */
import { test, expect } from '@playwright/test'
import { login, TEACHER } from '../helpers'

test.describe('Autenticação', () => {
  test('login com credenciais válidas leva ao painel', async ({ page }) => {
    await login(page, TEACHER)
    await expect(page.getByRole('button', { name: 'Menu do usuário' })).toBeVisible()
  })

  test('login com senha incorreta mostra erro e permanece no login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Usuário').fill(TEACHER.username)
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('logout retorna para a tela de login', async ({ page }) => {
    await login(page, TEACHER)
    await page.getByRole('button', { name: 'Menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
