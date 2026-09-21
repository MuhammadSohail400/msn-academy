import crypto from 'crypto';
import { Types } from 'mongoose';
import { Enrollment } from '../enrollments/enrollment.model';
import { Course } from '../courses/course.model';
import { env } from '../../config/environment';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export class LearningService {
  /**
   * Helper: Validates student active enrollment in the target course.
   */
  private static async getVerifiedEnrollment(userId: string, courseId: string) {
    const enrollment = await Enrollment.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!enrollment || enrollment.status === 'REVOKED') {
      throw ApiError.forbidden('Access denied. Active enrollment required.');
    }

    return enrollment;
  }

  /**
   * GET /api/v1/learning/:courseId/overview
   */
  public static async getCourseOverview(userId: string, courseId: string): Promise<Record<string, unknown>> {
    const enrollment = await this.getVerifiedEnrollment(userId, courseId);

    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw ApiError.notFound('Course not found.');
    }

    const completedSet = new Set(
      (enrollment.completedLectures || []).map((l) => l.lectureId.toString())
    );

    const modules = (course.modules || []).map((mod, modIdx) => ({
      id: mod._id ? mod._id.toString() : `mod-${modIdx + 1}`,
      title: mod.title,
      order: mod.order,
      lectures: (mod.lectures || []).map((lec, lecIdx) => {
        const lecId = lec._id ? lec._id.toString() : `lec-${modIdx + 1}-${lecIdx + 1}`;
        return {
          id: lecId,
          title: lec.title,
          durationMinutes: lec.durationMinutes,
          isCompleted: completedSet.has(lecId),
        };
      }),
    }));

    const totalLectures =
      (course.modules || []).reduce((acc, m) => acc + (m.lectures || []).length, 0) ||
      course.totalLectures ||
      1;

    const canTakeAssessment =
      enrollment.assessmentStatus === 'ELIGIBLE' ||
      enrollment.assessmentStatus === 'PASSED' ||
      enrollment.progressPercentage >= 100;

    return {
      courseId: course._id.toString(),
      title: course.title,
      progressPercentage: enrollment.progressPercentage || 0,
      totalLectures,
      completedLecturesCount: enrollment.completedLectures?.length || 0,
      canTakeAssessment,
      modules,
    };
  }

  /**
   * GET /api/v1/learning/:courseId/lessons/:lessonId
   */
  public static async getLessonContent(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<Record<string, unknown>> {
    const enrollment = await this.getVerifiedEnrollment(userId, courseId);

    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw ApiError.notFound('Course not found.');
    }

    // Flatten all lectures to establish sequential navigation (next / previous)
    const allLectures: Array<{
      _id: Types.ObjectId;
      title: string;
      description?: string;
      durationMinutes: number;
      order: number;
      videoStreamUrl?: string | null;
      resources?: Array<{ title: string; fileUrl: string }>;
    }> = [];

    for (const mod of course.modules || []) {
      for (const lec of mod.lectures || []) {
        if (lec._id) {
          allLectures.push(lec as any);
        }
      }
    }

    const currentIndex = allLectures.findIndex((l) => l._id.toString() === lessonId);
    if (currentIndex === -1) {
      throw ApiError.notFound('Lesson does not exist in this course curriculum.');
    }

    const currentLecture = allLectures[currentIndex];
    const prevLessonId = currentIndex > 0 ? allLectures[currentIndex - 1]._id.toString() : null;
    const nextLessonId =
      currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1]._id.toString() : null;

    // Generate secure streaming playback URL with 2-hour HMAC expiration
    const expiryTimestamp = Math.floor(Date.now() / 1000) + 7200; // +2 hours
    const streamSecret = env.JWT_SECRET || 'msn_video_token_secret';
    const signature = crypto
      .createHmac('sha256', streamSecret)
      .update(`${lessonId}_${expiryTimestamp}`)
      .digest('hex');

    const baseUrl =
      currentLecture.videoStreamUrl ||
      `https://stream.msnacademy.pk/hls/${lessonId}/master.m3u8`;
    const separator = baseUrl.includes('?') ? '&' : '?';
    const videoStreamUrl = `${baseUrl}${separator}token=exp${expiryTimestamp}_sig${signature.slice(0, 16)}`;

    // Update last accessed lesson on enrollment
    enrollment.lastAccessedLectureId = currentLecture._id;
    await enrollment.save();

    const isCompleted = (enrollment.completedLectures || []).some(
      (l) => l.lectureId.toString() === lessonId
    );

    const resources = (currentLecture.resources || []).map((r) => ({
      title: r.title,
      downloadUrl: r.fileUrl,
    }));

    return {
      lessonId: currentLecture._id.toString(),
      title: currentLecture.title,
      description: currentLecture.description || 'Master vocational competencies in Urdu & English.',
      videoStreamUrl,
      durationMinutes: currentLecture.durationMinutes,
      order: currentLecture.order,
      isCompleted,
      nextLessonId,
      prevLessonId,
      resources,
    };
  }

  /**
   * POST /api/v1/learning/:courseId/lessons/:lessonId/complete
   */
  public static async completeLesson(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<Record<string, unknown>> {
    const enrollment = await this.getVerifiedEnrollment(userId, courseId);

    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw ApiError.notFound('Course not found.');
    }

    let totalLectures = 0;
    for (const mod of course.modules || []) {
      totalLectures += (mod.lectures || []).length;
    }
    if (totalLectures === 0) {
      totalLectures = course.totalLectures || 1;
    }

    const alreadyCompleted = (enrollment.completedLectures || []).some(
      (l) => l.lectureId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLectures.push({
        lectureId: new Types.ObjectId(lessonId),
        completedAt: new Date(),
      });
    }

    const completedCount = enrollment.completedLectures.length;
    const progressPercentage = Math.min(100, Math.round((completedCount / totalLectures) * 100));
    enrollment.progressPercentage = progressPercentage;

    // Check if 100% completed to unlock assessment
    if (progressPercentage >= 100 && enrollment.assessmentStatus === 'LOCKED') {
      enrollment.assessmentStatus = 'ELIGIBLE';
      logger.info({ userId, courseId }, '🏆 Student achieved 100% lesson completion! Assessment unlocked.');
    }

    await enrollment.save();

    const canTakeAssessment =
      enrollment.assessmentStatus === 'ELIGIBLE' ||
      enrollment.assessmentStatus === 'PASSED' ||
      progressPercentage >= 100;

    return {
      courseId: course._id.toString(),
      lessonId,
      completedLecturesCount: completedCount,
      totalLectures,
      progressPercentage,
      canTakeAssessment,
    };
  }

  /**
   * GET /api/v1/learning/:courseId/progress
   */
  public static async getCourseProgress(userId: string, courseId: string): Promise<Record<string, unknown>> {
    const enrollment = await this.getVerifiedEnrollment(userId, courseId);

    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw ApiError.notFound('Course not found.');
    }

    let totalLectures = 0;
    for (const mod of course.modules || []) {
      totalLectures += (mod.lectures || []).length;
    }
    if (totalLectures === 0) {
      totalLectures = course.totalLectures || 1;
    }

    const completedLessonIds = (enrollment.completedLectures || []).map((l) => l.lectureId.toString());
    const canTakeAssessment =
      enrollment.assessmentStatus === 'ELIGIBLE' ||
      enrollment.assessmentStatus === 'PASSED' ||
      enrollment.progressPercentage >= 100;

    return {
      courseId: course._id.toString(),
      progressPercentage: enrollment.progressPercentage || 0,
      completedLecturesCount: completedLessonIds.length,
      totalLectures,
      completedLessonIds,
      canTakeAssessment,
    };
  }
}
