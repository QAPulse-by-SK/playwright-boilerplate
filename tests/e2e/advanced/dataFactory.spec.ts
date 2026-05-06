import { test, expect } from "@playwright/test";
import { DataFactory } from "../../../src/helpers/dataFactory";
import { PostsApi } from "../../../src/api/endpoints/PostsApi";
import { test as apiTest } from "../../../src/fixtures/apiFixture";

/**
 * Data Factory Tests — Demonstrates Faker.js integration
 * QA Pulse by SK - www.skakarh.com
 * Tags: @smoke @regression @e2e
 */

test.describe("Data Factory — Dynamic Test Data", () => {
  test("should generate unique user data on every run @smoke @e2e", async () => {
    const user = DataFactory.createUser();

    console.log(`👤 User: ${user.fullName}`);
    console.log(`📧 Email: ${user.email}`);

    expect(user.firstName).toBeTruthy();
    expect(user.lastName).toBeTruthy();
    expect(user.email).toContain("@");
    expect(user.password.length).toBeGreaterThanOrEqual(12);
  });

  test("should generate multiple unique users @regression @e2e", async () => {
    const users = DataFactory.createUsers(5);
    expect(users).toHaveLength(5);
    const emails = users.map((u) => u.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(5);
  });

  test("should generate post data @regression @e2e", async () => {
    const post = DataFactory.createPost();
    expect(post.title.length).toBeGreaterThan(0);
    expect(post.body.length).toBeGreaterThan(0);
    expect(post.userId).toBeGreaterThan(0);
    expect(post.tags).toHaveLength(3);
  });

  test("should generate address data @regression @e2e", async () => {
    const address = DataFactory.createAddress();
    expect(address.street).toBeTruthy();
    expect(address.city).toBeTruthy();
    expect(address.fullAddress).toContain(address.city);
    console.log(`🏠 Address: ${address.fullAddress}`);
  });

  test("should generate product data @regression @e2e", async () => {
    const product = DataFactory.createProduct();
    expect(product.name).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
    expect(product.sku).toHaveLength(8);
    console.log(`🛍️ Product: ${product.name} — $${product.price}`);
  });

  test("should produce reproducible data with seed @regression @e2e", async () => {
    DataFactory.seed(42);
    const user1 = DataFactory.createUser();
    DataFactory.seed(42);
    const user2 = DataFactory.createUser();
    expect(user1.email).toBe(user2.email);
    expect(user1.firstName).toBe(user2.firstName);
    console.log(`🌱 Seeded user: ${user1.fullName} — ${user1.email}`);
  });

  test("should allow overriding specific fields @regression @e2e", async () => {
    const user = DataFactory.createUser({
      email:     "qa.pulse@skakarh.com",
      firstName: "QA",
      lastName:  "Pulse",
    });
    expect(user.email).toBe("qa.pulse@skakarh.com");
    expect(user.firstName).toBe("QA");
    expect(user.lastName).toBe("Pulse");
    expect(user.phone).toBeTruthy();
  });
});

// ─── API + Data Factory combined ─────────────────────────────────────────────
apiTest.describe("Data Factory + API Testing", () => {
  apiTest("create post via API with factory data @smoke @api", async ({ apiClient }) => {
    const post     = DataFactory.createPost({ userId: 1 });
    const postsApi = new PostsApi(apiClient);

    const response = await postsApi.createPost({
      userId: post.userId,
      title:  post.title,
      body:   post.body,
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toHaveProperty("id");
    console.log(`✅ Created post: "${post.title}" with id: ${created.id}`);
  });

  apiTest("create multiple posts with factory data @regression @api", async ({ apiClient }) => {
    const postsApi = new PostsApi(apiClient);
    const posts    = Array.from({ length: 3 }, () => DataFactory.createPost({ userId: 1 }));

    for (const post of posts) {
      const response = await postsApi.createPost({
        userId: post.userId,
        title:  post.title,
        body:   post.body,
      });
      expect(response.status()).toBe(201);
    }
    console.log(`✅ Created ${posts.length} posts with factory data`);
  });
});
