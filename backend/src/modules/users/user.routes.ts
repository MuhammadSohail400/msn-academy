import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { authGuard } from '../../middleware/authGuard';
import { updateProfileSchema, changePasswordSchema } from './user.validation';

const router = Router();

// All user routes require authenticated session
router.use(authGuard);

router.get('/profile', UserController.getProfile);
router.put('/profile', validateRequest({ body: updateProfileSchema }), UserController.updateProfile);
router.patch('/profile', validateRequest({ body: updateProfileSchema }), UserController.updateProfile);
router.put('/password', validateRequest({ body: changePasswordSchema }), UserController.changePassword);
router.patch('/password', validateRequest({ body: changePasswordSchema }), UserController.changePassword);

export default router;
