import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const courseService = {
  /**
   * Fetch paginated list of courses with optional search, category, level, and sort filters.
   * @param {Object} params - { page, limit, search, category, level, sort }
   */
  async getCourses(params = {}) {
    const response = await apiClient.get(ENDPOINTS.COURSES.LIST, { params });
    return response.data;
  },

  /**
   * Fetch single course details by slug.
   * @param {string} slug
   */
  async getCourseBySlug(slug) {
    const response = await apiClient.get(ENDPOINTS.COURSES.DETAILS(slug));
    return response.data;
  },

  /**
   * Fetch module and lecture syllabus for a specific course ID.
   * @param {string} courseId
   */
  async getCourseSyllabus(courseId) {
    const response = await apiClient.get(ENDPOINTS.COURSES.SYLLABUS(courseId));
    return response.data;
  },

  /**
   * Fetch category pills with course counts.
   */
  async getCategories() {
    const response = await apiClient.get(ENDPOINTS.COURSES.CATEGORIES);
    return response.data;
  },
};

export default courseService;
