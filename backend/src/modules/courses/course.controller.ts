import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { GetCoursesQuery } from './course.validation';

export class CourseController {
  /**
   * GET /api/v1/courses
   */
  public static async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetCoursesQuery;
      const result = await CourseService.getCourses(query);

      res.status(200).json(
        ApiResponse.ok(result.courses, 'Courses fetched successfully', result.meta)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/courses/:slug
   */
  public static async getCourseBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const userId = req.user?.id;
      const course = await CourseService.getCourseBySlug(slug, userId);

      res.status(200).json(
        ApiResponse.ok(course, 'Course details fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/courses/:courseId/syllabus
   */
  public static async getCourseSyllabus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courseId = req.params.courseId as string;
      const syllabus = await CourseService.getCourseSyllabus(courseId);

      res.status(200).json(
        ApiResponse.ok(syllabus, 'Syllabus fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories
   */
  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CourseService.getCategories();

      res.status(200).json(
        ApiResponse.ok(categories, 'Categories fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}
