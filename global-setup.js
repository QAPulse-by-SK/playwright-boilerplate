// @ts-check
const { chromium } = require("@playwright/test");
const { CREDENTIALS, ROUTES, URLS } = require("./src/constants/index.js");
const { logger } = require("./src/utils/logger.js");
const fs = require("fs");

/**
 * Global Setup — Runs ONCE before the entire test suite
 * QA Pulse by SK - www.skakarh.com
 */
async function globalSetup() {
  logger.info("Global setup starting...");

  // Create output directories
  const dirs = [".auth", "test-results", "test-results/artifacts", "playwright-report", "allure-results"];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  }

  // Save authenticated state
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    logger.step("Logging in to save auth state...");
    await page.goto(`${URLS.BASE}${ROUTES.LOGIN}`);
    await page.fill("#username", CREDENTIALS.VALID.username);
    await page.fill("#password", CREDENTIALS.VALID.password);
    await page.click("button[type='submit']");
    await page.waitForURL(`**${ROUTES.SECURE}`);
    await page.context().storageState({ path: ".auth/user.json" });
    logger.success("Auth state saved to .auth/user.json");
  } catch (error) {
    logger.warn("Could not save auth state — tests will login individually");
  } finally {
    await browser.close();
  }

  logger.success("Global setup complete ✅");
}

module.exports = globalSetup;
