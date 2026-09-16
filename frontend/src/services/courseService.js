import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const courseService = {
  /**
   * GET /courses
   * Supports: page, limit, search, category, level, sort
   */
  async getCourses(params = {}) {
    const response = await apiClient.get(ENDPOINTS.COURSES.LIST, { params });
    return response.data;
  },

  /**
   * GET /courses/:slug
   */
  async getCourseBySlug(slug) {
    const response = await apiClient.get(ENDPOINTS.COURSES.DETAILS(slug));
    return response.data;
  },

  /**
   * GET /courses/:courseId/syllabus
   */
  async getCourseSyllabus(courseId) {
    const response = await apiClient.get(`/courses/${courseId}/syllabus`);
    return response.data;
  },

  /**
   * GET /categories
   */
  async getCategories() {
    const response = await apiClient.get(ENDPOINTS.COURSES.CATEGORIES);
    return response.data;
  },
};

export default courseService;
