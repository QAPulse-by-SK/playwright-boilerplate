import { test, expect } from "@playwright/test";
import { qaPulseAssert } from "qapulsesk-assert";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  🤖 qapulsesk-assert — AI FEATURES DEMO
 *  QA Pulse by SK · www.skakarh.com
 *
 *  These tests cover the AI-powered assertions in qapulsesk-assert:
 *    - qa.toMean()          — does this element MEAN what you think?
 *    - qa.satisfiesRule()   — does this element satisfy a business rule?
 *    - qa.pageMatchesSpec() — does the page match this specification?
 *
 *  ── HOW TO RUN ───────────────────────────────────────────────────────────────
 *
 *  These tests are SKIPPED by default.
 *  They require an Anthropic API key to run.
 *
 *  To run them:
 *    ANTHROPIC_API_KEY=your-key npx playwright test tests/packages/assert.ai.spec.ts
 *
 *  Or add to your .env file:
 *    ANTHROPIC_API_KEY=sk-ant-...
 *
 *  Then run normally:
 *    npx playwright test tests/packages/assert.ai.spec.ts --project=chromium
 *
 *  ── WHY AI ASSERTIONS? ───────────────────────────────────────────────────────
 *
 *  Standard assertions check WHAT an element contains.
 *  AI assertions check WHAT an element MEANS.
 *
 *  Standard:
 *    await expect(page.locator("#flash")).toContainText("Your account");
 *    // PASSES for "Your account has been created" AND "Your account was deleted"
 *
 *  AI-powered:
 *    await qa.toMean("#flash", "account was created successfully");
 *    // PASSES only if the message semantically means success
 *    // FAILS if it means deletion, error, or anything else
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const HAS_AI_KEY = !!process.env.ANTHROPIC_API_KEY;
const SKIP_REASON = "AI assertions require ANTHROPIC_API_KEY — set it to run these tests";

// ─────────────────────────────────────────────────────────────────────────────
//  SUITE 1 — toMean()
//  "Does this element MEAN what I think it means?"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("AI — qa.toMean() 🤖", () => {

  test.skip(!HAS_AI_KEY, SKIP_REASON);

  /**
   * toMean() uses Claude to semantically interpret an element.
   * It passes if the element's content conveys the intended meaning —
   * regardless of exact wording, phrasing, or sentence structure.
   */
  test("toMean: login success message conveys correct meaning", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "tomsmith");
    await page.fill("#password", "SuperSecretPassword!");
    await page.click("button[type='submit']");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ AI checks semantic meaning — not exact text
    // "You logged into a secure area!" → means "login was successful"
    await qa.toMean("#flash", "login was successful");
    console.log("✅ AI confirmed: flash message means 'login was successful'");
  });

  test("toMean: logout message conveys correct meaning", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "tomsmith");
    await page.fill("#password", "SuperSecretPassword!");
    await page.click("button[type='submit']");
    await page.click("a[href='/logout']");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.toMean("#flash", "user has been logged out");
    console.log("✅ AI confirmed: flash message means 'user has been logged out'");
  });

  test("toMean: error message conveys authentication failure", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "wronguser");
    await page.fill("#password", "wrongpassword");
    await page.click("button[type='submit']");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.toMean("#flash", "authentication failed");
    console.log("✅ AI confirmed: flash message means 'authentication failed'");
  });

  test("toMean: page heading conveys correct page purpose", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ "Login Page" heading → means "this is where users authenticate"
    await qa.toMean("h2", "this is a login or authentication page");
    console.log("✅ AI confirmed: heading means 'login/authentication page'");
  });

  test("toMean: SuiteCRM dashboard conveys logged-in state", async ({ page }) => {
    await page.goto("https://demo.suiteondemand.com/index.php");
    await page.fill("#user_name", "will");
    await page.fill("#username_password", "will");
    await page.click("#bigbutton");
    await page.waitForURL("**/index.php?module=Home**");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ Dashboard title means "user is logged in and on the home page"
    await qa.toMean("title", "user is logged in to the CRM");
    console.log("✅ AI confirmed: page title means 'user is logged in to CRM'");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  SUITE 2 — satisfiesRule()
//  "Does this element satisfy a business rule?"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("AI — qa.satisfiesRule() 🤖", () => {

  test.skip(!HAS_AI_KEY, SKIP_REASON);

  /**
   * satisfiesRule() checks if an element meets a business requirement.
   * More powerful than toMean() — you can express complex rules.
   */
  test("satisfiesRule: nav links are descriptive and accessible", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ Business rule: nav links must be descriptive (no "click here")
    await qa.satisfiesRule(
      "ul li a",
      "all links have descriptive text that clearly indicates their destination"
    );
    console.log("✅ AI confirmed: nav links are descriptive");
  });

  test("satisfiesRule: login form has required security elements", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ Business rule: login form must have username + password fields + submit
    await qa.satisfiesRule(
      "form",
      "contains a username field, a password field, and a submit button"
    );
    console.log("✅ AI confirmed: login form has required security elements");
  });

  test("satisfiesRule: SuiteCRM Contacts form has business-required fields", async ({ page }) => {
    await page.goto("https://demo.suiteondemand.com/index.php");
    await page.fill("#user_name", "will");
    await page.fill("#username_password", "will");
    await page.click("#bigbutton");
    await page.waitForURL("**/index.php?module=Home**");
    await page.goto("https://demo.suiteondemand.com/index.php?module=Contacts&action=EditView");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ Business rule: Contact form must capture name + contact details
    await qa.satisfiesRule(
      "form",
      "has fields for first name, last name, email address, and phone number"
    );
    console.log("✅ AI confirmed: Contact form has all required business fields");
  });

  test("satisfiesRule: error messages are user-friendly", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "wrong");
    await page.fill("#password", "wrong");
    await page.click("button[type='submit']");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ✅ Business rule: error messages should be helpful, not expose internals
    await qa.satisfiesRule(
      "#flash",
      "is a user-friendly error message that does not expose technical details or system internals"
    );
    console.log("✅ AI confirmed: error message is user-friendly");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  SUITE 3 — pageMatchesSpec()
//  "Does the whole page match this specification?"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("AI — qa.pageMatchesSpec() 🤖", () => {

  test.skip(!HAS_AI_KEY, SKIP_REASON);

  /**
   * pageMatchesSpec() evaluates the entire page against a specification.
   * Most powerful of the three — describe what the page SHOULD do/contain
   * in plain English and Claude verifies it.
   */
  test("pageMatchesSpec: login page matches authentication spec", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.pageMatchesSpec(
      `This page should:
       - Be a login or sign-in page
       - Have a form with username and password fields
       - Have a submit button to authenticate
       - Not show any sensitive system information`
    );
    console.log("✅ AI confirmed: login page matches authentication specification");
  });

  test("pageMatchesSpec: home page matches navigation spec", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.pageMatchesSpec(
      `This page should:
       - Be a home or index page for a web testing demo site
       - Have a list of links to different test scenarios
       - Have a clear heading or title
       - Be navigable without JavaScript errors`
    );
    console.log("✅ AI confirmed: home page matches navigation specification");
  });

  test("pageMatchesSpec: SuiteCRM dashboard matches CRM spec", async ({ page }) => {
    await page.goto("https://demo.suiteondemand.com/index.php");
    await page.fill("#user_name", "will");
    await page.fill("#username_password", "will");
    await page.click("#bigbutton");
    await page.waitForURL("**/index.php?module=Home**");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.pageMatchesSpec(
      `This page should:
       - Be a CRM dashboard or home page
       - Show a logged-in user interface (not a login form)
       - Have navigation to CRM modules like Contacts, Accounts, or Opportunities
       - Display business data or dashboards`
    );
    console.log("✅ AI confirmed: SuiteCRM dashboard matches CRM specification");
  });

  test("pageMatchesSpec: Contacts list matches data grid spec", async ({ page }) => {
    await page.goto("https://demo.suiteondemand.com/index.php");
    await page.fill("#user_name", "will");
    await page.fill("#username_password", "will");
    await page.click("#bigbutton");
    await page.waitForURL("**/index.php?module=Home**");
    await page.goto("https://demo.suiteondemand.com/index.php?module=Contacts&action=index");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    await qa.pageMatchesSpec(
      `This page should:
       - Show a list or grid of contacts
       - Have column headers for contact information (name, email, phone)
       - Allow users to search or filter contacts
       - Be part of a CRM or contact management system`
    );
    console.log("✅ AI confirmed: Contacts list matches data grid specification");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  SUITE 4 — AI vs Standard: Side-by-Side Comparison
//  "See exactly where AI adds value over standard assertions"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("AI vs Standard — Side by Side 📊", () => {

  test.skip(!HAS_AI_KEY, SKIP_REASON);

  test("COMPARISON: standard passes for wrong meaning, AI catches it", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    await page.fill("#username", "wronguser");
    await page.fill("#password", "wrongpassword");
    await page.click("button[type='submit']");

    const qa = qaPulseAssert(page, {
      ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
    });

    // ❌ Standard assertion — passes even for wrong reasons
    // await expect(page.locator("#flash")).toContainText("Your");
    // Would pass for "Your credentials are invalid" AND "Your login was successful"

    // ✅ AI assertion — only passes if meaning is correct
    await qa.toMean("#flash", "login failed due to invalid credentials");
    console.log("✅ COMPARISON: AI correctly identified semantic meaning of error message");
    console.log("   Standard 'toContainText' cannot distinguish success from failure");
    console.log("   AI 'toMean' understands the INTENT of the message");
  });
});
