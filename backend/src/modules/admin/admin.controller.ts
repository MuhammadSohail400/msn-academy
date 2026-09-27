import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class AdminController {
  /**
   * GET /api/v1/admin/stats
   * Retrieves operational overview metrics, revenue, and pending actions.
   */
  public static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getStats();
      res.status(200).json(ApiResponse.ok(stats, 'Admin operational metrics retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/users
   * Retrieves paginated student & admin directory.
   */
  public static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AdminService.getUsers(req.query as any);
      res.status(200).json(ApiResponse.ok(result.users, 'Users directory retrieved successfully.', { pagination: result.pagination }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:userId/role
   * Updates user role between STUDENT and ADMIN.
   */
  public static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const { role } = req.body;
      const user = await AdminService.updateUserRole(userId, role);
      res.status(200).json(ApiResponse.ok(user, `User role updated to ${role} successfully.`));
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
