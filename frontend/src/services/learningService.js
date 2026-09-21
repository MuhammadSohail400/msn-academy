import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const learningService = {
  /**
   * GET /student/enrollments
   * Fetches active and completed enrollments for the student
   */
  async getMyEnrollments(params = {}) {
    const response = await apiClient.get(ENDPOINTS.ENROLLMENTS.LIST, { params });
    return response.data;
  },

  /**
   * GET /learning/:courseId/overview
   * Fetches syllabus tree, lessons completion state, and assessment unlocked status
   */
  async getCourseOverview(courseId) {
    const response = await apiClient.get(ENDPOINTS.LEARNING.OVERVIEW(courseId));
    return response.data;
  },

  /**
   * GET /learning/:courseId/lessons/:lessonId
   * Fetches lesson video URL, title, description, and downloadable materials
   */
  async getLessonContent(courseId, lessonId) {
    const response = await apiClient.get(ENDPOINTS.LEARNING.LESSON(courseId, lessonId));
    return response.data;
  },

  /**
   * POST /learning/:courseId/lessons/:lessonId/complete
   * Marks a lesson as finished and updates course progress percentage
   */
  async completeLesson(courseId, lessonId) {
    const response = await apiClient.post(ENDPOINTS.LEARNING.COMPLETE(courseId, lessonId));
    return response.data;
  },

  /**
   * GET /learning/:courseId/progress
   * Retrieves overall student progress for a course
   */
  async getCourseProgress(courseId) {
    const response = await apiClient.get(ENDPOINTS.LEARNING.PROGRESS(courseId));
    return response.data;
  },
};

export default learningService;
