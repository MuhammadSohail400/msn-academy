import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const dashboardService = {
  /**
   * GET /student/dashboard-summary
   * Fetches overall KPI stats and recent learning activity.
   */
  async getDashboardSummary() {
    const response = await apiClient.get(ENDPOINTS.STUDENT.DASHBOARD);
    return response.data;
    // Returns: { data: { enrolledCoursesCount, activeCoursesCount, completedCoursesCount, certificatesEarnedCount, recentActivity } }
  },

  /**
   * GET /student/enrollments
   * Fetches all enrolled courses with detailed progress.
   */
  async getMyEnrollments() {
    const response = await apiClient.get(ENDPOINTS.ENROLLMENTS.LIST);
    return response.data;
  },
};

export default dashboardService;
