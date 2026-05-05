// @ts-check
const { test, expect } = require("@playwright/test");
const { ROUTES, URLS } = require("../../../src/constants/index.js");
const { logger } = require("../../../src/utils/logger.js");

/**
 * Advanced E2E Examples
 * QA Pulse by SK - www.skakarh.com
 * Tags: @e2e @regression
 */

// ─── Network Interception ─────────────────────────────────────────────────────
test.describe("Network Interception", () => {
  test("intercept and mock API response @e2e @regression", async ({ page }) => {
    await test.step("Set up route mock", async () => {
      await page.route("**/api/users**", (route) => {
        route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ id: 1, name: "QA Pulse Mock User" }]) });
      });
    });
    await test.step("Navigate and verify", async () => {
      await page.goto(URLS.BASE);
      logger.success("Network interception test passed");
    });
  });
});

// ─── Data-Driven Tests ────────────────────────────────────────────────────────
const loginTestCases = [
  { name: "valid credentials", username: "tomsmith", password: "SuperSecretPassword!", expectedText: "secure area", tag: "@smoke" },
  { name: "invalid username", username: "baduser", password: "SuperSecretPassword!", expectedText: "username is invalid", tag: "@regression" },
  { name: "invalid password", username: "tomsmith", password: "wrongpassword", expectedText: "password is invalid", tag: "@regression" },
];

test.describe("Data-Driven Login Tests", () => {
  for (const tc of loginTestCases) {
    test(`login with ${tc.name} ${tc.tag} @e2e`, async ({ page }) => {
      await test.step("Navigate to login", async () => {
        await page.goto(`${URLS.BASE}${ROUTES.LOGIN}`);
      });
      await test.step(`Enter credentials: ${tc.name}`, async () => {
        await page.fill("#username", tc.username);
        await page.fill("#password", tc.password);
        await page.click("button[type='submit']");
      });
      await test.step("Verify result", async () => {
        const flash = await page.locator("#flash").innerText();
        expect(flash.toLowerCase()).toContain(tc.expectedText);
      });
    });
  }
});

// ─── Viewport / Responsive Tests ──────────────────────────────────────────────
const viewports = [
  { name: "Mobile",  width: 375,  height: 812  },
  { name: "Tablet",  width: 768,  height: 1024 },
  { name: "Desktop", width: 1280, height: 720  },
];

test.describe("Responsive / Viewport Tests", () => {
  for (const vp of viewports) {
    test(`home page renders on ${vp.name} @e2e @regression`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(URLS.BASE);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toBeVisible();
      logger.success(`${vp.name} (${vp.width}x${vp.height}) ✅`);
    });
  }
});

// ─── JavaScript Alerts ────────────────────────────────────────────────────────
test.describe("JavaScript Alerts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${URLS.BASE}${ROUTES.JAVASCRIPT_ALERTS}`);
  });

  test("handle JS alert — accept @e2e @regression", async ({ page }) => {
    page.on("dialog", (dialog) => { expect(dialog.type()).toBe("alert"); dialog.accept(); });
    await page.click("button[onclick='jsAlert()']");
    const result = await page.locator("#result").innerText();
    expect(result).toContain("You successfully clicked an alert");
  });

  test("handle JS confirm — dismiss @e2e @regression", async ({ page }) => {
    page.on("dialog", (dialog) => { expect(dialog.type()).toBe("confirm"); dialog.dismiss(); });
    await page.click("button[onclick='jsConfirm()']");
    const result = await page.locator("#result").innerText();
    expect(result).toContain("You clicked: Cancel");
  });
});

// ─── Drag and Drop ────────────────────────────────────────────────────────────
test.describe("Drag and Drop", () => {
  test("drag element A to position B @e2e @regression", async ({ page }) => {
    await page.goto(`${URLS.BASE}${ROUTES.DRAG_AND_DROP}`);
    const colA = await page.locator("#column-a header").innerText();
    expect(colA).toBe("A");
    await page.locator("#column-a").dragTo(page.locator("#column-b"));
    const newColA = await page.locator("#column-a header").innerText();
    expect(newColA).toBe("B");
  });
});
