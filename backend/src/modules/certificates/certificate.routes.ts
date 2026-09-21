import { Router } from 'express';
import { CertificateController } from './certificate.controller';
import { authGuard } from '../../middleware/authGuard';
import { validateRequest } from '../../middleware/validateRequest';
import {
  certificateParamsSchema,
  verifyCertificateParamsSchema,
} from './certificate.validation';

const router = Router();

// Public unauthenticated verification endpoint
router.get(
  '/verify/:certificateNumber',
  validateRequest({ params: verifyCertificateParamsSchema }),
  CertificateController.verifyCertificate
);

// Protected authenticated routes
router.get(
  '/',
  authGuard,
  CertificateController.getMyCertificates
);

router.get(
  '/:certificateId',
  authGuard,
  validateRequest({ params: certificateParamsSchema }),
  CertificateController.getCertificate
);

router.get(
  '/:certificateId/download',
  authGuard,
  validateRequest({ params: certificateParamsSchema }),
  CertificateController.getDownloadLink
);

export default router;
