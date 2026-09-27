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

  /**
   * GET /api/v1/inquiries/admin/all
   * Admin only
   */
  public static async getAllInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await InquiryService.getAllAdminInquiries(req.query as any);
      res.status(200).json(
        ApiResponse.ok((result as any).inquiries, 'Inquiries retrieved successfully', {
          pagination: (result as any).pagination,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/inquiries/admin/:inquiryId/status
   * Admin only
   */
  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiryId = req.params.inquiryId as string;
      const inquiry = await InquiryService.updateInquiryStatus(inquiryId, req.body.status);
      res.status(200).json(ApiResponse.ok(inquiry, 'Inquiry status updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}
