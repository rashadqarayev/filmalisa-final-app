import { httpClient } from "../core/HttpClient.js";
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

export const commentsService = new CommentsService(httpClient);
