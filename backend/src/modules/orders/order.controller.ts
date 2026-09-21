import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { GetOrdersQuery } from './order.validation';

export class OrderController {
  /**
   * POST /api/v1/orders/checkout
   */
  public static async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const guestSessionId = (req.headers['x-guest-session-id'] as string) || req.cookies?.guest_session_id;
      const result = await OrderService.checkout(userId, req.body, guestSessionId);

      res.status(201).json(ApiResponse.created(result, 'Order created successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/orders
   */
  public static async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as GetOrdersQuery;
      const result = (await OrderService.getMyOrders(userId, query)) as {
        orders: unknown[];
        meta: Record<string, unknown>;
      };

      res.status(200).json(ApiResponse.ok(result.orders, 'Order history retrieved', result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/orders/:orderId
   */
  public static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const orderId = req.params.orderId as string;
      const order = await OrderService.getOrderById(userId, orderId);

      res.status(200).json(ApiResponse.ok(order, 'Order details retrieved'));
    } catch (error) {
      next(error);
    }
  }
}
