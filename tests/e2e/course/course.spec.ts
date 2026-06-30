/**
 * Behavioral tests — Course Management.
 */
import { test, expect } from '@playwright/test'
import { login } from '../helpers'

test.beforeEach(async ({ page }) => login(page))

test.describe('Cursos', () => {
  test('o painel lista os cursos do usuário', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Meus cursos' })).toBeVisible()
    // The seeded teacher is enrolled in TEC-RD
    await expect(page.getByText('TEC-RD').first()).toBeVisible()
  })

  test('abrir um curso mostra suas atividades', async ({ page }) => {
    await page.goto('/courses/2')
    await expect(page.getByRole('heading', { name: 'Atividades', exact: true })).toBeVisible()
    // Course 2 has a real assignment migrated from legacy
    await expect(page.getByText('Trabalho 1 - Fundamentos')).toBeVisible()
  })
})
