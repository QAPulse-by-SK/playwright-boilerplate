// @ts-check
/**
 * BaseComponent - Base class for reusable page components
 * QA Pulse by SK - www.skakarh.com
 */
class BaseComponent {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').Locator} root
   */
  constructor(page, root) {
    this.page = page;
    this.root = root;
  }

  async isVisible() {
    return this.root.isVisible();
  }

  async waitForVisible() {
    await this.root.waitFor({ state: "visible" });
  }
}

module.exports = { BaseComponent };
