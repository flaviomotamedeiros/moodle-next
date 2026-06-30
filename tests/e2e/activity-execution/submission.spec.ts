/**
 * Behavioral tests — Activity Execution (assignment submission).
 * Submission is a new-system write (Stage 2/3), persisted in the new database.
 */
import { test, expect } from '@playwright/test'
import { login } from '../helpers'

test('aluno envia (ou edita) uma resposta de tarefa', async ({ page }) => {
  await login(page)
  await page.goto('/courses/2/activities/52')

  await expect(page.getByRole('heading', { name: 'Trabalho 1 - Fundamentos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Sua resposta' })).toBeVisible()

  const editBtn = page.getByRole('button', { name: 'Editar resposta' })
  const textarea = page.getByPlaceholder('Digite sua resposta…')

  // Wait for the submission widget to settle into one of its two states.
  await expect(editBtn.or(textarea)).toBeVisible()
  if (await editBtn.isVisible()) await editBtn.click()

  await textarea.fill('Resposta enviada pelo teste E2E')
  await page.getByRole('button', { name: 'Enviar resposta' }).click()

  await expect(page.getByText('Enviado para avaliação.')).toBeVisible()
})
