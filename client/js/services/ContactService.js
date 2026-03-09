/**
 * ContactService
 *
 * POST /contact — submit a contact/support request
 */
import { httpClient } from "../core/HttpClient.js";

class ContactService {
  /**
   * Submit a contact form.
   *
   * @param {{ full_name: string, email: string, reason: string }} data
   * @returns {Promise<{ message, data: Contact, result }>}
   *
   * Contact shape:
   *   { id, full_name, email, reason, created_at }
   */
  submit({ full_name, email, reason }) {
    return httpClient.post("/contact", { full_name, email, reason });
  }
}

export const contactService = new ContactService();
