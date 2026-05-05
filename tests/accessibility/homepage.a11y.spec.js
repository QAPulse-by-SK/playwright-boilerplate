// @ts-check
const { test, expect } = require("@playwright/test");
const { A11yHelper } = require("../../src/helpers/a11yHelper.js");

/**
 * Accessibility Tests
 * QA Pulse by SK - www.skakarh.com
 * Tags: @a11y @regression
 */
test.describe("A11y — skakarh.com", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BRAND_URL || "https://www.skakarh.com");
    await page.waitForLoadState("networkidle");
  });

  test("full WCAG 2.1 AA scan — no violations @a11y @regression @critical", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertNoViolations({ tags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  test("no critical or serious violations @a11y @smoke @critical", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertNoSeriousViolations();
  });

  test("all images have alt text @a11y @regression", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertImagesHaveAltText();
  });

  test("page has a single H1 @a11y @regression", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertSingleH1();
  });

  test("ARIA landmarks present @a11y @regression", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertAriaLandmarks();
  });
});

test.describe("A11y — Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.waitForLoadState("networkidle");
  });

  test("login form — no critical violations @a11y @smoke @critical", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertNoCriticalViolations({ tags: ["wcag2a", "wcag2aa"] });
  });

  test("login form inputs have labels @a11y @regression", async ({ page }) => {
    const a11y = new A11yHelper(page);
    await a11y.assertFormLabels();
  });

  test("keyboard Tab order is correct @a11y @regression", async ({ page }) => {
    await page.keyboard.press("Tab");
    const usernameIsFocused = await page.evaluate(() => document.activeElement?.getAttribute("id") === "username");
    expect(usernameIsFocused, "First Tab should focus #username").toBeTruthy();

    await page.keyboard.press("Tab");
    const passwordIsFocused = await page.evaluate(() => document.activeElement?.getAttribute("id") === "password");
    expect(passwordIsFocused, "Second Tab should focus #password").toBeTruthy();
  });

  test("can submit login form with keyboard only @a11y @regression", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.type("tomsmith");
    await page.keyboard.press("Tab");
    await page.keyboard.type("SuperSecretPassword!");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/secure");
  });
});
