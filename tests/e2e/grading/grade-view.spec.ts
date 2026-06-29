/**
 * Behavioral tests for the Grading bounded context.
 * Translated from: public/grade/tests/behat/grade_view.feature (Moodle upstream)
 * Classification: BEHAVIORAL — retained as acceptance criteria
 */
import { test, expect } from '@playwright/test'

test.describe('Gradebook', () => {
  test('teacher can assign a grade to a student submission', async ({ page }) => {
    // Source: grade_view.feature — teacher gives grade via grader report
    await page.goto('/login')
    await page.getByLabel('Username').fill('teacher1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/grades')
    await page.getByRole('button', { name: 'Turn editing on' }).click()

    const gradeCell = page.getByTestId('grade-student1-assign-001')
    await gradeCell.fill('80')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(gradeCell).toHaveValue('80')
  })

  test('student can view their own grades in the gradebook', async ({ page }) => {
    // Source: grade_view.feature — student views user report
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/grades')

    await expect(page.getByText('Test assignment name 1')).toBeVisible()
    await expect(page.getByTestId('grade-value-assign-001')).toContainText('80')
  })

  test('student cannot view other students grades', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill('student1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/grades')

    await expect(page.getByText('student2')).not.toBeVisible()
  })

  test('gradebook displays weighted mean correctly when configured', async ({ page }) => {
    // Source: grade_aggregation.feature
    await page.goto('/login')
    await page.getByLabel('Username').fill('teacher1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/grades/settings')
    await page.getByLabel('Aggregation').selectOption('Weighted mean of grades')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await page.goto('/courses/course-001/grades')
    await expect(page.getByText('Weighted mean of grades')).toBeVisible()
  })

  test('teacher can provide written feedback alongside a grade', async ({ page }) => {
    // Source: grade_feedback.feature
    await page.goto('/login')
    await page.getByLabel('Username').fill('teacher1')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await page.goto('/courses/course-001/activities/assign-001/grade/student1')
    await page.getByLabel('Grade out of 100').fill('90')
    await page.getByLabel('Feedback comments').fill('Excellent work on this submission.')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Excellent work on this submission.')).toBeVisible()
  })
})
