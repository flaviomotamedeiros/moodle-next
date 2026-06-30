/**
 * Behavioral tests — Enrollment & Course creation (new-system writes).
 */
import { test, expect } from '@playwright/test'
import { login } from '../helpers'

test.beforeEach(async ({ page }) => login(page))

test.describe('Matrícula', () => {
  test('a página Explorar lista cursos do catálogo', async ({ page }) => {
    await page.goto('/explore')
    await expect(page.getByRole('heading', { name: 'Explorar cursos' })).toBeVisible()
    await expect(page.getByText('TEC-RD').first()).toBeVisible()
  })

  test('criar um curso e matricular-se nele', async ({ page }) => {
    await page.goto('/explore')

    // Create a fresh course (write to the new database)
    const unique = `Curso E2E ${Date.now()}`
    await page.getByRole('button', { name: 'Novo curso' }).click()
    await page.getByLabel('Nome do curso').fill(unique)
    await page.getByLabel('Sigla').fill('E2E')
    await page.getByRole('button', { name: 'Criar' }).click()

    // Locate the freshly-created course's card and enroll within it
    const card = page.getByTestId('course-tile').filter({ hasText: unique })
    await expect(card).toBeVisible()
    await card.getByRole('button', { name: 'Matricular-me' }).click()

    await expect(card.getByRole('button', { name: 'Matriculado' })).toBeVisible()
  })
})
