import { httpClient } from "../core/HttpClient.js";
/**
 * ContactsService - Handles contacts management API calls
 */
class ContactsService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  /**
   * Get all contacts
   * @returns {Promise<Object>} List of contact messages
   */
  async getAllContacts() {
    return await this.http.get("/admin/contacts");
  }

  /**
   * Get contact by ID
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Contact data
   */
  async getContactById(contactId) {
    return await this.http.get(`/admin/contact/${contactId}`);
  }

  /**
   * Delete contact
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteContact(contactId) {
    return await this.http.delete(`/admin/contact/${contactId}`);
  }
}

export const contactsService = new ContactsService(httpClient);
