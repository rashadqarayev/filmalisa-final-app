// Import dependencies
import { httpClient } from "../core/HttpClient.js";
import { actorsService } from "./ActorsService.js";
import { authService } from "./AuthService.js";
import { profileService } from "./ProfileService.js";
import { categoriesService } from "./CategoriesService.js";
import { dashboardService } from "./DashboardService.js";
import { contactsService } from "./ContactsService.js";
import { commentsService } from "./CommentsService.js";
import { usersService } from "./UsersService.js";
import { moviesService } from "./MoviesService.js";
import { showToast } from "../utils/toast.js";

/**
 * AdminService - Main API class that combines all services
 * Provides a single interface for all admin API operations
 */
class AdminService {
  constructor() {
    // Initialize HTTP client
    this.http = httpClient;

    // Initialize all services
    this.auth = authService;
    this.profile = profileService;
    this.users = usersService;
    this.categories = categoriesService;
    this.actors = actorsService;
    this.movies = moviesService;
    this.contacts = contactsService;
    this.comments = commentsService;
    this.dashboard = dashboardService;
  }

  /**
   * Set language for API requests
   * @param {string} lang - Language code ('en', 'az', etc.)
   */
  setLanguage(lang) {
    this.http.setLanguage(lang);
  }

  /**
   * Check authentication status
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.http.isAuthenticated();
  }

  /**
   * Get current auth token
   * @returns {string|null}
   */
  getToken() {
    return this.http.getAuthToken();
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Error object
   * @param {string} defaultMessage - Default error message
   * @returns {string} User-friendly error message
   */
  handleError(error, defaultMessage = "An error occurred") {
    if (error.message) {
      return error.message;
    }

    return defaultMessage;
  }

  /**
   * Show loading state
   * @param {boolean} show - Show/hide loading
   */
  toggleLoading(show) {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = show ? "block" : "none";
    }
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    showToast("Success!", message, "success");
  }

  /**
   * Show info message
   * @param {string} message - Info message
   */
  showInfo(message) {
    showToast("Deleted!", message, "info");
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    showToast("Error!", message, "error");
  }
}

// Create and export global API instance
export const adminService = new AdminService();
export default AdminService;

/**
 * Usage Examples:
 *
 * // Authentication
 * await adminAPI.auth.login('admin@admin.com', '1234');
 * adminAPI.auth.logout();
 *
 * // Profile
 * const profile = await adminAPI.profile.getProfile();
 * await adminAPI.profile.updateProfile({ full_name: 'New Name' });
 *
 * // Users
 * const users = await adminAPI.users.getAllUsers();
 * await adminAPI.users.deleteUser(userId);
 *
 * // Categories
 * const categories = await adminAPI.categories.getAllCategories();
 * await adminAPI.categories.createCategory('New Category');
 * await adminAPI.categories.updateCategory(id, 'Updated Name');
 * await adminAPI.categories.deleteCategory(id);
 *
 * // Actors
 * const actors = await adminAPI.actors.getAllActors();
 * await adminAPI.actors.createActor({ name: 'John', surname: 'Doe', img_url: 'url' });
 * await adminAPI.actors.updateActor(id, actorData);
 * await adminAPI.actors.deleteActor(id);
 *
 * // Movies
 * const movies = await adminAPI.movies.getAllMovies();
 * const movie = await adminAPI.movies.getMovieById(id);
 * await adminAPI.movies.createMovie(movieData);
 * await adminAPI.movies.updateMovie(id, movieData);
 * await adminAPI.movies.deleteMovie(id);
 * await adminAPI.movies.searchMovies('query');
 *
 * // Contacts
 * const contacts = await adminAPI.contacts.getAllContacts();
 * await adminAPI.contacts.deleteContact(id);
 *
 * // Comments
 * const comments = await adminAPI.comments.getAllComments();
 * const movieComments = await adminAPI.comments.getMovieComments(movieId);
 * await adminAPI.comments.deleteComment(movieId, commentId);
 *
 * // Dashboard
 * const stats = await adminAPI.dashboard.getStatistics();
 */
