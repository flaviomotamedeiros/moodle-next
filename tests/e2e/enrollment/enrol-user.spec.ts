/**
 * Behavioral tests for the Enrollment bounded context.
 * Translated from: public/enrol/tests/behat/enrol_user.feature (Moodle upstream)
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Enrollment', () => {
  test('administrator can manually enrol a user in a course as student', async ({ page }) => {
    // Arrange: admin session
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    // Act: enrol student
    await page.goto('/courses/course-001/participants')
    await page.getByRole('button', { name: 'Enrol users' }).click()
    await page.getByPlaceholder('Search users').fill('Studie One')
    await page.getByText('Studie One').click()
    await page.getByLabel('Role').selectOption('student')
    await page.getByRole('button', { name: 'Confirm enrolment' }).click()

    // Assert: user appears in participants list
    await page.goto('/courses/course-001/participants')
    await expect(page.getByText('Studie One')).toBeVisible()
  })

  test('enrolled student can access the course', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001')
    await expect(page).not.toHaveURL(/\/login|\/access-denied/)
    await expect(page.getByRole('heading', { name: 'Course 001' })).toBeVisible()
  })

  test('non-enrolled user cannot access a restricted course', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student2')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001')
    // Should be redirected or shown access denied
    const url = page.url()
    const hasAccessDenied = url.includes('access-denied') || url.includes('login')
    const hasErrorMessage = await page.getByText(/you cannot enrol yourself|access denied/i).isVisible().catch(() => false)
    expect(hasAccessDenied || hasErrorMessage).toBeTruthy()
  })

  test('teacher role grants access to gradebook and submissions', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('teacher1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/grades')
    await expect(page).not.toHaveURL(/access-denied/)
    await expect(page.getByRole('heading', { name: /gradebook/i })).toBeVisible()
  })
})
