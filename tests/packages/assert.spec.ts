import { test, expect } from "@playwright/test";
import {
  qaPulseAssert,
  assertFuzzyMatch,
  assertContains,
  assertMatches,
  assertApproximately,
  assertArrayContains,
  assertObjectContains,
  assertStatus,
  assertSuccess,
  assertBodyContains,
  assertResponseTime,
  assertSchema,
} from "qapulsesk-assert";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * QAPulseSK-Assert Integration Tests
 * QA Pulse by SK - www.skakarh.com
 *
 * Tests every assertion method from qapulsesk-assert against real sites:
 *   - the-internet.herokuapp.com (E2E)
 *   - jsonplaceholder.typicode.com (API)
 *
 * Tags: @smoke @packages @assert @regression
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Playwright Page Assertions ───────────────────────────────────────────────
test.describe("QAPulseSK-Assert — Playwright Adapter @packages @assert", () => {
  test("toBeVisible — element visibility check @smoke @assert", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    const qa = qaPulseAssert(page);
    await qa.toBeVisible("#username");
    await qa.toBeVisible("#password");
    await qa.toBeVisible("button[type='submit']");
  });

  test("toContainText — text content assertion @smoke @assert", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    const qa = qaPulseAssert(page);
    await qa.toContainText("h2", "Login Page");
  });

  test("toFuzzyHaveText — fuzzy text match (handles typos) @regression @assert", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com");
    const qa = qaPulseAssert(page);
    // "Welcome to the-internet" — fuzzy match allows small differences
    await qa.toFuzzyHaveText("h1", "Welcome to the internet", { threshold: 0.7 });
  });

  test("toFuzzyHaveText — strict fuzzy match @regression @assert", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    const qa = qaPulseAssert(page);
    await qa.toFuzzyHaveText("h2", "Login Page", { threshold: 0.9 });
  });

  test("toBeAccessible — correctly detects real a11y violations @regression @assert", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/login");
    const qa = qaPulseAssert(page);
    let detectedViolation = false;
    try {
      await qa.toBeAccessible();
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("accessibility violation")) {
        detectedViolation = true;
        console.log(`✅ QAPulseSK-Assert correctly detected: ${e.message}`);
      }
    }
    expect(detectedViolation).toBeTruthy();
  });
});

// ─── Fuzzy Assertions (Framework-agnostic) ────────────────────────────────────
test.describe("QAPulseSK-Assert — Fuzzy Assertions @packages @assert", () => {
  test("assertFuzzyMatch — exact match @smoke @assert", async () => {
    const result = assertFuzzyMatch("Hello World", "Hello World");
    expect(result.passed).toBeTruthy();
  });

  test("assertFuzzyMatch — typo tolerance @regression @assert", async () => {
    // "Welcom to the internet" vs "Welcome to the internet" — small typo
    const result = assertFuzzyMatch("Welcom to the internet", "Welcome to the internet", { threshold: 0.8 });
    expect(result.passed).toBeTruthy();
    console.log(`✅ Fuzzy similarity: ${result.message}`);
  });

  test("assertFuzzyMatch — fails below threshold @regression @assert", async () => {
    const result = assertFuzzyMatch("completely different text", "Hello World", { threshold: 0.8 });
    expect(result.passed).toBeFalsy();
    console.log(`✅ Correctly failed: ${result.message}`);
  });

  test("assertContains — substring check @smoke @assert", async () => {
    const result = assertContains("Welcome to the-internet", "the-internet");
    expect(result.passed).toBeTruthy();
  });

  test("assertContains — case insensitive @regression @assert", async () => {
    const result = assertContains("WELCOME TO THE-INTERNET", "welcome");
    expect(result.passed).toBeTruthy();
  });

  test("assertMatches — regex pattern @regression @assert", async () => {
    const result = assertMatches("user@example.com", /^[\w.-]+@[\w.-]+\.\w+$/);
    expect(result.passed).toBeTruthy();
  });

  test("assertApproximately — number within tolerance @regression @assert", async () => {
    const result = assertApproximately(99.8, 100, 0.5);
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertApproximately — fails outside tolerance @regression @assert", async () => {
    const result = assertApproximately(95, 100, 2);
    expect(result.passed).toBeFalsy();
  });

  test("assertArrayContains — item in array @regression @assert", async () => {
    const result = assertArrayContains([1, 2, 3, 4, 5], 3);
    expect(result.passed).toBeTruthy();
  });

  test("assertObjectContains — object properties @regression @assert", async () => {
    const result = assertObjectContains(
      { id: 1, title: "QA Pulse", status: "active" },
      { title: "QA Pulse", status: "active" }
    );
    expect(result.passed).toBeTruthy();
  });

  test("assertObjectContains — fails on mismatch @regression @assert", async () => {
    const result = assertObjectContains(
      { id: 1, title: "QA Pulse" },
      { title: "Wrong Title" }
    );
    expect(result.passed).toBeFalsy();
    console.log(`✅ Correctly failed: ${result.message}`);
  });
});

// ─── API Assertions ───────────────────────────────────────────────────────────
test.describe("QAPulseSK-Assert — API Assertions @packages @assert @api", () => {
  test("assertStatus — exact status code @smoke @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const body = await res.json();
    const result = assertStatus(
      { status: res.status(), headers: {}, body },
      200
    );
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertSuccess — 2xx status range @smoke @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts");
    const body = await res.json();
    const result = assertSuccess({ status: res.status(), headers: {}, body });
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertSuccess — fails on 404 @regression @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/99999");
    const body = await res.json();
    const result = assertSuccess({ status: res.status(), headers: {}, body });
    expect(result.passed).toBeFalsy();
    console.log(`✅ Correctly detected non-success: ${result.message}`);
  });

  test("assertBodyContains — response body fields @smoke @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const body = await res.json();
    const result = assertBodyContains(
      { status: res.status(), headers: {}, body },
      { id: 1, userId: 1 }
    );
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertSchema — response schema validation @regression @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const body = await res.json();
    const result = assertSchema(
      { status: res.status(), headers: {}, body },
      { id: "number", userId: "number", title: "string", body: "string" }
    );
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertResponseTime — performance assertion @regression @assert @api", async ({ request }) => {
    const start = Date.now();
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const duration = Date.now() - start;
    const body = await res.json();
    const result = assertResponseTime(
      { status: res.status(), headers: {}, body, duration },
      5000 // 5 second max
    );
    expect(result.passed).toBeTruthy();
    console.log(`✅ ${result.message}`);
  });

  test("assertBodyContains — fails on wrong values @regression @assert @api", async ({ request }) => {
    const res = await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const body = await res.json();
    const result = assertBodyContains(
      { status: res.status(), headers: {}, body },
      { id: 999 } // Wrong ID
    );
    expect(result.passed).toBeFalsy();
    console.log(`✅ Correctly detected mismatch: ${result.message}`);
  });
});
