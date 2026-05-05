// @ts-check
const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

const isCI = !!process.env.CI;

module.exports = defineConfig({
  timeout: 60_000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,

  globalSetup: "./global-setup.js",
  globalTeardown: "./global-teardown.js",

  /*
   * ─── REPORTERS ────────────────────────────────────────────────────────────
   * LOCAL  : line + html (auto-opens on failure) + json + allure
   * CI     : line + html (never opens) + junit + json + blob + allure
   */
  reporter: isCI
    ? [
        ["line"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
        ["json", { outputFile: "test-results/results.json" }],
        ["blob", { outputDir: "blob-report" }],
        ["allure-playwright", { outputFolder: "allure-results", suiteTitle: true }],
      ]
    : [
        ["line"],
        ["html", { open: "on-failure", outputFolder: "playwright-report" }],
        ["json", { outputFile: "test-results/results.json" }],
        ["allure-playwright", { outputFolder: "allure-results", suiteTitle: true }],
      ],

  use: {
    baseURL: process.env.BASE_URL || "https://the-internet.herokuapp.com",
    trace: isCI ? "on-first-retry" : "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    testIdAttribute: "data-testid",
  },

  outputDir: "test-results/artifacts",

  projects: [
    { name: "setup", testMatch: /.*\.setup\.js/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup"],
      testIgnore: [/.*visual\.spec\.js/, /.*a11y\.spec\.js/],
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup"],
      testIgnore: [/.*visual\.spec\.js/],
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      dependencies: ["setup"],
      testIgnore: [/.*visual\.spec\.js/],
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
      dependencies: ["setup"],
      testIgnore: [/.*visual\.spec\.js/],
    },
  ],
});
