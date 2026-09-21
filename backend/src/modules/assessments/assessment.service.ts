import { Types } from 'mongoose';
import { Assessment, IAssessment } from './assessment.model';
import { AssessmentAttempt, IAssessmentAttempt } from './assessmentAttempt.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Course } from '../courses/course.model';
import { Certificate } from '../certificates/certificate.model';
import { CertificateService } from '../certificates/certificate.service';
import { RecordAnswerInput } from './assessment.validation';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export class AssessmentService {
  /**
   * GET /api/v1/assessments/:courseId/briefing
   */
  public static async getAssessmentBriefing(courseId: string, userId: string): Promise<any> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound('Course record not found.');
    }

    const enrollment = await Enrollment.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      status: { $in: ['ACTIVE', 'COMPLETED'] },
    });

    if (!enrollment) {
      throw ApiError.forbidden('You must be enrolled in this course to view the assessment briefing.');
    }

    if (enrollment.progressPercentage < 100) {
      throw ApiError.forbidden('You must complete 100% of course lessons before attempting the final assessment.');
    }

    const assessment = await Assessment.findOne({
      courseId: new Types.ObjectId(courseId),
      status: 'ACTIVE',
    });

    if (!assessment) {
      throw ApiError.notFound('Assessment has not been configured for this course yet.');
    }

    const [previousAttempts, activeAttempt] = await Promise.all([
      AssessmentAttempt.find({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        status: { $in: ['SUBMITTED', 'EXPIRED'] },
      }).sort({ startedAt: -1 }),
      AssessmentAttempt.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        status: 'IN_PROGRESS',
      }),
    ]);

    const now = new Date();
    const hasActiveAttempt = Boolean(activeAttempt && now < activeAttempt.expiresAt);

    return {
      assessmentId: assessment._id.toString(),
      courseId: course._id.toString(),
      courseTitle: course.title,
      totalQuestions: assessment.questions.length,
      timeLimitMinutes: assessment.timeLimitMinutes,
      passingPercentage: assessment.passMarkPercentage,
      isCourseCompleted: true,
      canAttempt: true,
      hasActiveAttempt,
      activeAttemptId: hasActiveAttempt ? activeAttempt!._id.toString() : null,
      previousAttempts: previousAttempts.map((a) => ({
        attemptId: a._id.toString(),
        scorePercentage: a.scorePercentage ?? 0,
        isPassed: a.passed ?? false,
        submittedAt: a.submittedAt ? a.submittedAt.toISOString() : a.updatedAt.toISOString(),
      })),
    };
  }

  /**
   * POST /api/v1/assessments/:courseId/start
   */
  public static async startAssessment(courseId: string, userId: string): Promise<any> {
    const enrollment = await Enrollment.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      status: { $in: ['ACTIVE', 'COMPLETED'] },
    });

    if (!enrollment) {
      throw ApiError.forbidden('You must be enrolled in this course to start the assessment.');
    }

    if (enrollment.progressPercentage < 100) {
      throw ApiError.forbidden('You must complete 100% of course lessons before attempting the final assessment.');
    }

    const assessment = await Assessment.findOne({
      courseId: new Types.ObjectId(courseId),
      status: 'ACTIVE',
    });

    if (!assessment || assessment.questions.length === 0) {
      throw ApiError.notFound('Assessment question bank not available for this course.');
    }

    // Check for an active, unexpired attempt
    const activeAttempt = await AssessmentAttempt.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      status: 'IN_PROGRESS',
    });

    const now = new Date();

    if (activeAttempt) {
      if (now < activeAttempt.expiresAt) {
        // Active attempt is still valid — return existing attempt so student resumes smoothly
        return {
          attemptId: activeAttempt._id.toString(),
          startedAt: activeAttempt.startedAt.toISOString(),
          expiresAt: activeAttempt.expiresAt.toISOString(),
          timeLimitMinutes: assessment.timeLimitMinutes,
          totalQuestions: assessment.questions.length,
          questions: assessment.questions.map((q) => ({
            questionId: q._id.toString(),
            questionText: q.questionText,
            options: q.options,
          })),
          answers: activeAttempt.responses.reduce((acc: any, r: any) => {
            if (r.selectedOptionKey) acc[r.questionId.toString()] = r.selectedOptionKey;
            return acc;
          }, {}),
          flags: activeAttempt.responses.reduce((acc: any, r: any) => {
            if (r.isFlagged) acc[r.questionId.toString()] = true;
            return acc;
          }, {}),
        };
      } else {
        // Active attempt expired; mark as expired
        activeAttempt.status = 'EXPIRED';
        await activeAttempt.save();
      }
    }

    // Count past attempts to determine attemptNumber
    const pastAttemptCount = await AssessmentAttempt.countDocuments({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + assessment.timeLimitMinutes * 60 * 1000);

    const initialResponses = assessment.questions.map((q) => ({
      questionId: q._id,
      selectedOptionKey: null,
      isFlagged: false,
      answeredAt: null,
    }));

    const attempt = await AssessmentAttempt.create({
      assessmentId: assessment._id,
      courseId: new Types.ObjectId(courseId),
      userId: new Types.ObjectId(userId),
      attemptNumber: pastAttemptCount + 1,
      startedAt,
      expiresAt,
      status: 'IN_PROGRESS',
      responses: initialResponses,
      totalQuestions: assessment.questions.length,
      answeredCount: 0,
      unansweredCount: assessment.questions.length,
      flaggedCount: 0,
    });

    // Update enrollment status to IN_PROGRESS
    enrollment.assessmentStatus = 'IN_PROGRESS';
    await enrollment.save();

    // Project questions WITHOUT secret correctOptionKey
    const projectedQuestions = assessment.questions.map((q, idx) => ({
      questionId: q._id.toString(),
      order: q.questionNumber || idx + 1,
      text: q.questionText,
      options: q.options.map((opt) => ({
        key: opt.key,
        text: opt.text,
      })),
    }));

    logger.info(
      { attemptId: attempt._id, userId, courseId, questionsCount: projectedQuestions.length },
      '⏱️ Assessment session started. 120m Countdown Timer Running.'
    );

    return {
      attemptId: attempt._id.toString(),
      startedAt: attempt.startedAt.toISOString(),
      expiresAt: attempt.expiresAt.toISOString(),
      timeLimitMinutes: assessment.timeLimitMinutes,
      totalQuestions: assessment.questions.length,
      questions: projectedQuestions,
    };
  }

  /**
   * POST /api/v1/assessments/:attemptId/answer
   */
  public static async recordAnswer(attemptId: string, userId: string, input: RecordAnswerInput): Promise<any> {
    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      throw ApiError.notFound('Assessment attempt not found.');
    }

    if (attempt.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to modify this assessment attempt.');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw ApiError.forbidden('Assessment attempt is no longer in progress.');
    }

    // Check timer expiration
    if (Date.now() > attempt.expiresAt.getTime()) {
      attempt.status = 'EXPIRED';
      await attempt.save();
      throw ApiError.gone('Assessment session has expired. Modifications are no longer accepted.');
    }

    const responseItem = attempt.responses.find(
      (r) => r.questionId.toString() === input.questionId
    );

    if (!responseItem) {
      throw ApiError.notFound('Question not found in this assessment attempt.');
    }

    if (input.selectedOptionKey !== undefined) {
      responseItem.selectedOptionKey = input.selectedOptionKey;
      responseItem.answeredAt = input.selectedOptionKey ? new Date() : null;
    }

    if (input.isFlagged !== undefined) {
      responseItem.isFlagged = input.isFlagged;
    }

    // Recalculate metrics
    attempt.answeredCount = attempt.responses.filter((r) => r.selectedOptionKey !== null).length;
    attempt.unansweredCount = attempt.totalQuestions - attempt.answeredCount;
    attempt.flaggedCount = attempt.responses.filter((r) => r.isFlagged).length;

    await attempt.save();

    return {
      questionId: input.questionId,
      selectedOptionKey: responseItem.selectedOptionKey,
      isFlagged: responseItem.isFlagged,
    };
  }

  /**
   * GET /api/v1/assessments/:attemptId/review
   */
  public static async getAttemptReview(attemptId: string, userId: string): Promise<any> {
    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      throw ApiError.notFound('Assessment attempt not found.');
    }

    if (attempt.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to view this assessment attempt.');
    }

    const remainingSeconds = Math.max(0, Math.floor((attempt.expiresAt.getTime() - Date.now()) / 1000));

    if (remainingSeconds === 0 && attempt.status === 'IN_PROGRESS') {
      attempt.status = 'EXPIRED';
      await attempt.save();
      throw ApiError.gone('Exam session has expired.');
    }

    const questionSummary = attempt.responses.map((r, idx) => ({
      questionId: r.questionId.toString(),
      order: idx + 1,
      isAnswered: r.selectedOptionKey !== null,
      isFlagged: r.isFlagged,
    }));

    return {
      attemptId: attempt._id.toString(),
      remainingSeconds,
      totalQuestions: attempt.totalQuestions,
      answeredCount: attempt.answeredCount,
      unansweredCount: attempt.unansweredCount,
      flaggedCount: attempt.flaggedCount,
      questionSummary,
    };
  }

  /**
   * POST /api/v1/assessments/:attemptId/submit
   */
  public static async submitAssessment(attemptId: string, userId: string): Promise<any> {
    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      throw ApiError.notFound('Assessment attempt not found.');
    }

    if (attempt.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to submit this assessment attempt.');
    }

    if (attempt.status === 'SUBMITTED') {
      throw ApiError.badRequest('This assessment attempt has already been submitted.');
    }

    const assessment = await Assessment.findById(attempt.assessmentId);
    if (!assessment) {
      throw ApiError.notFound('Parent assessment configuration not found.');
    }

    // Evaluate answers against master keys
    const questionKeyMap = new Map(
      assessment.questions.map((q) => [q._id.toString(), q.correctOptionKey])
    );

    let correctAnswersCount = 0;
    for (const resp of attempt.responses) {
      const correctKey = questionKeyMap.get(resp.questionId.toString());
      if (correctKey && resp.selectedOptionKey === correctKey) {
        correctAnswersCount++;
      }
    }

    const scorePercentage = Math.round((correctAnswersCount / attempt.totalQuestions) * 100);
    const isPassed = scorePercentage >= assessment.passMarkPercentage;
    const submittedAt = new Date();
    const timeTakenSeconds = Math.max(1, Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000));

    attempt.status = 'SUBMITTED';
    attempt.submittedAt = submittedAt;
    attempt.timeTakenSeconds = timeTakenSeconds;
    attempt.correctAnswersCount = correctAnswersCount;
    attempt.scorePercentage = scorePercentage;
    attempt.passed = isPassed;
    await attempt.save();

    const enrollment = await Enrollment.findOne({
      userId: attempt.userId,
      courseId: attempt.courseId,
    });

    let certificateId: string | null = null;

    if (isPassed) {
      if (enrollment) {
        enrollment.assessmentStatus = 'PASSED';
        enrollment.status = 'COMPLETED';
        enrollment.completedAt = submittedAt;
        await enrollment.save();
      }

      // Automatically issue official certificate
      const certificate = await CertificateService.issueCertificate(
        userId,
        attempt.courseId.toString(),
        attempt._id.toString(),
        scorePercentage
      );
      certificateId = certificate._id.toString();
    } else {
      if (enrollment) {
        enrollment.assessmentStatus = 'FAILED';
        await enrollment.save();
      }
    }

    logger.info(
      {
        attemptId: attempt._id,
        scorePercentage,
        isPassed,
        certificateId,
      },
      '📝 Assessment evaluated and scored successfully'
    );

    return {
      attemptId: attempt._id.toString(),
      totalQuestions: attempt.totalQuestions,
      correctAnswersCount,
      scorePercentage,
      passingPercentage: assessment.passMarkPercentage,
      isPassed,
      submittedAt: submittedAt.toISOString(),
      certificateId,
    };
  }

  /**
   * GET /api/v1/assessments/:attemptId/result
   */
  public static async getAttemptResult(attemptId: string, userId: string): Promise<any> {
    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      throw ApiError.notFound('Assessment attempt not found.');
    }

    if (attempt.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to view this assessment result.');
    }

    const course = await Course.findById(attempt.courseId);
    const assessment = await Assessment.findById(attempt.assessmentId);

    const certificate = attempt.passed
      ? await Certificate.findOne({ assessmentAttemptId: attempt._id })
      : null;

    return {
      attemptId: attempt._id.toString(),
      courseTitle: course ? course.title : 'MSN Academy Vocational Course',
      totalQuestions: attempt.totalQuestions,
      correctAnswersCount: attempt.correctAnswersCount ?? 0,
      scorePercentage: attempt.scorePercentage ?? 0,
      passingPercentage: assessment ? assessment.passMarkPercentage : 70,
      isPassed: attempt.passed ?? false,
      certificateId: certificate ? certificate._id.toString() : null,
    };
  }
}
