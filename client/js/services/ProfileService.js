/**
 * ProfileService
 *
 * GET /profile — get current user's profile  (auth required)
 * PUT /profile — update profile               (auth required)
 */
import { httpClient } from "../core/HttpClient.js";

class ProfileService {
  /**
   * Get the logged-in user's profile.
   *
   * @returns {Promise<{ message, data: Profile, result }>}
   *
   * Profile shape:
   *   { id, full_name, email, img_url, created_at }
   */
  getProfile() {
    return httpClient.get("/profile");
  }

  /**
   * Update the logged-in user's profile.
   * All fields are optional — only send what needs to change.
   *
   * @param {{ full_name?, email?, img_url?, password? }} data
   * @returns {Promise<{ message, data: Profile, result }>}
   */
  updateProfile({ full_name, email, img_url, password } = {}) {
    const body = {};
    if (full_name !== undefined) body.full_name = full_name;
    if (email !== undefined) body.email = email;
    if (img_url !== undefined) body.img_url = img_url;
    if (password !== undefined) body.password = password;
    return httpClient.put("/profile", body);
  }
}

export const profileService = new ProfileService();
