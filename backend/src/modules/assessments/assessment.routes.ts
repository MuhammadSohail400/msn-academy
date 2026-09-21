import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import {
  courseAssessmentParamsSchema,
  attemptParamsSchema,
  recordAnswerSchema,
} from './assessment.validation';

const router = Router();

// All assessment examination endpoints require student authentication
router.use(authGuard);

router.get(
  '/:courseId/briefing',
  validateRequest({ params: courseAssessmentParamsSchema }),
  AssessmentController.getAssessmentBriefing
);

router.post(
  '/:courseId/start',
  validateRequest({ params: courseAssessmentParamsSchema }),
  AssessmentController.startAssessment
);

router.post(
  '/:attemptId/answer',
  validateRequest({ params: attemptParamsSchema, body: recordAnswerSchema }),
  AssessmentController.recordAnswer
);

router.get(
  '/:attemptId/review',
  validateRequest({ params: attemptParamsSchema }),
  AssessmentController.getAttemptReview
);

router.post(
  '/:attemptId/submit',
  validateRequest({ params: attemptParamsSchema }),
  AssessmentController.submitAssessment
);

router.get(
  '/:attemptId/result',
  validateRequest({ params: attemptParamsSchema }),
  AssessmentController.getAttemptResult
);

export default router;
