// @ts-check
/**
 * Wait Helpers
 * QA Pulse by SK - www.skakarh.com
 */

/**
 * @param {import('@playwright/test').Page} page
 * @param {string | RegExp} urlPattern
 * @param {number} timeout
 */
async function waitForUrl(page, urlPattern, timeout = 10000) {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} text
 * @param {number} timeout
 */
async function waitForText(page, text, timeout = 10000) {
  await page.getByText(text).waitFor({ state: "visible", timeout });
}

/** @param {number} ms */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { waitForUrl, waitForText, sleep };
