/**
 * HttpClient - A comprehensive HTTP client for making API requests
 * Handles authentication, request/response formatting, and error handling
 */
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL || "https://api.sarkhanrahimli.dev/api/filmalisa";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Get the authorization token from localStorage
   * @returns {string|null} Bearer token or null
   */
  getAuthToken() {
    return localStorage.getItem("admin_access_token");
  }

  /**
   * Set the authorization token in localStorage
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    localStorage.setItem("admin_access_token", token);
  }

  /**
   * Remove the authorization token from localStorage
   */
  removeAuthToken() {
    localStorage.removeItem("admin_access_token");
  }

  /**
   * Get headers with authorization if token exists
   * @param {Object} customHeaders - Additional headers
   * @returns {Object} Combined headers
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch API response
   * @returns {Promise<Object>} Parsed JSON response
   * @throws {Error} If response is not ok
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @throws {Error} Formatted error
   */
  handleError(error) {
    console.error("API Error:", error);
    throw error;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(options.headers),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, body = {}, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(body),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, body = {}, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(body),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getHeaders(options.headers),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async patch(endpoint, body = {}, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: this.getHeaders(options.headers),
        body: JSON.stringify(body),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload file with multipart/form-data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async upload(endpoint, formData, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = { ...options.headers };
      const token = this.getAuthToken();

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Don't set Content-Type for FormData, browser will set it automatically
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  /**
   * Set language header
   * @param {string} lang - Language code (e.g., 'en', 'az')
   */
  setLanguage(lang) {
    this.defaultHeaders["Accept-Language"] = lang;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default HttpClient;
