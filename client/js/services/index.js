/**
 * Client services — single entry point
 *
 * Usage in any page script (type="module"):
 *
 *   import { authService, moviesService, ... } from "../services/index.js";
 */

export { httpClient } from "../core/HttpClient.js";
export { authService } from "./AuthService.js";
export { moviesService } from "./MoviesService.js";
export { categoriesService } from "./CategoriesService.js";
export { commentsService } from "./CommentsService.js";
export { profileService } from "./ProfileService.js";
export { contactService } from "./ContactService.js";
