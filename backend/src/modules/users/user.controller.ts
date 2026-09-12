import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class UserController {
  /**
   * GET /api/v1/users/profile
   */
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      const user = await UserService.getProfile(req.user.id);
      res.status(200).json(ApiResponse.ok({ user }, 'User profile retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/profile
   */
  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      const user = await UserService.updateProfile(req.user.id, req.body);
      res.status(200).json(ApiResponse.ok({ user }, 'Profile details updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/password
   */
  public static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      await UserService.changePassword(req.user.id, req.body);
      res.status(200).json(ApiResponse.ok(null, 'Password updated successfully.'));
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
