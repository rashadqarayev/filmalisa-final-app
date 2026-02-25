import { httpClient } from "../core/HttpClient.js";

/**
 * ActorsService - Handles actors management API calls
 */
class ActorsService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all actors
   * @returns {Promise<Object>} List of actors
   */
  async getAllActors() {
    return await this.http.get("/admin/actors");
  }

  /**
   * Get actor by ID
   * @param {number} actorId - Actor ID
   * @returns {Promise<Object>} Actor data
   */
  async getActorById(actorId) {
    return await this.http.get(`/admin/actor/${actorId}`);
  }

  /**
   * Create new actor
   * @param {Object} actorData - Actor data
   * @param {string} actorData.name - Actor first name
   * @param {string} actorData.surname - Actor surname
   * @param {string} actorData.img_url - Actor image URL
   * @returns {Promise<Object>} Created actor data
   */
  async createActor(actorData) {
    return await this.http.post("/admin/actor", actorData);
  }

  /**
   * Update actor
   * @param {number} actorId - Actor ID
   * @param {Object} actorData - Updated actor data
   * @returns {Promise<Object>} Updated actor data
   */
  async updateActor(actorId, actorData) {
    return await this.http.put(`/admin/actor/${actorId}`, actorData);
  }

  /**
   * Delete actor
   * @param {number} actorId - Actor ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteActor(actorId) {
    return await this.http.delete(`/admin/actor/${actorId}`);
  }
}

export const actorsService = new ActorsService(httpClient);
