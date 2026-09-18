import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { setAuthCookies, clearAuthCookies } from '../../utils/cookie';
import { ApiError } from '../../utils/ApiError';

import logger from '../../utils/logger';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(201).json(
        ApiResponse.created(
          { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
          'Account created successfully. Welcome to MSN Academy!'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      setAuthCookies(res, result.accessToken, result.refreshToken);

      res.status(200).json(
        ApiResponse.ok(
          { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
          'Authentication successful. Welcome back!'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAuthCookies(res);
      res.status(200).json(ApiResponse.ok(null, 'Signed out successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      const user = await AuthService.getCurrentUser(req.user.id);
      res.status(200).json(ApiResponse.ok({ user }, 'Current session profile retrieved.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      if (result.resetToken) {
        logger.info(`[AUTH] Password reset link for ${req.body.email}: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${result.resetToken}`);
      }
      res.status(200).json(
        ApiResponse.ok(
          // In development, expose reset token to make testing painless
          process.env.NODE_ENV === 'development' && result.resetToken ? { debugResetToken: result.resetToken } : null,
          'If an account exists with this email address, password recovery instructions have been sent.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const password = req.body.password || req.body.newPassword;
      await AuthService.resetPassword(req.body.token, password);
      res.status(200).json(
        ApiResponse.ok(
          null,
          'Your password has been successfully reset. Please sign in with your new password.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refresh_token || req.body?.refreshToken;
      if (!token) {
        throw ApiError.unauthorized('Refresh token is required.');
      }

      const result = await AuthService.refreshToken(token);
      setAuthCookies(res, result.accessToken);

      res.status(200).json(ApiResponse.ok({ accessToken: result.accessToken }, 'Session token renewed successfully.'));
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
