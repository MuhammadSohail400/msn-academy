import { Schema, model, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
  _id: Types.ObjectId;
  certificateNumber: string;
  verificationCode: string;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  assessmentAttemptId: Types.ObjectId;
  studentNameSnapshot: string;
  courseTitleSnapshot: string;
  scoreAchieved: number;
  issueDate: Date;
  founderSignature: string;
  qrCodeUrl: string;
  pdfDownloadUrl: string | null;
  status: 'VALID' | 'REVOKED';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    assessmentAttemptId: {
      type: Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
      required: true,
      unique: true,
    },
    studentNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    courseTitleSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    scoreAchieved: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    founderSignature: {
      type: String,
      default: 'M. Suleman Naqvi',
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
    pdfDownloadUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['VALID', 'REVOKED'],
      default: 'VALID',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Certificate = model<ICertificate>('Certificate', CertificateSchema);
