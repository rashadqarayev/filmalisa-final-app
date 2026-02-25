import { httpClient } from "../core/HttpClient.js";

/**
 * ProfileService - Handles profile related API calls
 */
class ProfileService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get admin profile
   * @returns {Promise<Object>} Admin profile data
   */
  async getProfile() {
    return await this.http.get("/profile");
  }

  /**
   * Update admin profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    return await this.http.put("/profile", profileData);
  }
}

export const profileService = new ProfileService(httpClient);
