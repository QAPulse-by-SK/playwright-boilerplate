// @ts-check
const { test: base } = require("@playwright/test");
const { HomePage } = require("../pages/example/HomePage.js");
const { LoginPage } = require("../pages/example/LoginPage.js");

/**
 * Page Fixtures — Single import for all page objects
 * QA Pulse by SK - www.skakarh.com
 *
 * Usage:
 *   const { test, expect } = require("../../src/fixtures/pageFixture.js");
 *   test("my test", async ({ homePage, loginPage }) => { ... });
 */
const test = base.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

const { expect } = require("@playwright/test");

module.exports = { test, expect };
