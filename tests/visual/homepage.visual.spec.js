// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Visual Regression Tests
 * QA Pulse by SK - www.skakarh.com
 * Tags: @visual @regression
 */
test.describe("Visual Regression - skakarh.com", () => {
  test("homepage should match visual snapshot @visual @regression", async ({ page }) => {
    await page.goto("https://www.skakarh.com");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("skakarh-homepage.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("the-internet homepage should match snapshot @visual @regression", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("internet-homepage.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
