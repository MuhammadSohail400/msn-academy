import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const assessmentService = {
  /**
   * GET /assessments/:courseId/briefing
   * Fetches exam briefing metadata (passMark, durationMinutes, totalQuestions, rules)
   */
  async getBriefing(courseId) {
    const response = await apiClient.get(ENDPOINTS.ASSESSMENTS.BRIEFING(courseId));
    return response.data;
  },

  /**
   * POST /assessments/:courseId/start
   * Starts a new exam session or resumes an active in-progress attempt
   */
  async startAssessment(courseId) {
    const response = await apiClient.post(ENDPOINTS.ASSESSMENTS.START(courseId));
    return response.data;
  },

  /**
   * POST /assessments/:attemptId/answer
   * Autosaves student answer option and flag status
   * Body: { questionId, selectedOptionKey: 'A'|'B'|'C'|'D'|null, isFlagged: boolean }
   */
  async recordAnswer(attemptId, payload) {
    const response = await apiClient.post(ENDPOINTS.ASSESSMENTS.ANSWER(attemptId), payload);
    return response.data;
  },

  /**
   * GET /assessments/:attemptId/review
   * Fetches review summary before submission (counts and question status flags)
   */
  async getReview(attemptId) {
    const response = await apiClient.get(ENDPOINTS.ASSESSMENTS.REVIEW(attemptId));
    return response.data;
  },

  /**
   * POST /assessments/:attemptId/submit
   * Submits exam, triggers grading, generates certificate if passed
   */
  async submitAssessment(attemptId) {
    const response = await apiClient.post(ENDPOINTS.ASSESSMENTS.SUBMIT(attemptId));
    return response.data;
  },

  /**
   * GET /assessments/:attemptId/result
   * Retrieves evaluated results, score percentage, breakdown, certificate ID
   */
  async getResult(attemptId) {
    const response = await apiClient.get(ENDPOINTS.ASSESSMENTS.RESULT(attemptId));
    return response.data;
  },
};

export default assessmentService;
