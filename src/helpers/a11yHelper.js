// @ts-check
const { expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

/**
 * A11y Helper - Accessibility Testing Utilities
 * QA Pulse by SK - www.skakarh.com
 */

const IMPACT_ORDER = ["minor", "moderate", "serious", "critical"];

/**
 * @param {{ impact?: string }} violation
 * @param {string} min
 */
function impactAtLeast(violation, min) {
  const vIdx = IMPACT_ORDER.indexOf(violation.impact || "");
  const mIdx = IMPACT_ORDER.indexOf(min);
  return vIdx >= mIdx;
}

class A11yHelper {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  buildAxe(options = {}) {
    const { tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"], include, exclude = [], disableRules = [] } = options;
    let builder = new AxeBuilder({ page: this.page }).withTags(tags);
    if (include) builder = builder.include(include);
    if (exclude.length > 0) builder = builder.exclude(exclude.join(", "));
    if (disableRules.length > 0) builder = builder.disableRules(disableRules);
    return builder;
  }

  async scan(options = {}) {
    await this.page.waitForLoadState("networkidle");
    return this.buildAxe(options).analyze();
  }

  async assertNoViolations(options = {}) {
    const results = await this.scan(options);
    const { minImpact } = options;
    const violations = minImpact
      ? results.violations.filter((v) => impactAtLeast(v, minImpact))
      : results.violations;
    if (violations.length > 0) console.error("\n" + this.formatViolations(violations));
    expect(violations, `Found ${violations.length} accessibility violation(s):\n${this.formatViolations(violations)}`).toHaveLength(0);
  }

  async assertNoCriticalViolations(options = {}) {
    await this.assertNoViolations({ ...options, minImpact: "critical" });
  }

  async assertNoSeriousViolations(options = {}) {
    await this.assertNoViolations({ ...options, minImpact: "serious" });
  }

  /** @param {string} selector */
  async assertComponentAccessible(selector, options = {}) {
    await this.assertNoViolations({ ...options, include: selector });
  }

  /** @param {number} maxTabs */
  async assertKeyboardNavigable(maxTabs = 20) {
    await this.page.keyboard.press("Tab");
    for (let i = 0; i < maxTabs; i++) {
      const isInteractive = await this.page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;
        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute("role");
        const tabindex = el.getAttribute("tabindex");
        const interactiveTags = ["a", "button", "input", "select", "textarea", "details"];
        return interactiveTags.includes(tag) ||
          ["button", "link", "menuitem", "tab", "checkbox", "radio"].includes(role || "") ||
          (tabindex !== null && parseInt(tabindex) >= 0);
      });
      if (!isInteractive) break;
      await this.page.keyboard.press("Tab");
    }
  }

  /** @param {string} selector */
  async assertFocusedElement(selector) {
    const isFocused = await this.page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el === document.activeElement;
    }, selector);
    expect(isFocused, `Expected element "${selector}" to be focused`).toBeTruthy();
  }

  async assertImagesHaveAltText() {
    const images = await this.page.$$("img");
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");
      expect(alt, `Image missing alt: src="${src}"`).not.toBeNull();
    }
  }

  async assertFormLabels() {
    const violations = await this.page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button])"));
      return inputs.filter((input) => {
        const id = input.getAttribute("id");
        const ariaLabel = input.getAttribute("aria-label");
        const ariaLabelledBy = input.getAttribute("aria-labelledby");
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        return !label && !ariaLabel && !ariaLabelledBy;
      }).map((el) => el.outerHTML);
    });
    expect(violations, `${violations.length} input(s) without labels`).toHaveLength(0);
  }

  async assertSingleH1() {
    const h1Count = await this.page.locator("h1").count();
    expect(h1Count, `Page should have 1 <h1>, found ${h1Count}`).toBe(1);
  }

  async assertAriaLandmarks() {
    const hasMain = (await this.page.locator("main, [role='main']").count()) > 0;
    expect(hasMain, "Page missing <main> landmark").toBeTruthy();
    const hasNav = (await this.page.locator("nav, [role='navigation']").count()) > 0;
    expect(hasNav, "Page missing <nav> landmark").toBeTruthy();
  }

  formatViolations(violations) {
    if (violations.length === 0) return "✅ No accessibility violations found.";
    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `  ♿ Accessibility Violations — QA Pulse by SK`,
      `  Found: ${violations.length} violation(s)`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
    violations.forEach((v, idx) => {
      lines.push(`\n  [${idx + 1}] ${v.id.toUpperCase()} — Impact: ${(v.impact || "unknown").toUpperCase()}`);
      lines.push(`      Description : ${v.description}`);
      lines.push(`      Help        : ${v.helpUrl}`);
      lines.push(`      Nodes: ${v.nodes.length}`);
      v.nodes.slice(0, 3).forEach((node) => {
        lines.push(`        → ${node.html}`);
        if (node.failureSummary) lines.push(`          Fix: ${node.failureSummary.split("\n")[0]}`);
      });
    });
    lines.push("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return lines.join("\n");
  }
}

module.exports = { A11yHelper };
