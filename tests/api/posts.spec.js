// @ts-check
const { test, expect } = require("../../src/fixtures/apiFixture.js");
const { PostsApi } = require("../../src/api/endpoints/PostsApi.js");

/**
 * API Tests - Posts Endpoint
 * QA Pulse by SK - www.skakarh.com
 * Tags: @smoke @api @regression
 */
test.describe("Posts API", () => {
  /** @type {PostsApi} */
  let postsApi;

  test.beforeEach(async ({ apiClient }) => {
    postsApi = new PostsApi(apiClient);
  });

  test("GET /posts - should return list of posts @smoke @api", async () => {
    const response = await postsApi.getAllPosts();
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
  });

  test("GET /posts/:id - should return a single post @smoke @api", async () => {
    const response = await postsApi.getPostById(1);
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toHaveProperty("id", 1);
    expect(post).toHaveProperty("title");
  });

  test("POST /posts - should create a new post @regression @api", async () => {
    const response = await postsApi.createPost({ userId: 1, title: "QA Pulse Test", body: "By QA Pulse by SK" });
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toHaveProperty("id");
  });

  test("PUT /posts/:id - should update a post @regression @api", async () => {
    const response = await postsApi.updatePost(1, { id: 1, userId: 1, title: "Updated", body: "Updated body" });
    expect(response.status()).toBe(200);
  });

  test("DELETE /posts/:id - should delete a post @regression @api", async () => {
    const response = await postsApi.deletePost(1);
    expect(response.status()).toBe(200);
  });
});
