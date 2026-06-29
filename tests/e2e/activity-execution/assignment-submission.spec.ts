/**
 * Behavioral tests for the Activity Execution bounded context — Assignment.
 * Translated from:
 *   - public/mod/assign/tests/behat/online_submissions.feature
 *   - public/mod/assign/tests/behat/assign_activity_completion.feature
 *   - public/mod/assign/tests/behat/grading_status.feature
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Assignment — Submission', () => {
  test('student can submit an online text assignment', async ({ page }) => {
    // Source: online_submissions.feature — "Submit a text online and edit the submission"
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-001')
    await page.getByRole('button', { name: 'Add submission' }).click()
    await page.getByLabel('Online text').fill("I'm the student first submission")
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Submitted for grading')).toBeVisible()
    await expect(page.getByText("I'm the student first submission")).toBeVisible()
  })

  test('student cannot submit text that exceeds word limit', async ({ page }) => {
    // Source: online_submissions.feature — word limit validation
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-wordlimit')
    await page.getByRole('button', { name: 'Add submission' }).click()
    await page.getByLabel('Online text').fill('This is more than ten words: one two three four five six seven eight nine ten eleven')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText(/please review your submission|word limit exceeded/i)).toBeVisible()
  })

  test('student can edit a previously submitted assignment', async ({ page }) => {
    // Source: online_submissions.feature — "edit the submission"
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-001')
    await page.getByRole('button', { name: 'Edit submission' }).click()
    await page.getByLabel('Online text').fill("I'm the student second submission")
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText("I'm the student second submission")).toBeVisible()
    await expect(page.getByText("I'm the student first submission")).not.toBeVisible()
  })

  test('activity completion is marked when student submits', async ({ page }) => {
    // Source: assign_activity_completion.feature
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-completion')
    await page.getByRole('button', { name: 'Add submission' }).click()
    await page.getByLabel('Online text').fill('My completed submission')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await page.goto('/courses/course-001')
    const completionBadge = page.getByTestId('completion-assign-completion')
    await expect(completionBadge).toHaveAttribute('data-status', 'complete')
  })
})

test.describe('Assignment — Grading Status', () => {
  test('student can see grading status after teacher grades submission', async ({ page }) => {
    // Source: grading_status.feature — student views "Graded" status
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-graded')
    await expect(page.getByText(/graded|marking complete/i)).toBeVisible()
  })

  test('student cannot see feedback while marking workflow is In Review', async ({ page }) => {
    // Source: grading_status.feature — feedback hidden during workflow "In review"
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-in-review')
    await expect(page.getByText('In review')).toBeVisible()
    await expect(page.getByText('Great job! Lol, not really.')).not.toBeVisible()
  })

  test('teacher can see submission count and filter by marking status', async ({ page }) => {
    // Source: grading_status.feature — teacher filters "submitted"
    await page.goto('/login')
    await page.getByLabel('Username').fill('teacher1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-001/submissions')
    await page.getByLabel('Filter').selectOption('submitted')

    await expect(page.getByText('student1')).toBeVisible()
  })
})
