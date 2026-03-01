import { httpClient } from "../core/HttpClient.js";

/**
 * CategoriesService - Handles categories with their movies
 * GET /categories
 */
class CategoriesService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all categories, each containing its movie list
   * @returns {Promise<Object>} { data: Category[], result }
   */
  async getAllCategories() {
    return await this.http.get("/categories");
  }
}

export const categoriesService = new CategoriesService(httpClient);
