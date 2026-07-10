import { test, expect } from "@playwright/test";

const COMP = "R1,180,000 / yr"; // TR Mokwena's compensation — admin-only
const EMAIL = "tr@eclipsesoftworks.com";

test.describe("Team roster (/team)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/team");
    await expect(page.getByRole("heading", { name: "Team", exact: true })).toBeVisible();
  });

  test("lists every member and role counts", async ({ page }) => {
    await expect(page.locator('a[href^="/team/"]')).toHaveCount(6);
    // count tiles (plural labels avoid colliding with filter chips / role pills)
    await expect(page.getByRole("button").filter({ hasText: "Leads" })).toContainText("2");
    await expect(page.getByRole("button").filter({ hasText: "Members" })).toContainText("2");
  });

  test("search filters the roster", async ({ page }) => {
    await page.getByPlaceholder(/Search people/).fill("Priya");
    await expect(page.locator('a[href^="/team/"]')).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Priya Singh/ })).toBeVisible();

    // matches title text too, not just names
    await page.getByPlaceholder(/Search people/).fill("auditor");
    await expect(page.getByRole("link", { name: /Sipho Dlamini/ })).toBeVisible();

    await page.getByPlaceholder(/Search people/).fill("zzzznone");
    await expect(page.getByText("No people match")).toBeVisible();
  });

  test("role filter narrows the roster", async ({ page }) => {
    const filter = page.getByTestId("role-filter");
    await filter.getByRole("button", { name: "Viewer", exact: true }).click();
    await expect(page.locator('a[href^="/team/"]')).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Sipho Dlamini/ })).toBeVisible();

    await filter.getByRole("button", { name: "Member", exact: true }).click();
    await expect(page.locator('a[href^="/team/"]')).toHaveCount(2);
  });

  test("a card links through to the profile", async ({ page }) => {
    await page.getByRole("link", { name: /Priya Singh/ }).click();
    await expect(page).toHaveURL(/\/team\/priya-singh$/);
    await expect(page.getByRole("heading", { name: "Priya Singh" })).toBeVisible();
  });
});

test.describe("Employee profile — role-based access (/team/[slug])", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/team/tr-mokwena");
    await expect(page.getByRole("heading", { name: "TR Mokwena" })).toBeVisible();
  });

  test("defaults to the Admin perspective", async ({ page }) => {
    await expect(page.getByTestId("viewer-role-admin")).toHaveAttribute("aria-pressed", "true");
  });

  test("Admin sees everything (tabs, compensation, contact, management)", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Performance", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Access", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Message", exact: true })).toBeVisible();
    await expect(page.getByText(COMP)).toBeVisible();
    await expect(page.getByText(EMAIL)).toBeVisible();

    await page.getByRole("button", { name: "Access", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Role & permissions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Danger zone" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Deactivate member" })).toBeVisible();
  });

  test("Lead sees performance & employment but not compensation or access", async ({ page }) => {
    await page.getByTestId("viewer-role-lead").click();
    await expect(page.getByRole("button", { name: "Performance", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Access", exact: true })).toHaveCount(0);
    await expect(page.getByText("Employee ID")).toBeVisible(); // employment card present
    await expect(page.getByText("Admins only")).toBeVisible(); // compensation masked
    await expect(page.getByText(COMP)).toHaveCount(0);
  });

  test("Member sees public profile & contact, no management or employment", async ({ page }) => {
    await page.getByTestId("viewer-role-member").click();
    await expect(page.getByRole("button", { name: "Message", exact: true })).toBeVisible();
    await expect(page.getByText(EMAIL)).toBeVisible();
    await expect(page.getByRole("button", { name: "Performance", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Access", exact: true })).toHaveCount(0);
    await expect(page.getByText("Employment details")).toBeVisible(); // locked placeholder
    await expect(page.getByText(COMP)).toHaveCount(0);
  });

  test("Viewer gets a read-only public view", async ({ page }) => {
    await page.getByTestId("viewer-role-viewer").click();
    await expect(page.getByRole("button", { name: "Message", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Performance", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Access", exact: true })).toHaveCount(0);
    await expect(page.getByText("Contact details are hidden for your role.")).toBeVisible();
    await expect(page.getByText(EMAIL)).toHaveCount(0);
    await expect(page.getByText(COMP)).toHaveCount(0);
  });

  test("switching down from Access falls back to a permitted tab", async ({ page }) => {
    await page.getByRole("button", { name: "Access", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Danger zone" })).toBeVisible();
    // dropping to Viewer removes the Access tab; page must not get stuck on it
    await page.getByTestId("viewer-role-viewer").click();
    await expect(page.getByRole("heading", { name: "Danger zone" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  });

  test("unknown member shows a not-found state", async ({ page }) => {
    await page.goto("/team/does-not-exist");
    await expect(page.getByText("Member not found")).toBeVisible();
  });
});
