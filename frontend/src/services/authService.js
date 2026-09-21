import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const authService = {
  /**
   * POST /auth/register
   */
  async register(data) {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  /**
   * POST /auth/login
   */
  async login(data) {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  /**
   * POST /auth/logout
   */
  async logout() {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * GET /auth/me
   * Fetches the current authenticated user's session.
   */
  async getMe() {
    const response = await apiClient.get(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * POST /auth/forgot-password
   */
  async forgotPassword(email) {
    const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * POST /auth/reset-password
   */
  async resetPassword(token, newPassword) {
    const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return response.data;
  },

  /**
   * POST /auth/oauth/google
   */
  async googleOAuth(idToken) {
    const response = await apiClient.post(ENDPOINTS.AUTH.GOOGLE_OAUTH, { idToken });
    return response.data;
  },

  /**
   * POST /auth/verify-email
   */
  async verifyEmail(email, code) {
    const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { email, code });
    return response.data;
  },

  /**
   * POST /auth/resend-verification
   */
  async resendVerification(email) {
    const response = await apiClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
    return response.data;
  },
};

export default authService;
