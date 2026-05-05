// @ts-check
const { test, expect } = require("../../src/fixtures/pageFixture.js");

/**
 * E2E Tests - Home Page
 * QA Pulse by SK - www.skakarh.com
 * Tags: @smoke @e2e @regression
 */
test.describe("Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test("should display the correct heading @smoke @e2e", async ({ homePage }) => {
    const heading = await homePage.getHeadingText();
    expect(heading).toContain("Welcome to the-internet");
  });

  test("should display available example links @regression @e2e", async ({ homePage }) => {
    const links = await homePage.getAllLinkTexts();
    expect(links.length).toBeGreaterThan(0);
  });

  test("should navigate to login page @smoke @e2e @critical", async ({ homePage, page }) => {
    await homePage.clickLink("Form Authentication");
    await expect(page).toHaveURL(/.*login/);
  });
});
