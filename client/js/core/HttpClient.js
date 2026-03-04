/**
 * HttpClient — client-side API wrapper
 * Base URL : https://api.sarkhanrahimli.dev/api/filmalisa
 * Token key: "user_token"  (localStorage)
 */

const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const TOKEN_KEY = "user_token";

class HttpClient {
  // ── Token helpers ────────────────────────────────────────────────────────────

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // ── Headers ──────────────────────────────────────────────────────────────────

  #headers(extra = {}) {
    const h = { "Content-Type": "application/json", ...extra };
    const token = this.getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }

  // ── Response handler ─────────────────────────────────────────────────────────

  async #handle(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data;
  }

  // ── HTTP verbs ───────────────────────────────────────────────────────────────

  async get(endpoint, { headers = {}, params } = {}) {
    let url = BASE_URL + endpoint;
    if (params) {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && v !== ""
          )
        )
      ).toString();
      if (qs) url += "?" + qs;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: this.#headers(headers),
    });
    return this.#handle(res);
  }

  async post(endpoint, body = {}, { headers = {} } = {}) {
    const res = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers: this.#headers(headers),
      body: JSON.stringify(body),
    });
    return this.#handle(res);
  }

  async put(endpoint, body = {}, { headers = {} } = {}) {
    const res = await fetch(BASE_URL + endpoint, {
      method: "PUT",
      headers: this.#headers(headers),
      body: JSON.stringify(body),
    });
    return this.#handle(res);
  }

  async delete(endpoint, { headers = {} } = {}) {
    const res = await fetch(BASE_URL + endpoint, {
      method: "DELETE",
      headers: this.#headers(headers),
    });
    return this.#handle(res);
  }
}

export const httpClient = new HttpClient();
export default HttpClient;
