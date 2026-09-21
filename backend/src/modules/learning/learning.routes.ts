import { Router } from 'express';
import { LearningController } from './learning.controller';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { courseLearningParamsSchema, lessonParamsSchema } from './learning.validation';

const router = Router();

// All learning portal operations require active student authentication
router.use(authGuard);

router.get(
  '/:courseId/overview',
  validateRequest({ params: courseLearningParamsSchema }),
  LearningController.getCourseOverview
);

router.get(
  '/:courseId/lessons/:lessonId',
  validateRequest({ params: lessonParamsSchema }),
  LearningController.getLessonContent
);

router.post(
  '/:courseId/lessons/:lessonId/complete',
  validateRequest({ params: lessonParamsSchema }),
  LearningController.completeLesson
);

router.get(
  '/:courseId/progress',
  validateRequest({ params: courseLearningParamsSchema }),
  LearningController.getCourseProgress
);

export default router;
