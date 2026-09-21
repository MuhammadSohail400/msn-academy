import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const profileService = {
  /**
   * GET /users/profile
   * Fetches the current user's profile details.
   */
  async getProfile() {
    const response = await apiClient.get(ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  /**
   * PUT /users/profile
   * Updates user profile (fullName, phoneNumber, avatarUrl).
   * @param {Object} data
   * @param {string} [data.fullName]
   * @param {string} [data.phoneNumber]
   * @param {string} [data.avatarUrl]
   */
  async updateProfile(data) {
    const response = await apiClient.put(ENDPOINTS.USERS.PROFILE, data);
    return response.data;
  },

  /**
   * PUT /users/password
   * Changes the authenticated user's password.
   * @param {Object} data
   * @param {string} data.currentPassword
   * @param {string} data.newPassword
   */
  async changePassword(data) {
    const response = await apiClient.put(ENDPOINTS.USERS.PASSWORD, data);
    return response.data;
  },
};

export default profileService;
