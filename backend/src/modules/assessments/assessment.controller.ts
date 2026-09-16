import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class AssessmentController {
  /**
   * GET /api/v1/assessments/:courseId/briefing
   */
  public static async getAssessmentBriefing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.params.courseId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.getAssessmentBriefing(courseId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Assessment briefing loaded'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/assessments/:courseId/start
   */
  public static async startAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.params.courseId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.startAssessment(courseId, userId);

      res.status(201).json(ApiResponse.created(result, 'Assessment session started. Timer is running.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/assessments/:attemptId/answer
   */
  public static async recordAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.recordAnswer(attemptId, userId, req.body);

      res.status(200).json(ApiResponse.ok(result, 'Answer saved'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/assessments/:attemptId/review
   */
  public static async getAttemptReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.getAttemptReview(attemptId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Attempt review summary loaded'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/assessments/:attemptId/submit
   */
  public static async submitAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.submitAssessment(attemptId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Assessment evaluated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/assessments/:attemptId/result
   */
  public static async getAttemptResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = req.params.attemptId as string;
      const userId = req.user!.id;
      const result = await AssessmentService.getAttemptResult(attemptId, userId);

      res.status(200).json(ApiResponse.ok(result, 'Assessment result retrieved'));
    } catch (error) {
      next(error);
    }
  }
}
