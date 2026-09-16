import { Request, Response, NextFunction } from 'express';
import { CertificateService } from './certificate.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class CertificateController {
  /**
   * GET /api/v1/certificates/:certificateId
   */
  public static async getCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const certificateId = req.params.certificateId as string;
      const userId = req.user!.id;
      const result = await CertificateService.getCertificateById(certificateId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Certificate retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/certificates/:certificateId/download
   */
  public static async getDownloadLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const certificateId = req.params.certificateId as string;
      const userId = req.user!.id;
      const result = await CertificateService.getDownloadLink(certificateId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Download link generated'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/certificates/verify/:certificateNumber
   * Public unauthenticated verification endpoint
   */
  public static async verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const certificateNumber = req.params.certificateNumber as string;
      const result = await CertificateService.verifyCertificate(certificateNumber);

      res.status(200).json(ApiResponse.ok(result, 'Certificate verified successfully'));
    } catch (error) {
      next(error);
    }
  }
}
