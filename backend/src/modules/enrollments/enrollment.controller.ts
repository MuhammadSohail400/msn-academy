import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from './enrollment.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { GetEnrollmentsQuery } from './enrollment.validation';

export class EnrollmentController {
  /**
   * GET /api/v1/student/enrollments
   */
  public static async getMyEnrollments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as GetEnrollmentsQuery;
      const result = await EnrollmentService.getMyEnrollments(userId, query);

      res.status(200).json(ApiResponse.ok(result.enrollments, 'Enrolled courses retrieved', result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/student/dashboard-summary
   */
  public static async getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await EnrollmentService.getDashboardSummary(userId);

      res.status(200).json(ApiResponse.ok(result, 'Dashboard statistics retrieved'));
    } catch (error) {
      next(error);
    }
  }
}
