import { httpClient } from "../core/HttpClient.js";

/**
 * MoviesService - Handles movie listing and detail
 * GET /movies
 * GET /movies?search=query
 * GET /movies/:id
 */
class MoviesService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all movies
   * @returns {Promise<Object>} { data: Movie[], result }
   */
  async getAllMovies() {
    return await this.http.get("/movies");
  }

  /**
   * Search movies by title / description
   * @param {string} query
   * @returns {Promise<Object>} { data: Movie[], result }
   */
  async searchMovies(query) {
    return await this.http.get(`/movies?search=${encodeURIComponent(query)}`);
  }

  /**
   * Get single movie with actors + category
   * @param {number} movieId
   * @returns {Promise<Object>} { data: Movie, result }
   */
  async getMovieById(movieId) {
    return await this.http.get(`/movies/${movieId}`);
  }
}

export const moviesService = new MoviesService(httpClient);
