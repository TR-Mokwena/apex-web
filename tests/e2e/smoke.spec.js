import { test, expect } from "@playwright/test";
import { NAV } from "../../lib/nav.js";

/**
 * Smoke test: every sidebar destination must render its app shell (past the auth
 * gate), keep us off the login page, and throw no uncaught client errors.
 * Driven straight from NAV so new routes are covered automatically.
 */
test.describe("Smoke — all nav routes render", () => {
  for (const item of NAV) {
    test(`${item.label} (${item.href})`, async ({ page }) => {
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));

      await page.goto(item.href);

      // auth gate did not bounce us to /login
      await expect(page).not.toHaveURL(/\/login/);
      // <main> only mounts once the shell is ready (auth resolved)
      await expect(page.getByRole("main")).toBeVisible();
      // sidebar chrome is present
      await expect(page.getByRole("link", { name: item.label, exact: true })).toBeVisible();

      expect(errors, `uncaught errors on ${item.href}`).toEqual([]);
    });
  }
});
