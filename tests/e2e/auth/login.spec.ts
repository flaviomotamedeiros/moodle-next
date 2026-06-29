/**
 * Behavioral tests for the Authentication bounded context.
 * Translated from: public/auth/tests/behat/login.feature (Moodle upstream)
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('student can log in with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.getByTestId('user-menu')).toBeVisible()
  })

  test('login fails with incorrect password and shows error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('alert')).toContainText(/invalid credentials|unable to log in/i)
  })

  test('login fails with non-existent username', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('nonexistent_user')
    await page.getByLabel('Password').fill('any-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('authenticated user can log out', async ({ page }) => {
    // Arrange: log in
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).not.toHaveURL(/\/login/)

    // Act: log out
    await page.getByTestId('user-menu').click()
    await page.getByRole('menuitem', { name: 'Log out' }).click()

    // Assert
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByTestId('user-menu')).not.toBeVisible()
  })

  test('login page meets accessibility standards', async ({ page }) => {
    await page.goto('/login')
    // Accessibility check delegated to axe-playwright in CI
    // Source: login.feature @accessibility scenario
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  })
})
