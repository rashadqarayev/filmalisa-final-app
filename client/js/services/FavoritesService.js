import { httpClient } from "../core/HttpClient.js";




/**
 * FavoritesService - Handles user favourite movies
 * GET  /movies/favorites          (auth required)
 * POST /movie/:id/favorite        (auth required — toggle add/remove)
 */
class FavoritesService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all favourite movies for the logged-in user
   * @returns {Promise<Object>} { data: Movie[], result }
   */
  async getFavorites() {
    return await this.http.get("/movies/favorites");
  }

  /**
   * Toggle favourite status for a movie (add if not saved, remove if saved)
   * @param {number} movieId
   * @returns {Promise<Object>} { message, result }
   */
  async toggleFavorite(movieId) {
    return await this.http.post(`/movie/${movieId}/favorite`);
  }
}

export const favoritesService = new FavoritesService(httpClient);
