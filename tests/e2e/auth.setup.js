import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const STORAGE_STATE = "tests/e2e/.auth/user.json";

// Sign in through the real login UI, then persist the resulting storage state.
// This doubles as the canonical "login works" e2e — every other authed test
// depends on it, so a broken login fails the whole run loudly and early.
setup("authenticate via login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();

  // demo login: the Sign in button flips the auth flag and routes to the dashboard
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  // landing in the app shell confirms the auth gate let us through
  await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
});
