import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';

export const apiRouter = Router();

// Module Routes Mount
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);

export default apiRouter;
