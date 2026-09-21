import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { CartService } from './cart.service';
import { ApiResponse } from '../../utils/ApiResponse';

function getSessionIdentifiers(req: Request, res: Response) {
  const userId = req.user?.id;
  let guestSessionId = (req.headers['x-guest-session-id'] as string) || req.cookies?.guest_session_id;

  if (!userId && !guestSessionId) {
    guestSessionId = crypto.randomUUID();
    res.cookie('guest_session_id', guestSessionId, {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      httpOnly: false,
      sameSite: 'lax',
    });
  }

  return { userId, guestSessionId };
}

export class CartController {
  /**
   * GET /api/v1/cart
   */
  public static async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, guestSessionId } = getSessionIdentifiers(req, res);
      const cart = await CartService.getCart(userId, guestSessionId);

      res.status(200).json(ApiResponse.ok(cart, 'Cart retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/cart/items
   */
  public static async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, guestSessionId } = getSessionIdentifiers(req, res);
      const { courseId } = req.body;
      const result = await CartService.addItem(courseId, userId, guestSessionId);

      res.status(200).json(ApiResponse.ok(result, 'Course added to cart'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/cart/items/:courseId
   */
  public static async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, guestSessionId } = getSessionIdentifiers(req, res);
      const courseId = req.params.courseId as string;
      const result = await CartService.removeItem(courseId, userId, guestSessionId);

      res.status(200).json(ApiResponse.ok(result, 'Item removed from cart'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/cart
   */
  public static async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, guestSessionId } = getSessionIdentifiers(req, res);
      await CartService.clearCart(userId, guestSessionId);

      res.status(200).json(ApiResponse.ok(null, 'Cart cleared successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/cart/promo
   */
  public static async applyPromo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, guestSessionId } = getSessionIdentifiers(req, res);
      const { code } = req.body;
      const result = await CartService.applyPromo(code, userId, guestSessionId);

      res.status(200).json(ApiResponse.ok(result, 'Coupon applied successfully'));
    } catch (error) {
      next(error);
    }
  }
}
