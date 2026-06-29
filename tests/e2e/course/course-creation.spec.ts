/**
 * Behavioral tests for the Course Management bounded context.
 * Translated from: public/course/tests/behat/course_creation.feature (Moodle upstream)
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Course Management', () => {
  test('manager can create a course with name and short name', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/new')
    await page.getByLabel('Course full name').fill('Introduction to Programming')
    await page.getByLabel('Course short name').fill('PROG101')
    await page.getByRole('button', { name: 'Save and display' }).click()

    await expect(page.getByRole('heading', { name: 'Introduction to Programming' })).toBeVisible()
  })

  test('new course is created with an Announcements forum by default', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/new')
    await page.getByLabel('Course full name').fill('Course with Announcements')
    await page.getByLabel('Course short name').fill('CWA1')
    await page.getByRole('button', { name: 'Save and display' }).click()

    // Source: course_creation.feature — "Courses are created with the default announcements forum"
    await expect(page.getByText('Announcements')).toBeVisible()
  })

  test('teacher cannot post to the Announcements forum (student read-only)', async ({ page }) => {
    // Source: course_creation.feature — student cannot "Add a new topic" in Announcements
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/announcements')
    await expect(page.getByRole('button', { name: /add a new topic|add discussion/i })).not.toBeVisible()
  })

  test('admin can delete a course', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('admin-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-to-delete/settings')
    await page.getByRole('button', { name: 'Delete course' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page).toHaveURL(/\/courses/)
    await expect(page.getByText('course-to-delete')).not.toBeVisible()
  })
})
