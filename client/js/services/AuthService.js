import { httpClient } from "../core/HttpClient.js";

/**
 * AuthService - Handles user authentication
 * POST /auth/login
 * POST /auth/signup
 */
class AuthService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} { data: { tokens, profile }, result }
   */
  async login(email, password) {
    const response = await this.http.post("/auth/login", { email, password });
    if (response?.result && response.data?.tokens) {
      this.http.setAuthToken(response.data.tokens.access_token);
      localStorage.setItem("user_profile", JSON.stringify(response.data.profile));
    }
    return response;
  }

  /**
   * Register new user
   * @param {string} full_name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} { message, result }
   */
  async signup(full_name, email, password) {
    return await this.http.post("/auth/signup", { full_name, email, password });
  }

  /**
   * Logout — clear token & profile from localStorage
   */
  logout() {
    this.http.removeAuthToken();
    localStorage.removeItem("user_profile");
    const depth = window.location.pathname.includes("/client/html/") ? "../../" : "./";
    window.location.replace(depth + "index.html");
  }

  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.http.isAuthenticated();
  }
}

export const authService = new AuthService(httpClient);
