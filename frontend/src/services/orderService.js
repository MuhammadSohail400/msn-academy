import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const orderService = {
  /**
   * POST /orders/checkout
   * Converts the active cart into an order.
   * @param {string} paymentMethod - "BANK_TRANSFER" | "EASYPAISA" | "JAZZCASH"
   * @param {string} [notes] - Optional payment notes (max 250 chars)
   */
  async checkout(paymentMethod, notes = '') {
    const body = { paymentMethod };
    if (notes && notes.trim()) body.notes = notes.trim();
    const response = await apiClient.post(ENDPOINTS.ORDERS.CHECKOUT, body);
    return response.data;
    // Returns: { data: { order: { id, orderNumber, status, items, totalAmount, ... }, paymentDetails: { bankName, accountTitle, accountNumber, iban } } }
  },

  /**
   * GET /orders
   * Fetches paginated order history for the authenticated student.
   * @param {number} [page=1]
   * @param {number} [limit=10]
   */
  async getOrders(page = 1, limit = 10) {
    const response = await apiClient.get(ENDPOINTS.ORDERS.LIST, {
      params: { page, limit },
    });
    return response.data;
    // Returns: { data: [ { id, orderNumber, status, totalAmount, currency, itemsCount, paymentMethod, createdAt } ], meta: { page, totalPages, total } }
  },

  /**
   * GET /orders/:orderId
   * Fetches full detail of a single order.
   * @param {string} orderId
   */
  async getOrderById(orderId) {
    const response = await apiClient.get(ENDPOINTS.ORDERS.DETAILS(orderId));
    return response.data;
    // Returns: { data: { id, orderNumber, status, subtotal, discount, totalAmount, currency, paymentMethod, items: [...], createdAt } }
  },
};

export default orderService;
