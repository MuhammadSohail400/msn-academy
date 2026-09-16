import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const contactService = {
  /**
   * POST /contact
   */
  async submitInquiry(data) {
    const response = await apiClient.post(ENDPOINTS.CONTACT, data);
    return response.data;
  },
};

export default contactService;
