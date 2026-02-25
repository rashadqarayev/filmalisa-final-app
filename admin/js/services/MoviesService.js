import { httpClient } from "../core/HttpClient.js";

/**
 * MoviesService - Handles movies management API calls
 */
class MoviesService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all movies
   * @returns {Promise<Object>} List of movies
   */
  async getAllMovies() {
    return await this.http.get("/admin/movies");
  }

  /**
   * Get movie by ID
   * @param {number} movieId - Movie ID
   * @returns {Promise<Object>} Movie data with actors and category
   */
  async getMovieById(movieId) {
    return await this.http.get(`/admin/movies/${movieId}`);
  }

  /**
   * Create new movie
   * @param {Object} movieData - Movie data
   * @param {string} movieData.title - Movie title
   * @param {string} movieData.cover_url - Cover image URL
   * @param {string} movieData.fragman - Trailer URL
   * @param {string} movieData.watch_url - Watch URL
   * @param {boolean} movieData.adult - Adult content flag
   * @param {number} movieData.run_time_min - Runtime in minutes
   * @param {string} movieData.imdb - IMDB rating
   * @param {number} movieData.category - Category ID
   * @param {Array<number>} movieData.actors - Array of actor IDs
   * @param {string} movieData.overview - Movie description
   * @returns {Promise<Object>} Created movie data
   */
  async createMovie(movieData) {
    return await this.http.post("/admin/movie", movieData);
  }

  /**
   * Update movie
   * @param {number} movieId - Movie ID
   * @param {Object} movieData - Updated movie data
   * @returns {Promise<Object>} Updated movie data
   */
  async updateMovie(movieId, movieData) {
    return await this.http.put(`/admin/movie/${movieId}`, movieData);
  }

  /**
   * Delete movie
   * @param {number} movieId - Movie ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteMovie(movieId) {
    return await this.http.delete(`/admin/movie/${movieId}`);
  }

  /**
   * Search movies
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  async searchMovies(query) {
    return await this.http.get(
      `/admin/movies?search=${encodeURIComponent(query)}`
    );
  }
}

export const moviesService = new MoviesService(httpClient);
