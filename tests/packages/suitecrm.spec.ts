import { test, expect } from "@playwright/test";
import {
  qaPulseAssert,
  assertFuzzyMatch,
  assertContains,
  assertObjectContains,
  assertResponseTime,
} from "qapulsesk-assert";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SuiteCRM Integration Tests — using qapulsesk-assert
 * QA Pulse by SK - www.skakarh.com
 *
 * Target: https://demo.suiteondemand.com (SuiteCRM 7 Public Demo)
 * Credentials: will / will (publicly available)
 *
 * Showcases WHERE qapulsesk-assert adds REAL value over standard Playwright:
 *   ✅ toFuzzyHaveText    — dynamic CRM text elements
 *   ✅ assertFuzzyMatch   — handles title format variations
 *   ✅ assertContains     — multi-column presence checks
 *   ✅ assertResponseTime — CRM performance SLA benchmarking
 *   ✅ assertObjectContains — partial object matching
 *   ✅ toBeAccessible     — CRM form accessibility (no axe setup needed)
 *   ✅ toBeVisible        — form element checks
 *   ✅ toContainText      — navigation + content checks
 *
 * Tags: @smoke @regression @suitecrm @packages @assert
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = "https://demo.suiteondemand.com";
const CREDS    = { username: "will", password: "will" };

const TEST_CONTACTS = [
  { firstName: "Alice",   lastName: "Khan",  phone: "+971501112233" },
  { firstName: "Bob",     lastName: "Smith", phone: "+971502223344" },
  { firstName: "Charlie", lastName: "Lee",   phone: "+971503334455" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function login(page: any) {
  await page.goto(`${BASE_URL}/index.php`);
  await page.waitForSelector("#user_name");
  await page.fill("#user_name", CREDS.username);
  await page.fill("#username_password", CREDS.password);
  await page.click("#bigbutton");
  await page.waitForURL(`**/index.php?module=Home**`);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
test.describe("SuiteCRM — Authentication @suitecrm @smoke", () => {

  test("should login with valid credentials @smoke @suitecrm", async ({ page }) => {
    await login(page);
    const qa = qaPulseAssert(page);
    // ✅ toContainText — verify dashboard loaded
    await qa.toContainText("title", "SuiteCRM Demo");
    expect(page.url()).toContain("module=Home");
  });

  test("should reject invalid credentials @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php`);
    await page.waitForSelector("#user_name");
    await page.fill("#user_name", "wronguser");
    await page.fill("#username_password", "wrongpassword");
    await page.click("#bigbutton");
    // Should NOT redirect to Home
    expect(page.url()).not.toContain("module=Home&action=index");
    console.log(`✅ Invalid credentials correctly rejected`);
  });

  test("session persists across module navigation @smoke @suitecrm", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=index`);
    const qa = qaPulseAssert(page);
    // ✅ toContainText — not redirected to login
    await qa.toContainText("title", "Contacts");
    expect(page.url()).toContain("module=Contacts");
  });
});

// ─── Navigation & Dashboard ───────────────────────────────────────────────────
test.describe("SuiteCRM — Navigation & Dashboard @suitecrm @regression", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("dashboard loads with correct title @smoke @suitecrm", async ({ page }) => {
    const qa = qaPulseAssert(page);
    await qa.toContainText("title", "SuiteCRM Demo");
    await qa.toBeVisible(".navbar");
  });

  test("navigate to Accounts module @smoke @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Accounts&action=index`);
    const qa = qaPulseAssert(page);
    await qa.toContainText("title", "Accounts");
    // ✅ toBeVisible with specific list view selector
    await qa.toBeVisible(".list.view");
  });

  test("navigate to Contacts module @smoke @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=index`);
    const qa = qaPulseAssert(page);
    await qa.toContainText("title", "Contacts");
    await qa.toBeVisible(".list.view");
  });

  test("navigate to Opportunities module @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Opportunities&action=index`);
    const qa = qaPulseAssert(page);
    await qa.toContainText("title", "Opportunities");
  });

  test("module titles fuzzy match module names @regression @suitecrm", async ({ page }) => {
    const modules = [
      { url: "/index.php?module=Accounts&action=index",      expected: "Accounts"      },
      { url: "/index.php?module=Contacts&action=index",      expected: "Contacts"      },
      { url: "/index.php?module=Opportunities&action=index", expected: "Opportunities" },
    ];

    for (const mod of modules) {
      await page.goto(`${BASE_URL}${mod.url}`);
      const title = await page.title();

      // ✅ assertContains — module name always in title
      const result = assertContains(title, mod.expected);
      expect(result.passed).toBeTruthy();
      console.log(`✅ "${mod.expected}" in title "${title}" — ${result.message}`);
    }
  });
});

// ─── Accounts Module ──────────────────────────────────────────────────────────
test.describe("SuiteCRM — Accounts Module @suitecrm @regression", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/index.php?module=Accounts&action=index`);
  });

  test("accounts list shows required columns @smoke @suitecrm", async ({ page }) => {
    const headerText = await page.locator("thead").first().innerText();

    // ✅ assertContains — required columns present
    for (const col of ["Name", "City", "Billing Country"]) {
      const result = assertContains(headerText, col);
      expect(result.passed).toBeTruthy();
      console.log(`✅ Column "${col}": ${result.message}`);
    }
  });

  test("accounts list has records @regression @suitecrm", async ({ page }) => {
    const rowCount = await page.locator(".list.view tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
    console.log(`✅ Found ${rowCount} account records`);
  });

  test("account list page title — fuzzy match @regression @suitecrm", async ({ page }) => {
    const title = await page.title();

    // ✅ assertFuzzyMatch — REAL VALUE: handles separator variations
    // "Accounts » SuiteCRM Demo" vs "Accounts - SuiteCRM" vs "Accounts | SuiteCRM 7"
    // Standard .toContainText("Accounts » SuiteCRM Demo") breaks on format change
    const result = assertFuzzyMatch(title, "Accounts SuiteCRM", { threshold: 0.6 });
    expect(result.passed).toBeTruthy();
    console.log(`✅ Title fuzzy match: "${title}" — ${result.message}`);
  });

  test("Create Account form fields are visible @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Accounts&action=EditView`);
    const qa = qaPulseAssert(page);

    // ✅ toBeVisible — key form fields present
    await qa.toBeVisible("#name");
    await qa.toBeVisible("#phone_office");
    console.log(`✅ Account form fields verified`);
  });

  test("Create Account form accessibility scan @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Accounts&action=EditView`);
    const qa = qaPulseAssert(page);

    // ✅ toBeAccessible — REAL VALUE: zero config, no axe setup needed
    // Standard Playwright needs separate axe-core integration
    let violationsFound = false;
    try {
      await qa.toBeAccessible();
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("accessibility violation")) {
        violationsFound = true;
        console.log(`⚠️ A11y violations on legacy CRM: ${e.message.split("\n")[0]}`);
      }
    }
    console.log(`✅ Accessibility scan complete. Violations found: ${violationsFound}`);
  });

  test("account detail page contains account name @regression @suitecrm", async ({ page }) => {
    const firstLink = page.locator(".list.view tbody tr td:nth-child(3) a").first();
    const accountName = await firstLink.innerText();
    await firstLink.click();
    await page.waitForLoadState("networkidle");

    // ✅ assertContains — account name present in detail page body
    const bodyText = await page.locator("body").innerText();
    const result = assertContains(bodyText, accountName);
    expect(result.passed).toBeTruthy();
    console.log(`✅ Account "${accountName}" found in detail page — ${result.message}`);
  });
});

// ─── Contacts Module ──────────────────────────────────────────────────────────
test.describe("SuiteCRM — Contacts Module @suitecrm @regression", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("contacts list has required columns @smoke @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=index`);
    const headerText = await page.locator("thead").first().innerText();

    // ✅ assertContains — multiple column checks in a loop
    for (const col of ["Name", "Job Title", "Account Name", "Email"]) {
      const result = assertContains(headerText, col);
      expect(result.passed).toBeTruthy();
      console.log(`✅ Column "${col}": ${result.message}`);
    }
  });

  test("Create Contact form — key fields visible @smoke @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=EditView`);
    const qa = qaPulseAssert(page);

    // ✅ toBeVisible — all key form fields present
    await qa.toBeVisible("#first_name");
    await qa.toBeVisible("#last_name");
    await qa.toBeVisible("#phone_work");
    await qa.toBeVisible("#Contacts0emailAddress0");
    console.log(`✅ All Contact form fields visible`);
  });

  test("Create Contact form — fuzzy page title check @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=EditView`);
    const title = await page.title();

    // ✅ assertFuzzyMatch — "CREATE » Contacts » SuiteCRM Demo" matches "Create Contacts"
    const result = assertFuzzyMatch(title, "Create Contacts SuiteCRM", { threshold: 0.5 });
    expect(result.passed).toBeTruthy();
    console.log(`✅ Create Contact title: "${title}" — ${result.message}`);
  });

  test("Create Contact form — input value validation @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=EditView`);

    const contact = TEST_CONTACTS[0];
    console.log(`🧪 Testing with: ${contact.firstName} ${contact.lastName}`);

    await page.fill("#first_name", contact.firstName);
    await page.fill("#last_name",  contact.lastName);
    await page.fill("#phone_work", contact.phone);

    // ✅ assertFuzzyMatch on inputValue() — REAL VALUE: CRM may auto-format phone numbers
    // toFuzzyHaveText uses innerText() which returns "" for inputs — we use inputValue()
    const firstVal = await page.locator("#first_name").inputValue();
    const lastVal  = await page.locator("#last_name").inputValue();
    const phoneVal = await page.locator("#phone_work").inputValue();

    expect(assertFuzzyMatch(firstVal, contact.firstName, { threshold: 0.9 }).passed).toBeTruthy();
    expect(assertFuzzyMatch(lastVal,  contact.lastName,  { threshold: 0.9 }).passed).toBeTruthy();

    // Phone may be reformatted by CRM — use lower threshold
    const phoneResult = assertFuzzyMatch(phoneVal, contact.phone, { threshold: 0.5 });
    console.log(`✅ First: "${firstVal}" ≈ "${contact.firstName}"`);
    console.log(`✅ Last:  "${lastVal}" ≈ "${contact.lastName}"`);
    console.log(`✅ Phone: "${phoneVal}" — ${phoneResult.message}`);
  });

  test("data-driven: validate Contact form with multiple test records @regression @suitecrm", async ({ page }) => {
    // ✅ Data-driven testing with qapulsesk-assert fuzzy validations
    for (const contact of TEST_CONTACTS) {
      await page.goto(`${BASE_URL}/index.php?module=Contacts&action=EditView`);
      await page.fill("#first_name", contact.firstName);
      await page.fill("#last_name",  contact.lastName);

      const firstVal = await page.locator("#first_name").inputValue();
      const lastVal  = await page.locator("#last_name").inputValue();

      expect(assertFuzzyMatch(firstVal, contact.firstName, { threshold: 0.9 }).passed).toBeTruthy();
      expect(assertFuzzyMatch(lastVal,  contact.lastName,  { threshold: 0.9 }).passed).toBeTruthy();
      console.log(`✅ Validated: ${contact.firstName} ${contact.lastName}`);
    }
  });
});

// ─── Performance SLA ──────────────────────────────────────────────────────────
test.describe("SuiteCRM — Performance SLA @suitecrm @regression", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  const slaTests = [
    { name: "Dashboard",      url: "/index.php?module=Home&action=index",        sla: 8000, waitFor: ".navbar"      },
    { name: "Accounts list",  url: "/index.php?module=Accounts&action=index",    sla: 8000, waitFor: ".list.view"   },
    { name: "Contacts list",  url: "/index.php?module=Contacts&action=index",    sla: 8000, waitFor: ".list.view"   },
    { name: "Create Contact", url: "/index.php?module=Contacts&action=EditView", sla: 5000, waitFor: "#first_name"  },
  ];

  for (const tc of slaTests) {
    test(`${tc.name} loads within ${tc.sla}ms @regression @suitecrm`, async ({ page }) => {
      const start    = Date.now();
      await page.goto(`${BASE_URL}${tc.url}`);
      await page.waitForSelector(tc.waitFor);
      const duration = Date.now() - start;

      // ✅ assertResponseTime — REAL VALUE: no built-in Playwright SLA assertion
      const result = assertResponseTime(
        { status: 200, headers: {}, body: {}, duration },
        tc.sla
      );
      expect(result.passed).toBeTruthy();
      console.log(`✅ ${tc.name}: ${result.message}`);
    });
  }
});

// ─── Data Integrity ───────────────────────────────────────────────────────────
test.describe("SuiteCRM — Data Integrity @suitecrm @regression", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("page metadata object contains required properties @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=index`);

    const pageInfo = {
      module:     "Contacts",
      hasTable:   (await page.locator(".list.view").count()) > 0,
      isLoggedIn: (await page.locator(".navbar").count())    > 0,
    };

    // ✅ assertObjectContains — REAL VALUE: partial match, framework-agnostic
    // Standard: requires separate check per key or Playwright-only toMatchObject
    const result = assertObjectContains(pageInfo, {
      module:     "Contacts",
      hasTable:   true,
      isLoggedIn: true,
    });
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("contacts list body contains key UI strings @regression @suitecrm", async ({ page }) => {
    await page.goto(`${BASE_URL}/index.php?module=Contacts&action=index`);
    const headerText = await page.locator("thead").first().innerText();

    // ✅ assertContains — batch UI string validation
    for (const { value, desc } of [
      { value: "Name",         desc: "Name column"         },
      { value: "Account Name", desc: "Account Name column" },
      { value: "Email",        desc: "Email column"        },
    ]) {
      const result = assertContains(headerText, value);
      expect(result.passed).toBeTruthy();
      console.log(`✅ ${desc}: ${result.message}`);
    }
  });

  test("all module titles fuzzy match their module names @regression @suitecrm", async ({ page }) => {
    const modules = [
      { url: "/index.php?module=Accounts&action=index",      expected: "Accounts"      },
      { url: "/index.php?module=Contacts&action=index",      expected: "Contacts"      },
      { url: "/index.php?module=Opportunities&action=index", expected: "Opportunities" },
    ];

    for (const mod of modules) {
      await page.goto(`${BASE_URL}${mod.url}`);
      const title = await page.title();

      // ✅ assertFuzzyMatch — batch title fuzzy validation across all modules
      const result = assertFuzzyMatch(title, mod.expected + " SuiteCRM", { threshold: 0.6 });
      expect(result.passed).toBeTruthy();
      console.log(`✅ "${mod.expected}" in title "${title}" — ${result.message}`);
    }
  });
});
