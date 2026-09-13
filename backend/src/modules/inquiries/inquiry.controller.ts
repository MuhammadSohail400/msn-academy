import { Request, Response, NextFunction } from 'express';
import { InquiryService } from './inquiry.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class InquiryController {
  /**
   * POST /api/v1/contact
   */
  public static async createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await InquiryService.createInquiry(req.body);

      res.status(201).json(
        ApiResponse.created(
          result,
          'Thank you! Your message has been received. Our team will contact you shortly.'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}
