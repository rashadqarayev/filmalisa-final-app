import { httpClient } from "../core/HttpClient.js";

/**
 * ContactService - Handles contact/support form submission
 * POST /contact
 */
class ContactService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Submit a contact form
   * @param {string} full_name
   * @param {string} email
   * @param {string} reason
   * @returns {Promise<Object>} { data: Contact, result }
   */
  async submitContact(full_name, email, reason) {
    return await this.http.post("/contact", { full_name, email, reason });
  }
}

export const contactService = new ContactService(httpClient);
