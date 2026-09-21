import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import courseRoutes from '../modules/courses/course.routes';
import { CourseController } from '../modules/courses/course.controller';
import inquiryRoutes from '../modules/inquiries/inquiry.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/orders/order.routes';
import paymentRoutes from '../modules/payments/payment.routes';
import enrollmentRoutes from '../modules/enrollments/enrollment.routes';
import learningRoutes from '../modules/learning/learning.routes';
import assessmentRoutes from '../modules/assessments/assessment.routes';
import certificateRoutes from '../modules/certificates/certificate.routes';

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

// 5. Enrollments, Learning Hub & Progress Routes
apiRouter.use('/student', enrollmentRoutes);
apiRouter.use('/learning', learningRoutes);

// 6. Timed Assessment Engine & Verification Routes
apiRouter.use('/assessments', assessmentRoutes);
apiRouter.use('/certificates', certificateRoutes);

export default apiRouter;
