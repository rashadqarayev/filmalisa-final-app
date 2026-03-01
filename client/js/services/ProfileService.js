import { httpClient } from "../core/HttpClient.js";

/**
 * ProfileService - Handles logged-in user profile
 * GET /profile   (auth required)
 * PUT /profile   (auth required)
 */
class ProfileService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} { data: Profile, result }
   */
  async getProfile() {
    return await this.http.get("/profile");
  }

  /**
   * Update user profile
   * @param {Object} profileData
   * @param {string} [profileData.full_name]
   * @param {string} [profileData.email]
   * @param {string} [profileData.img_url]
   * @param {string} [profileData.password]
   * @returns {Promise<Object>} { data: Profile, result }
   */
  async updateProfile(profileData) {
    return await this.http.put("/profile", profileData);
  }
}

export const profileService = new ProfileService(httpClient);
