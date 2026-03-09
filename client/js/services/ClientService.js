import { httpClient } from "../core/HttpClient.js";
import { authService } from "./AuthService.js";
import { moviesService } from "./MoviesService.js";
import { favoritesService } from "./FavoritesService.js";
import { categoriesService } from "./CategoriesService.js";
import { commentsService } from "./CommentsService.js";
import { profileService } from "./ProfileService.js";
import { contactService } from "./ContactService.js";

/**
 * ClientService - Single façade for all client-side API operations.
 * mirrors admin/js/services/AdminService.js
 *
 * Usage (in any page script):
 *   import { clientService } from "../services/ClientService.js";
 *
 *   const movies = await clientService.movies.getAllMovies();
 *   await clientService.auth.login(email, password);
 *   await clientService.favorites.toggleFavorite(movieId);
 */
class ClientService {
  constructor() {
    this.httpClient        = httpClient;
    this.auth        = authService;
    this.movies      = moviesService;
    this.favorites   = favoritesService;
    this.categories  = categoriesService;
    this.comments    = commentsService;
    this.profile     = profileService;
    this.contact     = contactService;
  }

  /** @returns {boolean} */
  isAuthenticated() {
    return this.httpClient.isAuthenticated();
  }

  /** @returns {string|null} */
  getToken() {
    return this.httpClient.getAuthToken();
  }

  /**
   * Set Accept-Language for all requests
   * @param {string} lang - e.g. 'en', 'az'
   */
  setLanguage(lang) {
    this.httpClient.setLanguage(lang);
  }
}

export const clientService = new ClientService();
export default ClientService;
