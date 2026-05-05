// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Component Tests - NavBar
 * QA Pulse by SK - www.skakarh.com
 * Tags: @component @regression
 */
test.describe("NavBar Component - skakarh.com", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.skakarh.com");
    await page.waitForLoadState("networkidle");
  });

  test("navbar should be visible on page load @component @smoke", async ({ page }) => {
    const nav = page.locator("nav, header").first();
    await expect(nav).toBeVisible();
  });

  test("navbar should contain navigation links @component @regression", async ({ page }) => {
    const navLinks = page.locator("nav a, header a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
