/**
 * CategoriesService
 *
 * GET /categories — list all categories, each with their movies array
 */
import { httpClient } from "../core/HttpClient.js";

class CategoriesService {
  /**
   * Get all categories including their movies.
   *
   * @returns {Promise<{ message, data: Category[], result }>}
   *
   * Category shape:
   *   { id, name, created_at, movies: Movie[] }
   */
  getAllCategories() {
    return httpClient.get("/categories");
  }
}

export const categoriesService = new CategoriesService();
