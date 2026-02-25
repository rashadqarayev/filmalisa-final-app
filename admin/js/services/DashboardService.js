import { httpClient } from "../core/HttpClient.js";

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

export const dashboardService = new DashboardService(httpClient);
