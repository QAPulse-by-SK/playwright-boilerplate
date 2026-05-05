// @ts-check
const { test: base, request, expect } = require("@playwright/test");
const { ApiClient } = require("../api/ApiClient.js");

/**
 * API Fixtures — Provides API client to tests
 * QA Pulse by SK - www.skakarh.com
 */
const test = base.extend({
  apiClient: async ({}, use) => {
    const context = await request.newContext({
      baseURL: process.env.API_BASE_URL || "https://jsonplaceholder.typicode.com",
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const client = new ApiClient(context);
    await use(client);
    await context.dispose();
  },
});

module.exports = { test, expect };
