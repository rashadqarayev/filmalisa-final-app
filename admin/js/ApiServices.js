/**
 * AuthService - Handles authentication related API calls
 */
class AuthService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Login response with tokens and profile
   */
  async login(email, password) {
    const response = await this.http.post("/auth/admin/login", {
      email,
      password,
    });

    if (response.result && response.data.tokens) {
      this.http.setAuthToken(response.data.tokens.access_token);
    }

    return response;
  }

  /**
   * Logout admin
   * @returns {void}
   */
  logout() {
    this.http.removeAuthToken();
    window.location.href = "/admin/html/login.html";
  }

  /**
   * Check if admin is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.http.isAuthenticated();
  }
}

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

/**
 * UsersService - Handles users management API calls
 */
class UsersService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all users
   * @returns {Promise<Object>} List of users
   */
  async getAllUsers() {
    return await this.http.get("/admin/users");
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    return await this.http.get(`/admin/users/${userId}`);
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteUser(userId) {
    return await this.http.delete(`/admin/users/${userId}`);
  }
}

/**
 * CategoriesService - Handles categories management API calls
 */
class CategoriesService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all categories
   * @returns {Promise<Object>} List of categories
   */
  async getAllCategories() {
    return await this.http.get("/admin/categories");
  }

  /**
   * Get category by ID
   * @param {number} categoryId - Category ID
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(categoryId) {
    return await this.http.get(`/admin/category/${categoryId}`);
  }

  /**
   * Create new category
   * @param {string} name - Category name
   * @returns {Promise<Object>} Created category data
   */
  async createCategory(name) {
    return await this.http.post("/admin/category", { name });
  }

  /**
   * Update category
   * @param {number} categoryId - Category ID
   * @param {string} name - New category name
   * @returns {Promise<Object>} Updated category data
   */
  async updateCategory(categoryId, name) {
    return await this.http.put(`/admin/category/${categoryId}`, { name });
  }

  /**
   * Delete category
   * @param {number} categoryId - Category ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteCategory(categoryId) {
    return await this.http.delete(`/admin/category/${categoryId}`);
  }
}

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

/**
 * ContactsService - Handles contacts management API calls
 */
class ContactsService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all contacts
   * @returns {Promise<Object>} List of contact messages
   */
  async getAllContacts() {
    return await this.http.get("/admin/contacts");
  }

  /**
   * Get contact by ID
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Contact data
   */
  async getContactById(contactId) {
    return await this.http.get(`/admin/contact/${contactId}`);
  }

  /**
   * Delete contact
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteContact(contactId) {
    return await this.http.delete(`/admin/contact/${contactId}`);
  }
}

/**
 * CommentsService - Handles comments management API calls
 */
class CommentsService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all comments
   * @returns {Promise<Object>} List of all comments
   */
  async getAllComments() {
    return await this.http.get("/admin/comments");
  }

  /**
   * Get comments for a specific movie
   * @param {number} movieId - Movie ID
   * @returns {Promise<Object>} List of movie comments
   */
  async getMovieComments(movieId) {
    return await this.http.get(`/admin/movies/${movieId}/comments`);
  }

  /**
   * Delete comment
   * @param {number} movieId - Movie ID
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteComment(movieId, commentId) {
    return await this.http.delete(
      `/admin/movies/${movieId}/comment/${commentId}`
    );
  }

  /**
   * Create comment (if needed)
   * @param {number} movieId - Movie ID
   * @param {string} comment - Comment text
   * @returns {Promise<Object>} Created comment data
   */
  async createComment(movieId, comment) {
    return await this.http.post(`/admin/movies/${movieId}/comment`, {
      comment,
    });
  }
}

/**
 * DashboardService - Handles dashboard statistics API calls
 */
class DashboardService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard stats (users, movies, categories, etc.)
   */
  async getStatistics() {
    return await this.http.get("/admin/dashboard");
  }

  /**
   * Get overview data
   * @returns {Promise<Object>} Combined overview data
   */
  async getOverview() {
    const stats = await this.getStatistics();
    return stats;
  }
}

// Import httpClient
import { httpClient } from "./HttpClient.js";

// Create service instances
export const authService = new AuthService(httpClient);
export const profileService = new ProfileService(httpClient);
export const usersService = new UsersService(httpClient);
export const categoriesService = new CategoriesService(httpClient);
export const actorsService = new ActorsService(httpClient);
export const moviesService = new MoviesService(httpClient);
export const contactsService = new ContactsService(httpClient);
export const commentsService = new CommentsService(httpClient);
export const dashboardService = new DashboardService(httpClient);
