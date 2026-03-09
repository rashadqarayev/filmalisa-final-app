/**
 * CommentsService
 *
 * GET    /movies/:movieId/comments        — list comments for a movie
 * POST   /movies/:movieId/comment         — post a comment  (auth required)
 * DELETE /movies/:movieId/comment/:id     — delete a comment (auth required)
 */
import { httpClient } from "../core/HttpClient.js";

class CommentsService {
  /**
   * Get all comments for a movie.
   *
   * @param {number|string} movieId
   * @returns {Promise<{ message, data: Comment[], result }>}
   */
  getComments(movieId) {
    return httpClient.get(`/movies/${movieId}/comments`);
  }

  /**
   * Post a new comment on a movie.
   * Requires authentication.
   *
   * @param {number|string} movieId
   * @param {string} comment
   * @returns {Promise<{ message, data: Comment, result }>}
   */
  createComment(movieId, comment) {
    return httpClient.post(`/movies/${movieId}/comment`, { comment });
  }

  /**
   * Delete a comment.
   * Requires authentication.
   *
   * @param {number|string} movieId
   * @param {number|string} commentId
   * @returns {Promise<{ message, data: null, result }>}
   */
  deleteComment(movieId, commentId) {
    return httpClient.delete(`/movies/${movieId}/comment/${commentId}`);
  }
}

export const commentsService = new CommentsService();
