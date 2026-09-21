import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { authGuard } from '../../middleware/authGuard';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleOAuthSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from './auth.validation';

const router = Router();

// Public Authentication Endpoints
router.post('/register', validateRequest({ body: registerSchema }), AuthController.register);
router.post('/login', validateRequest({ body: loginSchema }), AuthController.login);
router.post('/oauth/google', validateRequest({ body: googleOAuthSchema }), AuthController.googleOAuth);
router.post('/verify-email', validateRequest({ body: verifyEmailSchema }), AuthController.verifyEmail);
router.post('/resend-verification', validateRequest({ body: resendVerificationSchema }), AuthController.resendVerification);
router.post('/forgot-password', validateRequest({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), AuthController.resetPassword);
router.post('/refresh', AuthController.refresh);

// Authentication Endpoints
router.post('/logout', AuthController.logout);
router.get('/me', authGuard, AuthController.getMe);

export default router;
