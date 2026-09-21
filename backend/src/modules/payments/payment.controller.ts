import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class PaymentController {
  /**
   * POST /api/v1/payments/create
   */
  public static async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { orderId } = req.body;
      const result = await PaymentService.createPayment(userId, orderId);

      res.status(201).json(ApiResponse.created(result, 'Payment record initialized'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/payments/:paymentId/verify
   */
  public static async submitProof(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const paymentId = req.params.paymentId as string;
      const result = await PaymentService.submitProof(userId, paymentId, req.body);

      res.status(200).json(
        ApiResponse.ok(
          result,
          'Proof of payment submitted. Verification typically completes within 24 hours.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/payments/:paymentId
   */
  public static async getPaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const paymentId = req.params.paymentId as string;
      const result = await PaymentService.getPaymentStatus(userId, paymentId);

      res.status(200).json(ApiResponse.ok(result, 'Payment status fetched'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/payments
   */
  public static async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requester = { id: req.user!.id, role: req.user!.role };
      const { status, page, limit } = req.query;
      const result = await PaymentService.getAllPayments(requester, {
        status: status as string | undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.status(200).json(ApiResponse.ok(result, 'Payments retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/payments/:paymentId/admin-review
   */
  public static async adminReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const paymentId = req.params.paymentId as string;
      const status = req.body?.status || 'APPROVED';
      const verificationNotes = req.body?.verificationNotes || req.body?.notes;
      const result = await PaymentService.adminReview(paymentId, adminId, { status, verificationNotes });

      res.status(200).json(ApiResponse.ok(result, `Payment ${status.toLowerCase()} successfully.`));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/payments/webhook
   */
  public static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-payment-signature'] as string | undefined;
      const rawPayload = JSON.stringify(req.body);
      const result = await PaymentService.handleWebhook(req.body, rawPayload, signature);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
