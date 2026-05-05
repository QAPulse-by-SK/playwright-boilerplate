// @ts-check
const { BasePage } = require("../BasePage.js");

/**
 * LoginPage - Page Object for the-internet.herokuapp.com/login
 * QA Pulse by SK - www.skakarh.com
 */
class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("button[type='submit']");
    this.flashMessage = page.locator("#flash");
    this.logoutButton = page.locator("a[href='/logout']");
  }

  async open() {
    await super.open("/login");
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage() {
    return this.flashMessage.innerText();
  }

  async isLoggedIn() {
    return this.logoutButton.isVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
