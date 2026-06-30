/**
 * Behavioral tests — Grading.
 * Teacher assigns a grade (new-system write); student sees grades.
 */
import { test, expect } from '@playwright/test'
import { login, TEACHER } from '../helpers'

test('professor lança nota numa tarefa e vê confirmação', async ({ page }) => {
  await login(page, TEACHER)
  await page.goto('/teach')

  await expect(page.getByRole('heading', { name: 'Avaliar' })).toBeVisible()

  // Select a course taught by the teacher
  await page.getByRole('button', { name: 'TEC-RD' }).click()
  // Select an assignment
  await page.getByRole('button', { name: 'Trabalho 1 - Fundamentos' }).click()

  // The student table loads
  const firstGradeInput = page.getByPlaceholder('0–100').first()
  await expect(firstGradeInput).toBeVisible()

  await firstGradeInput.fill('85')
  await page.getByRole('button', { name: 'Salvar' }).first().click()

  await expect(page.getByRole('button', { name: 'Salvo' }).first()).toBeVisible()
})

test('aluno visualiza suas notas no boletim', async ({ page }) => {
  await login(page) // teacher is also enrolled and has grades in some courses
  await page.goto('/grades')
  await expect(page.getByRole('heading', { name: 'Notas' })).toBeVisible()
})
