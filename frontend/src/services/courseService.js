import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

let categoriesCache = null;
let categoriesPromise = null;

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
   * GET /categories (in-memory cached)
   */
  async getCategories(force = false) {
    if (!force && categoriesCache) {
      return categoriesCache;
    }
    if (!force && categoriesPromise) {
      return categoriesPromise;
    }
    categoriesPromise = apiClient
      .get(ENDPOINTS.COURSES.CATEGORIES)
      .then((response) => {
        categoriesCache = response.data;
        categoriesPromise = null;
        return categoriesCache;
      })
      .catch((err) => {
        categoriesPromise = null;
        throw err;
      });
    return categoriesPromise;
  },
};

export default courseService;
