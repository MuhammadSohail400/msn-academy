import crypto from 'crypto';
import { Types } from 'mongoose';
import { Certificate, ICertificate } from './certificate.model';
import { User } from '../users/user.model';
import { Course } from '../courses/course.model';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export class CertificateService {
  /**
   * Generates a unique, sequential certificate number: MSN-YYYY-XXXXX
   */
  private static async generateCertificateNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await Certificate.countDocuments();
    const nextSeq = count + 1;
    const formattedSeq = String(nextSeq).padStart(5, '0');
    return `MSN-${year}-${formattedSeq}`;
  }

  /**
   * Issues an official certificate upon student passing an assessment.
   */
  public static async issueCertificate(
    userId: string,
    courseId: string,
    assessmentAttemptId: string,
    scoreAchieved: number
  ): Promise<ICertificate> {
    const existing = await Certificate.findOne({
      assessmentAttemptId: new Types.ObjectId(assessmentAttemptId),
    });
    if (existing) {
      return existing;
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('Student user record not found.');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound('Course record not found.');
    }

    const certificateNumber = await this.generateCertificateNumber();
    const verificationCode = crypto.randomBytes(16).toString('hex');
    const verificationUrl = `https://msnacademy.pk/verify/${certificateNumber}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      verificationUrl
    )}`;
    const pdfDownloadUrl = `https://storage.msnacademy.pk/certificates/${certificateNumber}.pdf`;

    const certificate = await Certificate.create({
      certificateNumber,
      verificationCode,
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      assessmentAttemptId: new Types.ObjectId(assessmentAttemptId),
      studentNameSnapshot: user.fullName,
      courseTitleSnapshot: course.title,
      scoreAchieved,
      issueDate: new Date(),
      founderSignature: 'M. Suleman Naqvi',
      qrCodeUrl,
      pdfDownloadUrl,
      status: 'VALID',
    });

    logger.info(
      { certificateNumber, student: user.fullName, course: course.title, scoreAchieved },
      '🏆 Official Certificate Issued Successfully'
    );

    return certificate;
  }

  /**
   * GET /api/v1/certificates
   * Fetches all certificates earned by the authenticated user
   */
  public static async getMyCertificates(userId: string): Promise<any[]> {
    const certs = await Certificate.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    }).sort({ issueDate: -1 });

    return certs.map((cert) => ({
      id: cert._id.toString(),
      certNumber: cert.certificateNumber,
      studentName: cert.studentNameSnapshot,
      courseTitle: cert.courseTitleSnapshot,
      issuedAt: cert.issueDate.toISOString(),
      courseId: cert.courseId.toString(),
      scorePercentage: cert.scoreAchieved,
      pdfUrl: cert.pdfDownloadUrl,
    }));
  }

  /**
   * GET /api/v1/certificates/:certificateId
   */
  public static async getCertificateById(certificateId: string, userId: string): Promise<any> {
    const cert = await Certificate.findOne({
      _id: new Types.ObjectId(certificateId),
      isDeleted: false,
    });

    if (!cert) {
      throw ApiError.notFound('Certificate record not found.');
    }

    if (cert.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to view this certificate.');
    }

    return {
      id: cert._id.toString(),
      certificateNumber: cert.certificateNumber,
      studentName: cert.studentNameSnapshot,
      courseTitle: cert.courseTitleSnapshot,
      issueDate: cert.issueDate.toISOString().split('T')[0],
      scorePercentage: cert.scoreAchieved,
      pdfUrl: cert.pdfDownloadUrl,
      verificationUrl: `https://msnacademy.pk/verify/${cert.certificateNumber}`,
    };
  }

  /**
   * GET /api/v1/certificates/:certificateId/download
   */
  public static async getDownloadLink(certificateId: string, userId: string): Promise<any> {
    const cert = await Certificate.findOne({
      _id: new Types.ObjectId(certificateId),
      isDeleted: false,
    });

    if (!cert) {
      throw ApiError.notFound('Certificate record not found.');
    }

    if (cert.userId.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to download this certificate.');
    }

    const expiryTime = Date.now() + 300 * 1000;
    const signature = crypto.randomBytes(4).toString('hex');
    const downloadUrl = `${cert.pdfDownloadUrl || `https://storage.msnacademy.pk/certificates/${cert.certificateNumber}.pdf`}?token=exp${expiryTime}_sig${signature}`;

    return {
      downloadUrl,
      expiresInSeconds: 300,
    };
  }

  /**
   * GET /api/v1/certificates/verify/:certificateNumber
   * Public unauthenticated verification endpoint
   */
  public static async verifyCertificate(certificateNumber: string): Promise<any> {
    const normalizedNumber = certificateNumber.trim().toUpperCase();
    const cert = await Certificate.findOne({
      certificateNumber: normalizedNumber,
      status: 'VALID',
      isDeleted: false,
    });

    if (!cert) {
      throw ApiError.notFound('Certificate record not found. Please verify the certificate number.');
    }

    return {
      isValid: true,
      certificateNumber: cert.certificateNumber,
      studentName: cert.studentNameSnapshot,
      courseTitle: cert.courseTitleSnapshot,
      issueDate: cert.issueDate.toISOString().split('T')[0],
      status: 'ACTIVE',
    };
  }
}
