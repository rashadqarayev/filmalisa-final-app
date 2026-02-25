import { httpClient } from "../core/HttpClient.js";
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

export const categoriesService = new CategoriesService(httpClient);
