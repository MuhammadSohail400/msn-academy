import { Router } from 'express';
import { CourseController } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {
  getCoursesQuerySchema,
  getCourseBySlugParamsSchema,
  getCourseSyllabusParamsSchema,
} from './course.validation';

const router = Router();

router.get(
  '/',
  validateRequest({ query: getCoursesQuerySchema }),
  CourseController.getCourses
);

router.get(
  '/:slug',
  validateRequest({ params: getCourseBySlugParamsSchema }),
  CourseController.getCourseBySlug
);

router.get(
  '/:courseId/syllabus',
  validateRequest({ params: getCourseSyllabusParamsSchema }),
  CourseController.getCourseSyllabus
);

export default router;
