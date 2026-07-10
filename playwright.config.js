import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config for Apex.
 *
 * The app has no backend — auth is a client-side flag in web storage (see lib/auth.js),
 * so the `setup` project signs in once through the UI and saves the storage state that
 * every authenticated test reuses. Tests run against `next dev` on a dedicated port
 * (3100) that Playwright boots for us (reusing an already-running one if present).
 */

const PORT = process.env.APEX_TEST_PORT || 3100;
const BASE_URL = `http://localhost:${PORT}`;
const STORAGE_STATE = "tests/e2e/.auth/user.json";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
  },

  projects: [
    // 1. sign in once, persist storage state
    { name: "setup", testMatch: /auth\.setup\.js/ },

    // 2. authenticated suites reuse that state
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
