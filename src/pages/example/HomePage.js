// @ts-check
const { BasePage } = require("../BasePage.js");
const { NavBar } = require("../../components/NavBar.js");

/**
 * HomePage - Page Object for the-internet.herokuapp.com
 * QA Pulse by SK - www.skakarh.com
 */
class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.locator("h1.heading");
    this.links = page.locator("ul li a");
    this.navBar = new NavBar(page, page.locator("body"));
  }

  async open() {
    await super.open("/");
  }

  async getHeadingText() {
    return this.heading.innerText();
  }

  async getAllLinkTexts() {
    return this.links.allInnerTexts();
  }

  /** @param {string} linkText */
  async clickLink(linkText) {
    await this.page.getByRole("link", { name: linkText }).click();
  }
}

module.exports = { HomePage };
