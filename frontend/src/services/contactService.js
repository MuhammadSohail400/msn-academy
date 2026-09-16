import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const contactService = {
  /**
   * Submit contact / inquiry form.
   * @param {Object} data - { fullName, email, phone, subject, message }
   */
  async submitContact(data) {
    const response = await apiClient.post(ENDPOINTS.CONTACT, data);
    return response.data;
  },
};

export default contactService;
