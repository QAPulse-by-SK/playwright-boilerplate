// @ts-check
/**
 * ApiClient - Base API client
 * QA Pulse by SK - www.skakarh.com
 */
class ApiClient {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }

  async get(endpoint, params) {
    return this.request.get(endpoint, { params });
  }

  async post(endpoint, data) {
    return this.request.post(endpoint, { data });
  }

  async put(endpoint, data) {
    return this.request.put(endpoint, { data });
  }

  async patch(endpoint, data) {
    return this.request.patch(endpoint, { data });
  }

  async delete(endpoint) {
    return this.request.delete(endpoint);
  }

  async parseJson(response) {
    return response.json();
  }
}

module.exports = { ApiClient };
