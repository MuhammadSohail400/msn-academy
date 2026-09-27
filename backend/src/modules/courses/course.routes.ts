import { Router } from 'express';
import { CourseController } from './course.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validateRequest } from '../../middleware/validateRequest';
import {
  getCoursesQuerySchema,
  getCourseBySlugParamsSchema,
  getCourseSyllabusParamsSchema,
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema,
} from './course.validation';

const router = Router();

// Public routes
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

// Protected Admin routes
router.post(
  '/',
  authGuard,
  roleGuard('ADMIN'),
  validateRequest({ body: createCourseSchema }),
  CourseController.createCourse
);

router.put(
  '/:courseId',
  authGuard,
  roleGuard('ADMIN'),
  validateRequest({ params: courseIdParamSchema, body: updateCourseSchema }),
  CourseController.updateCourse
);

router.delete(
  '/:courseId',
  authGuard,
  roleGuard('ADMIN'),
  validateRequest({ params: courseIdParamSchema }),
  CourseController.deleteCourse
);

export default router;
