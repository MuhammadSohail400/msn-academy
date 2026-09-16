import crypto from 'crypto';
import { Types } from 'mongoose';
import { Payment, IPayment } from './payment.model';
import { Order } from '../orders/order.model';
import { getPaymentInstructions } from '../orders/order.service';
import { SubmitProofInput, AdminReviewPaymentInput, PaymentWebhookInput } from './payment.validation';
import { EnrollmentService } from '../enrollments/enrollment.service';
import { env } from '../../config/environment';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export class PaymentService {
  /**
   * Initializes or returns existing payment record for a pending order.
   */
  public static async createPayment(userId: string, orderId: string): Promise<Record<string, unknown>> {
    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    });

    if (!order) {
      throw ApiError.notFound('Order does not exist or access unauthorized.');
    }

    if (order.status === 'COMPLETED') {
      throw ApiError.conflict('Order is already paid and completed.');
    }

    // Idempotent: return existing pending payment if available
    let payment = await Payment.findOne({
      orderId: order._id,
      userId: new Types.ObjectId(userId),
      status: { $in: ['PENDING', 'UNDER_REVIEW'] },
    });

    if (!payment) {
      payment = await Payment.create({
        orderId: order._id,
        userId: new Types.ObjectId(userId),
        paymentMethod: order.paymentMethod,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'PENDING',
      });
    }

    const instructions = getPaymentInstructions(order.paymentMethod);

    return {
      paymentId: payment._id.toString(),
      orderId: order._id.toString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      instructions,
    };
  }

  /**
   * Submits student proof of payment (bank transaction reference ID & receipt screenshot).
   */
  public static async submitProof(
    userId: string,
    paymentId: string,
    input: SubmitProofInput
  ): Promise<Record<string, unknown>> {
    const payment = await Payment.findOne({
      _id: new Types.ObjectId(paymentId),
      userId: new Types.ObjectId(userId),
    });

    if (!payment) {
      throw ApiError.notFound('Payment record not found.');
    }

    if (payment.status === 'APPROVED' || payment.status === 'REJECTED') {
      throw ApiError.badRequest(`Payment has already been processed with status '${payment.status}'.`);
    }

    payment.transactionReference = input.transactionReference;
    payment.proofAttachmentUrl = input.receiptScreenshotUrl || null;
    payment.status = 'UNDER_REVIEW';

    await payment.save();

    // Notify/Sync associated Order
    await Order.findByIdAndUpdate(payment.orderId, { status: 'PENDING' });

    logger.info(
      { paymentId: payment._id.toString(), tid: input.transactionReference },
      '💳 Student submitted payment verification proof'
    );

    return {
      paymentId: payment._id.toString(),
      status: 'UNDER_REVIEW',
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * Retrieves payment verification status.
   */
  public static async getPaymentStatus(userId: string, paymentId: string): Promise<Record<string, unknown>> {
    const payment = await Payment.findOne({
      _id: new Types.ObjectId(paymentId),
      userId: new Types.ObjectId(userId),
    }).lean();

    if (!payment) {
      throw ApiError.notFound('Payment record not found.');
    }

    return {
      paymentId: payment._id.toString(),
      orderId: payment.orderId.toString(),
      status: payment.status,
      amount: payment.amount,
      transactionReference: payment.transactionReference,
      verifiedAt: payment.verifiedAt ? payment.verifiedAt.toISOString() : null,
    };
  }

  /**
   * Admin audit review: Approves or rejects payment, updating order status.
   */
  public static async adminReview(
    paymentId: string,
    adminId: string,
    input: AdminReviewPaymentInput
  ): Promise<Record<string, unknown>> {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound('Payment record not found.');
    }

    payment.status = input.status;
    payment.verificationNotes = input.verificationNotes || null;
    payment.verifiedBy = new Types.ObjectId(adminId);
    payment.verifiedAt = new Date();

    await payment.save();

    if (input.status === 'APPROVED') {
      await Order.findByIdAndUpdate(payment.orderId, { status: 'COMPLETED' });
      await EnrollmentService.provisionEnrollmentsForOrder(
        payment.orderId.toString(),
        payment.userId.toString()
      );
      logger.info({ paymentId, orderId: payment.orderId.toString() }, '✅ Payment approved by Admin. Order completed & enrollments provisioned.');
    } else {
      await Order.findByIdAndUpdate(payment.orderId, { status: 'FAILED' });
      logger.info({ paymentId, orderId: payment.orderId.toString() }, '❌ Payment rejected by Admin. Order marked failed.');
    }

    return {
      paymentId: payment._id.toString(),
      orderId: payment.orderId.toString(),
      status: payment.status,
      verificationNotes: payment.verificationNotes,
      verifiedAt: payment.verifiedAt.toISOString(),
    };
  }

  /**
   * Processes asynchronous payment gateway webhook notifications.
   */
  public static async handleWebhook(
    input: PaymentWebhookInput,
    rawPayload: string,
    signature?: string
  ): Promise<{ received: boolean }> {
    // 1. Validate signature if provided
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', env.PAYMENT_WEBHOOK_SECRET)
        .update(rawPayload)
        .digest('hex');

      if (signature !== expectedSignature) {
        logger.warn({ signature, expectedSignature }, '⚠️ Webhook signature mismatch');
        throw ApiError.unauthorized('Invalid webhook cryptographic signature.');
      }
    }

    // 2. Locate associated Order
    const order = await Order.findById(input.orderId);
    if (!order) {
      throw ApiError.notFound('Associated order not found for webhook notification.');
    }

    // 3. Idempotency Check: Check if transactionId or order is already processed
    let payment = await Payment.findOne({
      orderId: order._id,
    });

    if (payment && payment.status === 'APPROVED') {
      logger.info({ orderId: input.orderId, txId: input.transactionId }, 'Webhook received for already completed order (idempotent).');
      return { received: true };
    }

    if (!payment) {
      payment = await Payment.create({
        orderId: order._id,
        userId: order.userId,
        paymentMethod: order.paymentMethod,
        amount: input.amount,
        currency: input.currency || 'PKR',
        status: 'PENDING',
      });
    }

    // 4. Update Payment and Order based on gateway status
    payment.transactionReference = input.transactionId;
    payment.gatewayResponse = input as Record<string, unknown>;

    if (input.status === 'PAID') {
      payment.status = 'APPROVED';
      payment.verifiedAt = new Date();
      payment.verificationNotes = `Auto-verified via Webhook [Event: ${input.eventId || 'N/A'}]`;
      await payment.save();

      order.status = 'COMPLETED';
      await order.save();

      await EnrollmentService.provisionEnrollmentsForOrder(order._id.toString(), order.userId.toString());

      logger.info(
        { orderId: order._id.toString(), orderNumber: order.orderNumber, txId: input.transactionId },
        '🚀 Order automatically completed & enrollments provisioned via Payment Webhook notification!'
      );
    } else if (input.status === 'FAILED') {
      payment.status = 'REJECTED';
      payment.verifiedAt = new Date();
      payment.verificationNotes = `Payment failed at gateway [Event: ${input.eventId || 'N/A'}]`;
      await payment.save();

      order.status = 'FAILED';
      await order.save();

      logger.warn(
        { orderId: order._id.toString(), txId: input.transactionId },
        '❌ Order marked as failed via Payment Webhook notification'
      );
    } else {
      await payment.save();
    }

    return { received: true };
  }
}
