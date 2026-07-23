import { expect, test } from "@playwright/test";
import { SignInPage } from "./pages/SignInPage";

const VALID_EMAIL = process.env.TIMEBLOCKS_EMAIL;

test.describe("TimeBlocks: 로그인", () => {
  test("로그인 폼이 렌더링된다", async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(signIn.emailInput).toBeVisible();
    await expect(signIn.passwordInput).toBeVisible();
  });

  test("등록되지 않은 이메일이면 오류가 표시된다", async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await signIn.signIn("not-a-real-user@example.com", "wrong-password-123");

    await expect(signIn.toastMessage).toContainText("Account does not exist.");
  });

  test("비밀번호가 틀리면 오류가 표시된다", async ({ page }) => {
    test.skip(!VALID_EMAIL, "TIMEBLOCKS_EMAIL not set in .env");

    const signIn = new SignInPage(page);
    await signIn.goto();

    await signIn.signIn(VALID_EMAIL!, "wrong-password-123");

    await expect(signIn.toastMessage).toContainText(
      "Wrong e-mail address or password.",
    );
  });
});
