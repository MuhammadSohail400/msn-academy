import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const certificateService = {
  /**
   * GET /certificates
   * Fetches all certificates earned by the authenticated student.
   */
  async getMyCertificates() {
    const response = await apiClient.get(ENDPOINTS.CERTIFICATES.LIST);
    return response.data;
    // Returns: { data: [ { id, certNumber, courseTitle, studentName, issuedAt, courseId } ] }
  },

  /**
   * GET /certificates/:certId
   * Fetches full details of a single certificate.
   * @param {string} certId
   */
  async getCertificateById(certId) {
    const response = await apiClient.get(ENDPOINTS.CERTIFICATES.DETAILS(certId));
    return response.data;
    // Returns: { data: { id, certNumber, studentName, courseTitle, instructorName, issuedAt } }
  },

  /**
   * GET /certificates/verify/:certId
   * Public endpoint — verifies a certificate by its ID or number.
   * @param {string} certId
   */
  async verifyCertificate(certId) {
    const response = await apiClient.get(ENDPOINTS.CERTIFICATES.VERIFY(certId));
    return response.data;
    // Returns: { data: { isValid, studentName, courseTitle, issuedAt, certNumber } }
  },
};

export default certificateService;
