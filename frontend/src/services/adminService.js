import apiClient from './apiClient';

/**
 * Admin Service — centralized API client for administrative operations
 * See docs/05-API-Specification.md, section 41
 */
export const adminService = {
  /**
   * GET /admin/stats
   * Aggregated operational metrics, revenue, students, pending payments, orders, inquiries
   */
  async getDashboardStats() {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  /**
   * GET /admin/users
   * Query params: page, limit, search, role ('STUDENT' | 'ADMIN' | 'ALL')
   */
  async getAdminUsers(params = {}) {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  /**
   * PATCH /admin/users/:userId/role
   * Body: { role: 'STUDENT' | 'ADMIN' }
   */
  async updateUserRole(userId, role) {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * GET /courses
   * Fetch courses with optional filters (page, limit, search, status, category)
   */
  async getAdminCourses(params = {}) {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  /**
   * POST /courses
   * Create new course in catalog
   */
  async createCourse(courseData) {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  /**
   * PUT /courses/:courseId
   * Update existing course details
   */
  async updateCourse(courseId, courseData) {
    const response = await apiClient.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  /**
   * DELETE /courses/:courseId
   * Soft-delete / archive course
   */
  async deleteCourse(courseId) {
    const response = await apiClient.delete(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * GET /payments/admin/all
   * Fetch all payment records with filters (page, limit, status, method, search)
   */
  async getAdminPayments(params = {}) {
    const response = await apiClient.get('/payments/admin/all', { params });
    return response.data;
  },

  /**
   * POST /payments/:paymentId/verify
   * Verify or reject payment deposit slip
   * Body: { status: 'VERIFIED' | 'REJECTED', rejectionReason?: string, transactionReference?: string }
   */
  async verifyPayment(paymentId, payload) {
    const response = await apiClient.post(`/payments/${paymentId}/verify`, payload);
    return response.data;
  },

  /**
   * GET /orders/admin/all
   * Master commercial order ledger (page, limit, status, search)
   */
  async getAdminOrders(params = {}) {
    const response = await apiClient.get('/orders/admin/all', { params });
    return response.data;
  },

  /**
   * GET /inquiries/admin/all
   * Fetch contact inquiries / leads CRM (page, limit, status, search)
   */
  async getAdminInquiries(params = {}) {
    const response = await apiClient.get('/inquiries/admin/all', { params });
    return response.data;
  },

  /**
   * PATCH /inquiries/admin/:inquiryId/status
   * Update inquiry workflow status & admin notes
   * Body: { status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED', adminNotes?: string }
   */
  async updateInquiryStatus(inquiryId, payload) {
    const response = await apiClient.patch(`/inquiries/admin/${inquiryId}/status`, payload);
    return response.data;
  },
};

export default adminService;
