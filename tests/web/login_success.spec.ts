import { expect, test } from '@playwright/test'

test.describe('TimeBlocks: Sign in', () => {
  test('signs in with valid credentials and reaches the calendar', async ({ page }) => {
    await page.goto('https://app.timeblocks.com/')

    await page.getByPlaceholder('이메일을 입력해 주세요.').fill(process.env.TIMEBLOCKS_EMAIL!)
    await page.getByPlaceholder('6~20자리의 숫자 또는 문자를 입력해 주세요.').fill(process.env.TIMEBLOCKS_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 10000 })
    await expect(page.getByText('캘린더', { exact: true })).toBeVisible()
  })
})