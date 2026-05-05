// @ts-check
const { ApiClient } = require("../ApiClient.js");

/**
 * PostsApi - Endpoint class for /posts
 * QA Pulse by SK - www.skakarh.com
 */
class PostsApi {
  /** @param {ApiClient} client */
  constructor(client) {
    this.client = client;
  }

  async getAllPosts() {
    return this.client.get("/posts");
  }

  /** @param {number} id */
  async getPostById(id) {
    return this.client.get(`/posts/${id}`);
  }

  /** @param {{ userId: number, title: string, body: string }} post */
  async createPost(post) {
    return this.client.post("/posts", post);
  }

  /**
   * @param {number} id
   * @param {{ id: number, userId: number, title: string, body: string }} post
   */
  async updatePost(id, post) {
    return this.client.put(`/posts/${id}`, post);
  }

  /** @param {number} id */
  async deletePost(id) {
    return this.client.delete(`/posts/${id}`);
  }
}

module.exports = { PostsApi };
