import { test, expect } from "@playwright/test";

// Start signed out by overriding the shared authenticated storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Auth gate (signed out)", () => {
  test("protected app route redirects to /login", async ({ page }) => {
    await page.goto("/team");
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard redirects to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page renders its form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  });
});
