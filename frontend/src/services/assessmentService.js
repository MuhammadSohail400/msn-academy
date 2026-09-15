import { mockAssessmentData, mockPassResult, mockFailResult } from '../data/mockAssessment';

class AssessmentService {
  async getBriefing(courseId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            ...mockAssessmentData,
            courseId
          }
        });
      }, 150);
    });
  }

  async startAssessmentSession(courseId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          sessionId: `SESS-${Date.now()}`,
          timeRemainingSeconds: 7200,
          totalQuestions: mockAssessmentData.questions.length,
          questions: mockAssessmentData.questions
        });
      }, 200);
    });
  }

  async submitAnswers(sessionId, answersMap, flaggedMap) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate score
        let correctCount = 0;
        const total = mockAssessmentData.questions.length;

        mockAssessmentData.questions.forEach((q) => {
          if (answersMap[q.id] === q.correctOption) {
            correctCount++;
          }
        });

        const scorePercent = Math.round((correctCount / total) * 100);
        const isPassed = scorePercent >= mockAssessmentData.passingScorePercent;

        if (isPassed) {
          resolve({
            success: true,
            result: {
              ...mockPassResult,
              scorePercent,
              scorePoints: correctCount,
              totalPoints: total,
              isPassed: true
            }
          });
        } else {
          resolve({
            success: true,
            result: {
              ...mockFailResult,
              scorePercent,
              scorePoints: correctCount,
              totalPoints: total,
              isPassed: false
            }
          });
        }
      }, 300);
    });
  }
}

export const assessmentService = new AssessmentService();
export default assessmentService;
