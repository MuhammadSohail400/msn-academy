import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const paymentService = {
  /**
   * POST /payments/create
   * Initializes a payment record for an existing pending order.
   * @param {string} orderId
   */
  async createPayment(orderId) {
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.CREATE, { orderId });
    return response.data;
    // Returns: { data: { paymentId, orderId, amount, currency, status, instructions: { method, bankName, accountTitle, accountNumber } } }
  },

  /**
   * POST /payments/:paymentId/verify
   * Student submits transaction proof for manual admin review.
   * @param {string} paymentId
   * @param {object} proof
   * @param {string} proof.transactionReference - required, min 5 chars
   * @param {string} [proof.receiptScreenshotUrl] - optional valid URL
   */
  async submitProof(paymentId, { transactionReference, receiptScreenshotUrl }) {
    const body = { transactionReference };
    if (receiptScreenshotUrl && receiptScreenshotUrl.trim()) {
      body.receiptScreenshotUrl = receiptScreenshotUrl.trim();
    }
    const response = await apiClient.post(ENDPOINTS.PAYMENTS.VERIFY(paymentId), body);
    return response.data;
    // Returns: { data: { paymentId, status: "UNDER_REVIEW", submittedAt } }
  },

  /**
   * GET /payments/:paymentId
   * Fetches current verification status of a payment.
   * @param {string} paymentId
   */
  async getPaymentStatus(paymentId) {
    const response = await apiClient.get(ENDPOINTS.PAYMENTS.STATUS(paymentId));
    return response.data;
    // Returns: { data: { paymentId, orderId, status, amount, transactionReference, verifiedAt } }
  },
};

export default paymentService;
