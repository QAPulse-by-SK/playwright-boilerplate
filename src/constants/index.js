// @ts-check
/**
 * Constants — No magic strings in test code
 * QA Pulse by SK - www.skakarh.com
 */

const URLS = {
  BASE: process.env.BASE_URL || "https://the-internet.herokuapp.com",
  BRAND: process.env.BRAND_URL || "https://www.skakarh.com",
  API: process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com",
};

const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SECURE: "/secure",
  DRAG_AND_DROP: "/drag_and_drop",
  FILE_UPLOAD: "/upload",
  DROPDOWN: "/dropdown",
  JAVASCRIPT_ALERTS: "/javascript_alerts",
};

const CREDENTIALS = {
  VALID: {
    username: process.env.TEST_USERNAME || "tomsmith",
    password: process.env.TEST_PASSWORD || "SuperSecretPassword!",
  },
  INVALID: {
    username: "wronguser",
    password: "wrongpassword",
  },
};

const TIMEOUTS = {
  SHORT: 5_000,
  DEFAULT: 30_000,
  LONG: 60_000,
  NETWORK: 10_000,
};

const TAGS = {
  SMOKE: "@smoke",
  REGRESSION: "@regression",
  SANITY: "@sanity",
  CRITICAL: "@critical",
  E2E: "@e2e",
  API: "@api",
  VISUAL: "@visual",
  A11Y: "@a11y",
  COMPONENT: "@component",
  SLOW: "@slow",
};

const MESSAGES = {
  LOGIN_SUCCESS: "You logged into a secure area!",
  LOGIN_FAILURE: "Your username is invalid!",
  LOGOUT_SUCCESS: "You logged out of the secure area!",
};

const VIEWPORTS = {
  MOBILE: { width: 375, height: 812 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1280, height: 720 },
  WIDE: { width: 1920, height: 1080 },
};

module.exports = { URLS, ROUTES, CREDENTIALS, TIMEOUTS, TAGS, MESSAGES, VIEWPORTS };
