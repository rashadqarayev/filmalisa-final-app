/**
 * AuthService
 *
 * POST /auth/login   — login, stores token automatically
 * POST /auth/signup  — register new user
 */
import { http } from "../core/HttpClient.js";

class AuthService {
  /**
   * Login user.
   * On success the token is persisted to localStorage automatically.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ message, data: { tokens, profile }, result }>}
   */
  async login(email, password) {
    const res = await http.post("/auth/login", { email, password });
    if (res.result && res.data?.tokens?.access_token) {
      http.setToken(res.data.tokens.access_token);
    }
    return res;
  }

  /**
   * Register a new user (does NOT auto-login).
   *
   * @param {string} full_name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ message, data: null, result }>}
   */
  async signup(full_name, email, password) {
    return http.post("/auth/signup", { full_name, email, password });
  }

  /**
   * Remove stored token and redirect to login page.
   */
  logout() {
    http.removeToken();
    window.location.replace("/client/html/login.html");
  }

  isAuthenticated() {
    return http.isAuthenticated();
  }
}

export const authService = new AuthService();
