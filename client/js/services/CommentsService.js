import { httpClient } from "../core/HttpClient.js";

/**
 * CommentsService - Handles movie comments
 * GET    /movies/:movieId/comments              (auth optional)
 * POST   /movies/:movieId/comment               (auth required)
 * DELETE /movies/:movieId/comment/:commentId    (auth required)
 */
class CommentsService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all comments for a movie
   * @param {number} movieId
   * @returns {Promise<Object>} { data: Comment[], result }
   */
  async getComments(movieId) {
    return await this.http.get(`/movies/${movieId}/comments`);
  }

  /**
   * Post a comment on a movie
   * @param {number} movieId
   * @param {string} comment
   * @returns {Promise<Object>} { data: Comment, result }
   */
  async createComment(movieId, comment) {
    return await this.http.post(`/movies/${movieId}/comment`, { comment });
  }

  /**
   * Delete a comment
   * @param {number} movieId
   * @param {number} commentId
   * @returns {Promise<Object>} { message, result }
   */
  async deleteComment(movieId, commentId) {
    return await this.http.delete(`/movies/${movieId}/comment/${commentId}`);
  }
}

export const commentsService = new CommentsService(httpClient);
