<div align="center">

<img src="https://img.shields.io/badge/QA%20Pulse%20by%20SK-Playwright%20Boilerplate-3b82f6?style=for-the-badge&logo=playwright&logoColor=white" alt="QA Pulse by SK" height="40"/>

# 🎭 QA Pulse by SK — Playwright Boilerplate (JavaScript)

**A production-grade, community-ready Playwright test automation framework**
**Fork it. Clone it. Ship quality code faster.**

> 📌 This is the **JavaScript** branch. For TypeScript, switch to the [`main`](https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate/tree/main) branch.

<br/>

[![Playwright Tests](https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate/actions/workflows/playwright.yml/badge.svg)](https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-22c55e?logo=node.js&logoColor=white)](https://nodejs.org)
[![Playwright](https://img.shields.io/badge/Playwright-1.46%2B-3b82f6?logo=playwright&logoColor=white)](https://playwright.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a78bfa.svg)](./CONTRIBUTING.md)

<br/>

🌐 **[www.skakarh.com](https://www.skakarh.com)** &nbsp;|&nbsp; 👤 **[ShahnawazKakarh](https://github.com/ShahnawazKakarh)** &nbsp;|&nbsp; ⭐ **Star this repo if it helped you!**

</div>

---

## 🌿 Branches

| Branch | Language | Status |
|--------|----------|--------|
| [`main`](https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate/tree/main) | TypeScript | ✅ Active |
| [`javascript`](https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate/tree/javascript) | JavaScript | ✅ Active (you are here) |

---

## ✨ Features

- **Page Object Model (POM)** — `BasePage` + `BaseComponent` with JSDoc types
- **API Testing** — `ApiClient` base class + endpoint layer
- **Visual Regression** — `toHaveScreenshot()` with baseline management
- **Accessibility Testing** — `A11yHelper` class with WCAG 2.1 AA, keyboard nav, ARIA, focus checks
- **Component Testing** — Isolated component specs
- **Custom Fixtures** — Single-import `pageFixture.js` + `apiFixture.js`
- **Test Tagging** — `@smoke` `@regression` `@sanity` `@e2e` `@api` `@visual` `@a11y` `@component` `@critical`
- **4 Reporters** — HTML + Allure + JUnit + JSON + Custom Summary
- **CI/CD** — GitHub Actions (sharded + GitHub Pages) · Jenkins · Azure DevOps
- **ESLint + Prettier** — Code quality enforced
- **dotenv** — Environment-based config, no hardcoded secrets

---

## 🚀 Quick Start

```bash
# Clone
git clone -b javascript https://github.com/ShahnawazKakarh/qapulsebysk-playwright-boilerplate.git
cd qapulsebysk-playwright-boilerplate

# Install
npm install
npx playwright install

# Configure
cp .env.example .env

# Run
npm test
```

---

## 🧪 Running Tests

```bash
npm run test:e2e          # E2E UI tests
npm run test:api          # API tests
npm run test:visual       # Visual regression
npm run test:a11y         # Accessibility
npm run test:component    # Component tests
npm run test:smoke        # @smoke tag
npm run test:regression   # @regression tag
npm run test:critical     # @critical tag
npm run test:chromium     # Chrome only
npm run test:firefox      # Firefox only
npm run test:webkit       # Safari only
npm run test:debug        # Step-through debugger
npm run test:headed       # Watch in browser
```

---

## 📊 Reporting

```bash
npm run report:html       # Open HTML report
npm run report:allure     # Generate + open Allure
npm run report:json       # Terminal summary
```

---

## 📁 Structure

```
src/
├── pages/          # BasePage + page objects (JSDoc typed)
├── components/     # Reusable UI components
├── api/            # ApiClient + endpoint classes
├── fixtures/       # pageFixture.js + apiFixture.js
├── helpers/        # a11yHelper, waitHelpers, randomData, dateHelpers
├── constants/      # URLS, ROUTES, CREDENTIALS, TIMEOUTS, TAGS
└── utils/          # logger

tests/
├── e2e/            # UI tests + advanced examples
├── api/            # API tests
├── visual/         # Visual regression
├── accessibility/  # Axe-core a11y tests
└── component/      # Component tests
```

---

## 📄 License

MIT © [QA Pulse by SK](https://www.skakarh.com)

---

<div align="center">

**Built with ❤️ by [QA Pulse by SK](https://www.skakarh.com)**

🌐 [skakarh.com](https://www.skakarh.com) &nbsp;·&nbsp; ⭐ Star if it helped!

*Created by QA Pulse by SK · skakarh.com*

</div>
