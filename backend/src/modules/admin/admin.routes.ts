import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { adminUsersQuerySchema, updateUserRoleSchema, userIdParamSchema } from './admin.validation';

const router = Router();

// All admin routes strictly require authentication and ADMIN role
router.use(authGuard);
router.use(roleGuard('ADMIN'));

router.get('/stats', AdminController.getStats);

router.get(
  '/users',
  validateRequest({ query: adminUsersQuerySchema }),
  AdminController.getUsers
);

router.patch(
  '/users/:userId/role',
  validateRequest({ params: userIdParamSchema, body: updateUserRoleSchema }),
  AdminController.updateUserRole
);

export default router;
