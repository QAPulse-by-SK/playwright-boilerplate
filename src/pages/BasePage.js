// @ts-check
/**
 * BasePage - Base class for all Page Objects
 * QA Pulse by SK - www.skakarh.com
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** @param {string} path */
  async open(path = "/") {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /** @param {string} name */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

module.exports = { BasePage };
