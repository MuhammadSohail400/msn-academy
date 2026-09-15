import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import courseRoutes from '../modules/courses/course.routes';
import { CourseController } from '../modules/courses/course.controller';
import inquiryRoutes from '../modules/inquiries/inquiry.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/orders/order.routes';
import paymentRoutes from '../modules/payments/payment.routes';

export const apiRouter = Router();

// 1. Identity & Profile Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);

// 2. Course Catalog & Discovery Routes
apiRouter.use('/courses', courseRoutes);
apiRouter.get('/categories', CourseController.getCategories);

// 3. Marketing & Engagement Routes
apiRouter.use('/contact', inquiryRoutes);

// 4. Commerce, Cart & Payment Routes
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/payments', paymentRoutes);

export default apiRouter;
