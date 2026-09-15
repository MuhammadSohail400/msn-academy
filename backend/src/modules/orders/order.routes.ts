import { Router } from 'express';
import { OrderController } from './order.controller';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { checkoutSchema, getOrderParamsSchema, getOrdersQuerySchema } from './order.validation';

const router = Router();

// All order operations require student authentication
router.use(authGuard);

router.post('/checkout', validateRequest({ body: checkoutSchema }), OrderController.checkout);
router.get('/', validateRequest({ query: getOrdersQuerySchema }), OrderController.getMyOrders);
router.get('/my-orders', validateRequest({ query: getOrdersQuerySchema }), OrderController.getMyOrders);
router.get('/:orderId', validateRequest({ params: getOrderParamsSchema }), OrderController.getOrderById);

export default router;
