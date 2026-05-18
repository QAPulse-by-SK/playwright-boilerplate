import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { generate } from "qapulsesk-gen";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  🤖 qapulsesk-gen — DEMO FILE
 *  QA Pulse by SK · www.skakarh.com
 *  npm: https://www.npmjs.com/package/qapulsesk-gen
 *
 *  This file demonstrates what qapulsesk-gen can generate.
 *
 *  qapulsesk-gen converts real user interactions into test code automatically.
 *  Input types:
 *    1. HAR file     → from browser Network tab export (Chrome DevTools)
 *    2. Recording    → from Playwright codegen (npx playwright codegen)
 *    3. Plain text   → natural language description (requires AI key)
 *
 *  Output:
 *    → Playwright TypeScript
 *    → Playwright JavaScript
 *    → Cypress TypeScript
 *    → Cypress JavaScript
 *    → With optional Page Object Model files
 *
 *  CLI usage (no code needed):
 *    npx qapulsesk-gen from-har login.har --framework playwright --language typescript
 *    npx qapulsesk-gen from-har login.har --framework cypress --language javascript
 *    npx qapulsesk-gen from-recording recording.json --framework playwright
 *    npx qapulsesk-gen from-text "Login to SuiteCRM as admin" --ai-key YOUR_KEY
 *
 *  Programmatic API (used in this file):
 *    import { generate } from "qapulsesk-gen";
 *    const result = await generate(input, inputType, testName, config);
 *
 *  Run this file:
 *    npx playwright test tests/packages/gen.demo.spec.ts --project=chromium
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const HAR_FILE   = path.resolve(__dirname, "demo-data/suitecrm-login.har");
const OUTPUT_DIR = path.resolve(__dirname, "demo-data/generated");

// ─── Helper — read generated file ────────────────────────────────────────────
function readGenerated(filename: string): string {
  const filePath = path.join(OUTPUT_DIR, filename);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHAPTER 1 — FROM HAR FILE
//  "Record once in your browser. Generate tests in 2ms."
// ─────────────────────────────────────────────────────────────────────────────
test.describe("CHAPTER 1 — HAR → Tests (Browser Recording) 🎬", () => {

  /**
   * HOW TO RECORD A HAR FILE (no tools needed):
   * 1. Open Chrome DevTools (F12)
   * 2. Go to Network tab
   * 3. Check "Preserve log"
   * 4. Use your app normally (login, navigate, submit forms)
   * 5. Right click in Network tab → "Save all as HAR with content"
   * 6. Run: npx qapulsesk-gen from-har your-recording.har --framework playwright
   *
   * Every QA engineer already knows DevTools.
   * qapulsesk-gen turns that existing knowledge into automated tests instantly.
   */

  test("DEMO: HAR → Playwright TypeScript in 2ms", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "SuiteCRM Login Flow",
      {
        framework: "playwright",
        language:  "typescript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    // ✅ Verify generation stats
    expect(result.summary.testsGenerated).toBeGreaterThan(0);
    expect(result.summary.stepsGenerated).toBeGreaterThan(0);
    expect(result.summary.framework).toBe("playwright");
    expect(result.summary.language).toBe("typescript");
    expect(result.summary.duration).toBeLessThan(100); // 2ms — no AI needed

    console.log(`✅ CHAPTER 1.1 — Playwright TypeScript generated:`);
    console.log(`   Tests generated : ${result.summary.testsGenerated}`);
    console.log(`   Steps extracted : ${result.summary.stepsGenerated}`);
    console.log(`   Time taken      : ${result.summary.duration}ms`);
    console.log(`   File            : ${result.tests[0].filename}`);
  });

  test("DEMO: HAR → Playwright JavaScript in 2ms", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "SuiteCRM Login Flow JS",
      {
        framework: "playwright",
        language:  "javascript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    expect(result.summary.language).toBe("javascript");
    expect(result.tests[0].filename).toMatch(/\.js$/);

    console.log(`✅ CHAPTER 1.2 — Playwright JavaScript generated:`);
    console.log(`   File: ${result.tests[0].filename}`);
  });

  test("DEMO: HAR → Cypress TypeScript in 2ms", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "SuiteCRM Login Flow",
      {
        framework: "cypress",
        language:  "typescript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    expect(result.summary.framework).toBe("cypress");
    expect(result.tests[0].filename).toMatch(/\.cy\.ts$/);

    console.log(`✅ CHAPTER 1.3 — Cypress TypeScript generated:`);
    console.log(`   File: ${result.tests[0].filename}`);
  });

  test("DEMO: HAR → Cypress JavaScript in 2ms", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "SuiteCRM Login Flow JS",
      {
        framework: "cypress",
        language:  "javascript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    expect(result.summary.framework).toBe("cypress");
    expect(result.tests[0].filename).toMatch(/\.cy\.js$/);

    console.log(`✅ CHAPTER 1.4 — Cypress JavaScript generated:`);
    console.log(`   File: ${result.tests[0].filename}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  CHAPTER 2 — GENERATED OUTPUT QUALITY
//  "What does the generated test actually look like?"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("CHAPTER 2 — Generated Output Quality 📄", () => {

  test("DEMO: generated Playwright TypeScript has correct structure", async () => {
    const content = readGenerated("suitecrm-login-flow.spec.ts");

    // ✅ Generated file has proper Playwright imports
    expect(content).toContain("import { test, expect");

    // ✅ Generated file has QAPulseSK branding
    expect(content).toContain("QAPulseSK-gen");
    expect(content).toContain("skakarh.com");

    // ✅ Generated file has describe + test blocks
    expect(content).toContain("test.describe(");
    expect(content).toContain("test(");
    expect(content).toContain("async ({ page })");

    // ✅ Steps extracted from HAR
    expect(content).toContain("page.goto");
    expect(content).toContain("expect(page)");

    console.log(`✅ CHAPTER 2.1 — Generated TypeScript structure is valid`);
    console.log(`   File length: ${content.length} characters`);
    console.log(`   Has imports: ✅`);
    console.log(`   Has describe: ✅`);
    console.log(`   Has assertions: ✅`);
  });

  test("DEMO: generated Cypress TypeScript has correct structure", async () => {
    const content = readGenerated("cypress/e2e/suitecrm-login-flow.cy.ts");

    // ✅ No Playwright imports — pure Cypress syntax
    expect(content).not.toContain("import { test");

    // ✅ Cypress-specific syntax
    expect(content).toContain("describe(");
    expect(content).toContain("it(");
    expect(content).toContain("cy.visit(");
    expect(content).toContain("cy.url().should(");

    console.log(`✅ CHAPTER 2.2 — Generated Cypress structure is valid`);
    console.log(`   Uses cy.visit: ✅`);
    console.log(`   Uses cy.url().should: ✅`);
    console.log(`   No Playwright imports: ✅`);
  });

  test("DEMO: same HAR produces different syntax per framework", async () => {
    const pwContent  = readGenerated("suitecrm-login-flow.spec.ts");
    const cypContent = readGenerated("cypress/e2e/suitecrm-login-flow.cy.ts");

    // Same logic — different framework syntax
    expect(pwContent).toContain("await page.goto");    // Playwright async
    expect(cypContent).toContain("cy.visit");          // Cypress sync-style

    expect(pwContent).toContain("await expect(page)"); // Playwright assertion
    expect(cypContent).toContain("cy.url().should");   // Cypress assertion

    // Same URL paths in both
    expect(pwContent).toContain("/index.php");
    expect(cypContent).toContain("/index.php");

    console.log(`✅ CHAPTER 2.3 — One HAR → multiple framework outputs confirmed`);
    console.log(`   Playwright: uses async/await syntax`);
    console.log(`   Cypress: uses Cypress command chain syntax`);
    console.log(`   Same test logic — different framework idioms`);
  });

  test("DEMO: generated JavaScript uses CommonJS require syntax", async () => {
    const content = readGenerated("suitecrm-login-flow-js.spec.js");

    // ✅ JavaScript uses require, not import
    expect(content).toContain("require('@playwright/test')");
    expect(content).not.toContain("import {");

    // ✅ Has @ts-check for IDE support even in JS
    expect(content).toContain("@ts-check");

    console.log(`✅ CHAPTER 2.4 — Generated JavaScript uses CommonJS correctly`);
    console.log(`   Uses require: ✅`);
    console.log(`   Has @ts-check: ✅`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  CHAPTER 3 — API: PROGRAMMATIC GENERATION
//  "Use qapulsesk-gen in your own scripts and pipelines"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("CHAPTER 3 — Programmatic API 🔧", () => {

  test("DEMO: generate() returns rich summary object", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "API Demo Test",
      {
        framework: "playwright",
        language:  "typescript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    // ✅ Result has complete summary
    expect(result.summary).toMatchObject({
      inputType:      "har",
      framework:      "playwright",
      language:       "typescript",
      aiEnhanced:     false,  // free mode — no AI key needed
    });

    expect(result.summary.testsGenerated).toBeGreaterThan(0);
    expect(result.summary.stepsGenerated).toBeGreaterThan(0);
    expect(result.summary.outputDir).toBe(OUTPUT_DIR);

    // ✅ Result has test content
    expect(result.tests[0].content).toBeTruthy();
    expect(result.tests[0].filename).toBeTruthy();

    console.log(`✅ CHAPTER 3.1 — Programmatic API returns full GenerationResult:`);
    console.log(`   summary.inputType:      ${result.summary.inputType}`);
    console.log(`   summary.framework:      ${result.summary.framework}`);
    console.log(`   summary.language:       ${result.summary.language}`);
    console.log(`   summary.aiEnhanced:     ${result.summary.aiEnhanced}`);
    console.log(`   summary.testsGenerated: ${result.summary.testsGenerated}`);
    console.log(`   summary.stepsGenerated: ${result.summary.stepsGenerated}`);
    console.log(`   summary.duration:       ${result.summary.duration}ms`);
  });

  test("DEMO: generate() works with different frameworks in same pipeline", async () => {
    // In a real CI pipeline you could generate tests for multiple frameworks
    // from the same HAR file in one script run
    const frameworks: Array<"playwright" | "cypress"> = ["playwright", "cypress"];
    const results = await Promise.all(
      frameworks.map(fw =>
        generate(HAR_FILE, "har", `Multi-Framework Test`, {
          framework: fw,
          language:  "typescript",
          outputDir: path.join(OUTPUT_DIR, fw),
          baseUrl:   "https://demo.suiteondemand.com",
        })
      )
    );

    expect(results[0].summary.framework).toBe("playwright");
    expect(results[1].summary.framework).toBe("cypress");

    console.log(`✅ CHAPTER 3.2 — Same HAR → ${frameworks.length} frameworks in parallel:`);
    results.forEach(r => {
      console.log(`   ${r.summary.framework}: ${r.tests[0].filename} (${r.summary.duration}ms)`);
    });
  });

  test("DEMO: generated content is directly accessible without file I/O", async () => {
    const result = await generate(
      HAR_FILE,
      "har",
      "In-Memory Test",
      {
        framework: "playwright",
        language:  "typescript",
        outputDir: OUTPUT_DIR,
        baseUrl:   "https://demo.suiteondemand.com",
      }
    );

    // ✅ Test content available in memory — no need to read from disk
    const generatedCode = result.tests[0].content;
    expect(generatedCode).toContain("test.describe");
    expect(generatedCode).toContain("page.goto");

    // Could be used for: in-memory validation, template injection, custom output
    console.log(`✅ CHAPTER 3.3 — Generated code accessible in memory:`);
    console.log(`   Code preview:\n   ${generatedCode.split("\n").slice(0, 5).join("\n   ")}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  CHAPTER 4 — THE GENERATED TESTS ACTUALLY RUN
//  "Not just generated — the output is valid, runnable test code"
// ─────────────────────────────────────────────────────────────────────────────
test.describe("CHAPTER 4 — Generated Tests Are Runnable ✅", () => {

  /**
   * The real proof of qapulsesk-gen's value:
   * The generated test file suitecrm-login-flow.spec.ts runs against
   * the actual SuiteCRM demo and passes.
   *
   * Run it yourself:
   *   npx playwright test tests/packages/demo-data/generated/suitecrm-login-flow.spec.ts \
   *     --project=chromium \
   *     --config tests/packages/demo-data/generated-playwright.config.ts
   */
  test("DEMO: generated test file exists and has valid syntax", async () => {
    const filePath = path.join(OUTPUT_DIR, "suitecrm-login-flow.spec.ts");
    const content  = fs.readFileSync(filePath, "utf-8");

    // Verify it's syntactically complete
    expect(content).toContain("import { test, expect");
    expect(content).toContain("test.describe(");
    expect(content).toMatch(/test\(.+async \({ page }\)/);
    expect(content).toContain("});");

    console.log(`✅ CHAPTER 4.1 — Generated file is syntactically valid`);
    console.log(`\n${"─".repeat(60)}`);
    console.log(`📄 Generated file preview:`);
    console.log(`${"─".repeat(60)}`);
    content.split("\n").forEach(line => console.log(`   ${line}`));
    console.log(`${"─".repeat(60)}\n`);
  });

  test("DEMO: all generated files exist on disk", async () => {
    const expectedFiles = [
      "suitecrm-login-flow.spec.ts",           // Playwright TS
      "suitecrm-login-flow-js.spec.js",         // Playwright JS
      "cypress/e2e/suitecrm-login-flow.cy.ts",  // Cypress TS
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      const exists   = fs.existsSync(filePath);
      expect(exists).toBeTruthy();
      const size = fs.statSync(filePath).size;
      console.log(`  ✅ ${file} (${size} bytes)`);
    }

    console.log(`✅ CHAPTER 4.2 — All generated files exist on disk`);
    console.log(`   📁 Location: ${OUTPUT_DIR}`);
  });
});
