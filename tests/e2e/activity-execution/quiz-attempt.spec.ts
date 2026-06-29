/**
 * Behavioral tests for the Activity Execution bounded context — Quiz.
 * Translated from: public/mod/quiz/tests/behat/attempt_basic.feature (Moodle upstream)
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Quiz — Attempt', () => {
  test('enrolled student can start a quiz attempt', async ({ page }) => {
    // Source: attempt_basic.feature
    await page.goto('/login')
    await page.getByLabel('Username').fill('student')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/quiz-001')
    await page.getByRole('button', { name: 'Attempt quiz' }).click()

    await expect(page.getByText('First question')).toBeVisible()
  })

  test('student can answer a true/false question and submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/quiz-001/attempt')
    await page.getByLabel('True').check()
    await page.getByRole('button', { name: 'Finish attempt' }).click()
    await page.getByRole('button', { name: 'Submit all and finish' }).click()

    await expect(page.getByText(/quiz summary|attempt submitted/i)).toBeVisible()
  })

  test('student can review their grade after submitting the quiz', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/quiz-001')
    await expect(page.getByText(/your final grade|grade:/i)).toBeVisible()
  })

  test('quiz completion is achieved when student passes the minimum grade', async ({ page }) => {
    // Source: completion_condition_passing_grade.feature
    await page.goto('/login')
    await page.getByLabel('Username').fill('student')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001')
    const completionBadge = page.getByTestId('completion-quiz-001')
    await expect(completionBadge).toHaveAttribute('data-status', 'complete')
  })
})
