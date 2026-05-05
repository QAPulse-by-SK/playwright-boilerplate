// @ts-check
const { logger } = require("./src/utils/logger.js");

/**
 * Global Teardown — Runs ONCE after the entire test suite
 * QA Pulse by SK - www.skakarh.com
 */
async function globalTeardown() {
  logger.info("Global teardown running...");
  logger.success("Test suite complete. Report: playwright-report/index.html");
  logger.info("Allure report: npm run report:allure");
}

module.exports = globalTeardown;
