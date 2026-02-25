import { httpClient } from "../core/HttpClient.js";

/**
 * UsersService - Handles users management API calls
 */
class UsersService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all users
   * @returns {Promise<Object>} List of users
   */
  async getAllUsers() {
    return await this.http.get("/admin/users");
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    return await this.http.get(`/admin/users/${userId}`);
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteUser(userId) {
    return await this.http.delete(`/admin/users/${userId}`);
  }
}

export const usersService = new UsersService(httpClient);
