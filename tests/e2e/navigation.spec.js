import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("sidebar links route between sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();

    await page.getByRole("link", { name: "Team", exact: true }).click();
    await expect(page).toHaveURL(/\/team$/);
    await expect(page.getByRole("heading", { name: "Team", exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Contributors", exact: true }).click();
    await expect(page).toHaveURL(/\/contributors$/);

    await page.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("active route is highlighted in the sidebar", async ({ page }) => {
    await page.goto("/team");
    await expect(page.getByRole("link", { name: "Team", exact: true })).toHaveClass(/bg-brand/);
  });

  test("command palette opens with the keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(page).toHaveURL(/\/command$/);
  });

  test("mobile shows the menu button, desktop hides it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });
});
