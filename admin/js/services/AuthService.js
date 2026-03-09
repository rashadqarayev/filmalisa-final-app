import { httpClient } from "../core/HttpClient.js";
import { showToast } from "../utils/toast.js";

/**
 * AuthService - Handles authentication related API calls
 */
class AuthService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Login response with tokens and profile
   */
  async login(email, password) {
    const response = await this.http.post("/auth/admin/login", {
      email,
      password,
    });

    if (response.result && response.data?.tokens) {
      this.http.setAuthToken(response.data.tokens.access_token);
    }

    return response;
  }

  /**
   * Logout admin with toast notification
   * @returns {void}
   */
  logout() {
    this.http.removeAuthToken();
    showToast("Success!", "You have been logged out successfully.", "success");
    setTimeout(() => {
      window.location.href = "/admin/html/login.html";
    }, 1000);
  }

  /**
   * Check if admin is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.http.isAuthenticated();
  }
}

export const authService = new AuthService(httpClient);
