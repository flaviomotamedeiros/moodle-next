import { type Page, expect } from '@playwright/test'

export const TEACHER = { username: 'ana.cavalcante', password: 'Moodle@2025' }
export const STUDENT = { username: 'carlos.mendonca', password: 'Moodle@2025' }

/** Logs in through the real UI and waits for the dashboard. */
export async function login(
  page: Page,
  user: { username: string; password: string } = TEACHER,
) {
  await page.goto('/login')
  await page.getByLabel('Usuário').fill(user.username)
  await page.getByLabel('Senha').fill(user.password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}
