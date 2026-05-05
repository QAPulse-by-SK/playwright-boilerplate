// @ts-check
const { BaseComponent } = require("../pages/BaseComponent.js");

/**
 * NavBar Component
 * QA Pulse by SK - www.skakarh.com
 */
class NavBar extends BaseComponent {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').Locator} root
   */
  constructor(page, root) {
    super(page, root);
  }
}

module.exports = { NavBar };
