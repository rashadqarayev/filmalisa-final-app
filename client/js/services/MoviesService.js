/**
 * MoviesService
 *
 * GET  /movies             — list all movies (optional: search query)
 * GET  /movies/:id         — single movie with actors + category
 * GET  /movies/favorites   — current user's favourite movies (auth required)
 * POST /movie/:id/favorite — toggle favourite on/off   (auth required)
 */
import { httpClient } from "../core/HttpClient.js";

class MoviesService {
  /**
   * Get all movies, optionally filtered by a search string.
   *
   * @param {string} [search] — searches title and description
   * @returns {Promise<{ message, data: Movie[], result }>}
   */
  getAllMovies(search) {
    return httpClient.get("/movies", { params: { search } });
  }

  /**
   * Get a single movie with full details (actors, category).
   *
   * @param {number|string} id
   * @returns {Promise<{ message, data: Movie, result }>}
   */
  getMovieById(id) {
    return httpClient.get(`/movies/${id}`);
  }

  /**
   * Get the logged-in user's favourite movies.
   * Requires authentication.
   *
   * @returns {Promise<{ message, data: Movie[], result }>}
   */
  getFavorites() {
    return httpClient.get("/movies/favorites");
  }

  /**
   * Toggle a movie in/out of the current user's favourites.
   * Requires authentication.
   *
   * @param {number|string} id
   * @returns {Promise<{ message, data: null, result }>}
   */
  toggleFavorite(id) {
    return httpClient.post(`/movie/${id}/favorite`);
  }
}

export const moviesService = new MoviesService();
