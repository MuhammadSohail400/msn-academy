import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { getEnrollmentsQuerySchema } from './enrollment.validation';

const router = Router();

// All student learning dashboard endpoints require student authentication
router.use(authGuard);

router.get(
  '/enrollments',
  validateRequest({ query: getEnrollmentsQuerySchema }),
  EnrollmentController.getMyEnrollments
);

router.get('/dashboard-summary', EnrollmentController.getDashboardSummary);

export default router;
