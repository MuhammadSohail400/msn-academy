import { Types } from 'mongoose';
import { Enrollment, IEnrollment } from './enrollment.model';
import { Course } from '../courses/course.model';
import { Order } from '../orders/order.model';
import { GetEnrollmentsQuery } from './enrollment.validation';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export interface FormattedEnrollment {
  enrollmentId: string;
  courseId: string;
  title: string;
  slug: string;
  thumbnail: string;
  progressPercentage: number;
  totalLectures: number;
  completedLecturesCount: number;
  isCompleted: boolean;
  lastAccessedLesson: {
    id: string;
    title: string;
  } | null;
  enrolledAt: string;
}

export class EnrollmentService {
  /**
   * Provisions course enrollments automatically when an order payment is approved.
   */
  public static async provisionEnrollmentsForOrder(orderId: string, userId: string): Promise<string[]> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found for enrollment provisioning.');
    }

    const provisionedCourseIds: string[] = [];

    for (const item of order.items) {
      const existing = await Enrollment.findOne({
        userId: new Types.ObjectId(userId),
        courseId: item.courseId,
      });

      if (!existing) {
        await Enrollment.create({
          userId: new Types.ObjectId(userId),
          courseId: item.courseId,
          orderId: order._id,
          status: 'ACTIVE',
          progressPercentage: 0,
          completedLectures: [],
          assessmentStatus: 'LOCKED',
          enrolledAt: new Date(),
        });

        // Increment enrolled student count on Course
        await Course.findByIdAndUpdate(item.courseId, {
          $inc: { enrolledStudentsCount: 1 },
        });

        provisionedCourseIds.push(item.courseId.toString());
      } else {
        provisionedCourseIds.push(existing.courseId.toString());
      }
    }

    logger.info(
      { orderId, userId, courseCount: provisionedCourseIds.length },
      '🎓 Course enrollments successfully provisioned for student'
    );

    return provisionedCourseIds;
  }

  /**
   * Retrieves paginated enrolled courses for student learning dashboard.
   */
  public static async getMyEnrollments(
    userId: string,
    query: GetEnrollmentsQuery
  ): Promise<{ enrollments: FormattedEnrollment[]; meta: Record<string, unknown> }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.status && query.status !== 'ALL') {
      filter.status = query.status;
    }

    const [total, enrollments] = await Promise.all([
      Enrollment.countDocuments(filter),
      Enrollment.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();
    const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

    const formattedList: FormattedEnrollment[] = [];

    for (const enrollment of enrollments) {
      const course = courseMap.get(enrollment.courseId.toString());
      if (course) {
        // Resolve last accessed lesson or default to first lecture in first module
        let lastLesson: { id: string; title: string } | null = null;

        if (enrollment.lastAccessedLectureId) {
          for (const mod of course.modules || []) {
            const found = mod.lectures?.find(
              (l) => l._id && l._id.toString() === enrollment.lastAccessedLectureId?.toString()
            );
            if (found && found._id) {
              lastLesson = { id: found._id.toString(), title: found.title };
              break;
            }
          }
        }

        if (!lastLesson && course.modules && course.modules.length > 0) {
          const firstModule = course.modules[0];
          if (firstModule.lectures && firstModule.lectures.length > 0) {
            const firstLec = firstModule.lectures[0];
            if (firstLec._id) {
              lastLesson = { id: firstLec._id.toString(), title: firstLec.title };
            }
          }
        }

        const totalLectures =
          (course.modules || []).reduce((acc, m) => acc + (m.lectures || []).length, 0) ||
          course.totalLectures ||
          1;

        formattedList.push({
          enrollmentId: enrollment._id.toString(),
          courseId: course._id.toString(),
          title: course.title,
          slug: course.slug,
          thumbnail: course.thumbnail,
          progressPercentage: enrollment.progressPercentage || 0,
          totalLectures,
          completedLecturesCount: enrollment.completedLectures?.length || 0,
          isCompleted: enrollment.status === 'COMPLETED',
          lastAccessedLesson: lastLesson,
          enrolledAt: enrollment.enrolledAt.toISOString(),
        });
      }
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      enrollments: formattedList,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Aggregates student learning KPIs and recent active course telemetry.
   */
  public static async getDashboardSummary(userId: string): Promise<Record<string, unknown>> {
    const userObjectId = new Types.ObjectId(userId);

    const [enrolledCount, activeCount, completedCount, recentEnrollments] = await Promise.all([
      Enrollment.countDocuments({ userId: userObjectId }),
      Enrollment.countDocuments({ userId: userObjectId, status: 'ACTIVE' }),
      Enrollment.countDocuments({ userId: userObjectId, status: 'COMPLETED' }),
      Enrollment.find({ userId: userObjectId }).sort({ updatedAt: -1 }).limit(3).lean(),
    ]);

    const recentCourseIds = recentEnrollments.map((e) => e.courseId);
    const recentCourses = await Course.find({ _id: { $in: recentCourseIds } }).lean();
    const courseMap = new Map(recentCourses.map((c) => [c._id.toString(), c]));

    const recentActivity = recentEnrollments
      .map((e) => {
        const course = courseMap.get(e.courseId.toString());
        if (!course) return null;

        let lessonTitle = 'Course Overview';
        if (e.lastAccessedLectureId) {
          for (const mod of course.modules || []) {
            const found = mod.lectures?.find(
              (l) => l._id && l._id.toString() === e.lastAccessedLectureId?.toString()
            );
            if (found) {
              lessonTitle = found.title;
              break;
            }
          }
        } else if (course.modules?.[0]?.lectures?.[0]) {
          lessonTitle = course.modules[0].lectures[0].title;
        }

        return {
          courseId: course._id.toString(),
          courseTitle: course.title,
          lessonTitle,
          progressPercentage: e.progressPercentage || 0,
          lastWatchedAt: e.updatedAt.toISOString(),
        };
      })
      .filter(Boolean);

    return {
      enrolledCoursesCount: enrolledCount,
      activeCoursesCount: activeCount,
      completedCoursesCount: completedCount,
      certificatesEarnedCount: completedCount, // Each completed course earns a certificate
      recentActivity,
    };
  }
}
