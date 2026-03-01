/**
 * HttpClient - Client-side HTTP client
 * Mirrors admin/js/core/HttpClient.js but uses user_token
 * and redirects 404 errors to the client 404 page.
 */
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL || "https://api.sarkhanrahimli.dev/api/filmalisa";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // ── Token helpers ──────────────────────────────────────────────────────────

  getAuthToken() {
    return localStorage.getItem("user_token");
  }

  setAuthToken(token) {
    localStorage.setItem("user_token", token);
  }

  removeAuthToken() {
    localStorage.removeItem("user_token");
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // ── Header builder ─────────────────────────────────────────────────────────

  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // ── Response / error handlers ──────────────────────────────────────────────

  async handleResponse(response) {
    if (response.status === 404) {
      window.location.replace("./404.html");
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }

  handleError(error) {
    throw error;
  }

  // ── HTTP methods ───────────────────────────────────────────────────────────

  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(options.headers),
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, body = {}, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(body),
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(endpoint, body = {}, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(body),
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(options.headers),
      });
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  setLanguage(lang) {
    this.defaultHeaders["Accept-Language"] = lang;
  }
}

export const httpClient = new HttpClient();
export default HttpClient;
