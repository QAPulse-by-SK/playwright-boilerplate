# qapulsesk-assert vs Standard Assertions
**QA Pulse by SK** · www.skakarh.com

> A honest, side-by-side comparison of what standard assertion libraries offer
> vs what `qapulsesk-assert` uniquely adds for real-world QA automation.

---

## 📦 Standard Libraries Compared

| Library | Standard Assertions |
|---|---|
| Playwright `expect` | Built-in, Playwright-only |
| Cypress `expect` / `should` | Built-in, Cypress-only |
| Jest `expect` | Built-in, Jest-only |
| Chai `assert` | Universal, basic types |

**The problem:** Every framework has its own assertion API. You learn one, switch project, learn another.
**qapulsesk-assert** gives you **one API** that works across all of them.

---

## 🔍 Feature-by-Feature Comparison

---

### 1. Element Visibility

**Standard Playwright:**
```typescript
await expect(page.locator("#username")).toBeVisible();
```

**qapulsesk-assert:**
```typescript
const qa = qaPulseAssert(page);
await qa.toBeVisible("#username");
```

**Verdict:** ⚠️ Marginal difference. Same result, slightly cleaner API.

---

### 2. Text Content

**Standard Playwright:**
```typescript
await expect(page.locator("h2")).toContainText("Login Page");
```

**qapulsesk-assert:**
```typescript
await qa.toContainText("h2", "Login Page");
```

**Verdict:** ⚠️ Marginal difference.

---

### 3. 🌟 Fuzzy Text Matching — UNIQUE

**Standard Playwright — No equivalent. Would need:**
```typescript
// You'd have to write this yourself every time:
const actual = await page.locator("h1").innerText();
const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const similarity = (a: string, b: string) => {
  // ... implement Levenshtein distance yourself ...
};
const score = similarity(normalize(actual), normalize("Welcome to the internet"));
expect(score).toBeGreaterThanOrEqual(0.8);
```

**qapulsesk-assert:**
```typescript
// One line. Done.
await qa.toFuzzyHaveText("h1", "Welcome to the internet", { threshold: 0.8 });
```

**Real-world use case (SuiteCRM):**
```typescript
// CRM page titles vary: "Accounts » SuiteCRM" vs "Accounts - SuiteCRM Demo" vs "Accounts | SuiteCRM 7"
// Standard Playwright would fail on any variation
await expect(page.locator("title")).toContainText("Accounts » SuiteCRM"); // ❌ FAILS if format changes

// qapulsesk-assert handles all variations:
await qa.toFuzzyHaveText("title", "Accounts SuiteCRM", { threshold: 0.6 }); // ✅ PASSES all formats
```

**Verdict:** ✅ **Genuine unique value. Nothing like this in standard libraries.**

---

### 4. 🌟 Fuzzy String Matching (Framework-agnostic) — UNIQUE

**Standard — No direct equivalent:**
```typescript
// You'd implement this yourself
function levenshtein(a, b) { /* 15 lines of code */ }
function similarity(a, b) { return 1 - levenshtein(a,b) / Math.max(a.length, b.length); }
expect(similarity("Welcom to the internet", "Welcome to the internet")).toBeGreaterThan(0.8);
```

**qapulsesk-assert:**
```typescript
const result = assertFuzzyMatch("Welcom to the internet", "Welcome to the internet", { threshold: 0.8 });
expect(result.passed).toBeTruthy();
// result.message: "Fuzzy match passed (similarity: 95.7%)"
```

**Real-world use case:** Dynamic CRM content, user-generated text, localized strings:
```typescript
// SuiteCRM contact count varies: "1 - 20 of 201" vs "Showing 1-20 of 201 records"
const countText = await page.locator(".count").innerText();
const result = assertFuzzyMatch(countText, "201 records", { threshold: 0.5 });
// ✅ Passes regardless of exact phrasing
```

**Verdict:** ✅ **Real value. Eliminates brittle exact-match failures on dynamic text.**

---

### 5. 🌟 Number Approximation — UNIQUE

**Standard — No equivalent:**
```typescript
// You'd write this yourself:
const actual = 99.8;
const expected = 100;
const tolerance = 0.5;
expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
```

**qapulsesk-assert:**
```typescript
const result = assertApproximately(99.8, 100, 0.5);
expect(result.passed).toBeTruthy();
// result.message: "Value 99.8 is within ±0.5 of 100"
```

**Real-world use case:** Price calculations, percentages, test metrics:
```typescript
// Test that response time is approximately 200ms (±50ms tolerance)
const result = assertApproximately(responseTime, 200, 50);

// Test that conversion rate is approximately 3.5% (±0.5% tolerance)
const result = assertApproximately(conversionRate, 3.5, 0.5);
```

**Verdict:** ✅ **Real value. Clean API for tolerance-based assertions.**

---

### 6. 🌟 API Response Schema Validation — UNIQUE

**Standard Playwright:**
```typescript
const body = await res.json();
// You check each field manually — no schema enforcement:
expect(typeof body.id).toBe("number");
expect(typeof body.title).toBe("string");
expect(typeof body.userId).toBe("number");
expect(typeof body.body).toBe("string");
// 4 separate assertions for one schema
```

**qapulsesk-assert:**
```typescript
const result = assertSchema(
  { status: res.status(), headers: {}, body },
  { id: "number", title: "string", userId: "number", body: "string" }
);
expect(result.passed).toBeTruthy();
// result.message: "Response schema is valid"
// OR on failure: "Schema validation failed:\n'title': expected string but got number"
```

**Real-world use case (SuiteCRM REST API):**
```typescript
// Validate CRM contact record schema
const result = assertSchema(response, {
  id: "string",
  first_name: "string",
  last_name: "string",
  email1: "string",
  phone_work: "string",
  account_name: "string",
});
// All 6 fields validated in one call with detailed error message if any fail
```

**Verdict:** ✅ **Real value. Schema validation in one call vs N separate type checks.**

---

### 7. 🌟 Response Time / Performance Assertions — UNIQUE

**Standard Playwright — No built-in equivalent:**
```typescript
// You write this yourself every time:
const start = Date.now();
await page.goto("https://demo.suiteondemand.com");
const duration = Date.now() - start;
if (duration > 5000) {
  throw new Error(`Page load too slow: ${duration}ms > 5000ms`);
}
```

**qapulsesk-assert:**
```typescript
const result = assertResponseTime(
  { status: 200, headers: {}, body: {}, duration },
  5000 // max ms
);
expect(result.passed).toBeTruthy();
// result.message: "Response time 1243ms is within 5000ms limit"
// OR: "Response time 6100ms exceeds 5000ms limit"
```

**Real-world use case (SuiteCRM performance benchmarks):**
```typescript
// Test all critical CRM pages load within SLA
const pages = [
  { url: "/index.php?module=Home&action=index", sla: 3000 },
  { url: "/index.php?module=Accounts&action=index", sla: 5000 },
  { url: "/index.php?module=Contacts&action=index", sla: 5000 },
];

for (const p of pages) {
  const start = Date.now();
  await page.goto(`${BASE_URL}${p.url}`);
  const duration = Date.now() - start;
  const result = assertResponseTime({ status: 200, headers: {}, body: {}, duration }, p.sla);
  expect(result.passed).toBeTruthy();
  console.log(`✅ ${result.message}`);
}
```

**Verdict:** ✅ **Real value. Performance SLA assertions with clear pass/fail messages.**

---

### 8. 🌟 Partial Object Matching — CLEANER

**Standard:**
```typescript
expect(obj).toMatchObject({ module: "Contacts", hasTable: true });
// Works but Playwright's toMatchObject is only available in expect() chain
```

**qapulsesk-assert:**
```typescript
const result = assertObjectContains(pageInfo, { module: "Contacts", hasTable: true });
expect(result.passed).toBeTruthy();
// Works in ANY framework — Jest, Vitest, Playwright, Cypress, WebdriverIO
```

**Verdict:** ⚠️ Framework-agnostic advantage but similar capability.

---

### 9. 🌟 Accessibility Checks — BUILT-IN

**Standard Playwright — Requires separate axe-core setup:**
```typescript
// You need to install and configure axe-core separately:
import AxeBuilder from "@axe-core/playwright";
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toHaveLength(0);
```

**qapulsesk-assert:**
```typescript
// Zero setup. Just:
const qa = qaPulseAssert(page);
await qa.toBeAccessible();
// Automatically detects violations and throws with details
```

**Real-world detection (SuiteCRM):**
```typescript
// qapulsesk-assert correctly detected on SuiteCRM login page:
// "[QAPulseSK-assert] 1 accessibility violation(s) found:
//   [heading-order] Headings must not skip levels"
```

**Verdict:** ✅ **Real value. Zero-config accessibility checking built into the assertion library.**

---

### 10. 🌟🌟 AI-Powered Assertions — COMPLETELY UNIQUE

**Standard Playwright/Cypress/Jest:** ❌ **Does not exist anywhere.**

**qapulsesk-assert:**
```typescript
// Does this element MEAN what I think it means?
const qa = qaPulseAssert(page, {
  ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
});

// "Does the error message mean authentication failed?"
await qa.toMean(".flash-error", "authentication failed");

// "Does the page content match this specification?"
await qa.pageMatchesSpec("The page should show a list of customer contacts with their email addresses");

// "Does this element satisfy a custom business rule?"
await qa.satisfiesRule(".price-display", "must show a positive monetary value with currency symbol");
```

**Real-world use case (SuiteCRM):**
```typescript
// Traditional: Must know exact error message text
await expect(page.locator(".error")).toContainText("Invalid username or password."); // Brittle!

// AI-powered: Just describe what it should MEAN
await qa.toMean(".error", "the login attempt failed due to wrong credentials"); // Resilient!

// Traditional: Hard to assert complex business rules
// AI-powered: Natural language rules
await qa.satisfiesRule(".account-status", "must indicate whether the account is active or inactive");
```

**Verdict:** ✅ **Completely unique. No other assertion library has AI-powered semantic assertions.**

---

## 📊 Summary Table

| Assertion | Standard Library | qapulsesk-assert | Winner |
|---|---|---|---|
| Element visibility | ✅ Playwright/Cypress built-in | ✅ Wrapper | 🤝 Tie |
| Text content | ✅ Playwright/Cypress built-in | ✅ Wrapper | 🤝 Tie |
| **Fuzzy text match** | ❌ Write it yourself | ✅ Built-in, 1 line | 🏆 **qapulsesk-assert** |
| **Fuzzy string match** | ❌ Write it yourself | ✅ Levenshtein-based | 🏆 **qapulsesk-assert** |
| **Number approximation** | ❌ Manual math | ✅ `assertApproximately` | 🏆 **qapulsesk-assert** |
| **API schema validation** | ❌ N separate type checks | ✅ One call | 🏆 **qapulsesk-assert** |
| **Response time SLA** | ❌ Write it yourself | ✅ `assertResponseTime` | 🏆 **qapulsesk-assert** |
| Partial object match | ✅ `toMatchObject` (Jest/Playwright) | ✅ Framework-agnostic | 🤝 Tie |
| **Accessibility checks** | ⚠️ Needs axe-core setup | ✅ Zero-config built-in | 🏆 **qapulsesk-assert** |
| **AI semantic assertions** | ❌ Does not exist | ✅ `toMean`, `satisfiesRule` | 🏆 **qapulsesk-assert** |
| **Cross-framework** | ❌ Framework-locked | ✅ Works everywhere | 🏆 **qapulsesk-assert** |

---

## 🎯 When To Use qapulsesk-assert

**Use it when you need:**
- ✅ **Fuzzy matching** — dynamic text, CRM data, user-generated content
- ✅ **API schema validation** — REST API testing without Zod/Joi
- ✅ **Performance SLA assertions** — response time benchmarks
- ✅ **Zero-config accessibility** — quick a11y checks without axe setup
- ✅ **Cross-framework consistency** — same assertions in Playwright AND Cypress
- ✅ **AI-powered assertions** — semantic checks, business rule validation

**Skip it when you need:**
- ⚠️ Simple exact-match assertions in a single-framework project — use built-ins
- ⚠️ Complex Playwright-specific features like `toHaveScreenshot` — not a replacement

---

## 🚀 Quick Start

```bash
npm install qapulsesk-assert
```

```typescript
// Playwright
import { qaPulseAssert, assertFuzzyMatch, assertSchema, assertResponseTime } from "qapulsesk-assert";

// Cypress
const { assertFuzzyMatch, assertSchema } = require("qapulsesk-assert");
```

---

## 🔗 Links

- 📦 npm: [qapulsesk-assert](https://www.npmjs.com/package/qapulsesk-assert)
- 🐙 GitHub: [QAPulseSK-assert](https://github.com/QAPulse-by-SK/QAPulseSK-assert)
- 🌐 Website: [www.skakarh.com](https://www.skakarh.com)
- 🏢 Org: [QAPulse-by-SK](https://github.com/QAPulse-by-SK)

---

*Created by QA Pulse by SK · www.skakarh.com*
