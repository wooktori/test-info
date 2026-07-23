import type { Locator, Page } from '@playwright/test'

export class SignInPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly toastMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[name="email"]')
    this.passwordInput = page.locator('input[name="password"]')
    this.submitButton = page.getByRole('button', { name: '로그인', exact: true })
    this.toastMessage = page.locator('[class*="Toast__Description"]')
  }

  async goto() {
    await this.page.goto('/signin')
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
