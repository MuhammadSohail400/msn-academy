import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const cartService = {
  /**
   * GET /cart
   * Requires authentication. Returns full cart with items, coupon, and totals.
   */
  async getCart() {
    const response = await apiClient.get(ENDPOINTS.CART.BASE);
    return response.data;
  },

  /**
   * POST /cart/items
   * Adds a course to the cart by courseId.
   */
  async addItem(courseId) {
    const response = await apiClient.post(ENDPOINTS.CART.ITEMS, { courseId });
    return response.data;
  },

  /**
   * DELETE /cart/items/:courseId
   * Removes a specific course item from the cart.
   */
  async removeItem(courseId) {
    const response = await apiClient.delete(ENDPOINTS.CART.ITEM(courseId));
    return response.data;
  },

  /**
   * DELETE /cart
   * Clears all items and coupon from the cart.
   */
  async clearCart() {
    const response = await apiClient.delete(ENDPOINTS.CART.BASE);
    return response.data;
  },

  /**
   * POST /cart/promo
   * Applies a promo/coupon code to the cart.
   */
  async applyPromo(code) {
    const response = await apiClient.post(ENDPOINTS.CART.PROMO, { code });
    return response.data;
  },
};

export default cartService;
