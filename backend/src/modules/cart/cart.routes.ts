import { Router } from 'express';
import { CartController } from './cart.controller';
import { optionalAuthGuard } from '../../middleware/optionalAuthGuard';
import { validateRequest } from '../../middleware/validateRequest';
import { addCartItemSchema, removeCartItemParamsSchema, applyPromoSchema } from './cart.validation';

const router = Router();

// Cart routes support optional authentication for dual guest/authenticated cart experiences
router.use(optionalAuthGuard);

router.get('/', CartController.getCart);
router.post('/items', validateRequest({ body: addCartItemSchema }), CartController.addItem);
router.delete('/items/:courseId', validateRequest({ params: removeCartItemParamsSchema }), CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/promo', validateRequest({ body: applyPromoSchema }), CartController.applyPromo);

export default router;
