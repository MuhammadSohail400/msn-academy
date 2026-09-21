import { Request, Response, NextFunction } from 'express';
import { LearningService } from './learning.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class LearningController {
  /**
   * GET /api/v1/learning/:courseId/overview
   */
  public static async getCourseOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const courseId = req.params.courseId as string;
      const result = await LearningService.getCourseOverview(userId, courseId);

      res.status(200).json(ApiResponse.ok(result, 'Course learning overview loaded'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/learning/:courseId/lessons/:lessonId
   */
  public static async getLessonContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const courseId = req.params.courseId as string;
      const lessonId = req.params.lessonId as string;
      const result = await LearningService.getLessonContent(userId, courseId, lessonId);

      res.status(200).json(ApiResponse.ok(result, 'Lesson content retrieved'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/learning/:courseId/lessons/:lessonId/complete
   */
  public static async completeLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const courseId = req.params.courseId as string;
      const lessonId = req.params.lessonId as string;
      const result = await LearningService.completeLesson(userId, courseId, lessonId);

      res.status(200).json(ApiResponse.ok(result, 'Lesson marked as complete'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/learning/:courseId/progress
   */
  public static async getCourseProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const courseId = req.params.courseId as string;
      const result = await LearningService.getCourseProgress(userId, courseId);

      res.status(200).json(ApiResponse.ok(result, 'Progress retrieved'));
    } catch (error) {
      next(error);
    }
  }
}
