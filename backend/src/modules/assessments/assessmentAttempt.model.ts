import { Schema, model, Document, Types } from 'mongoose';

export interface IAttemptResponse {
  questionId: Types.ObjectId;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | null;
  isFlagged: boolean;
  answeredAt: Date | null;
}

export interface IAssessmentAttempt extends Document {
  _id: Types.ObjectId;
  assessmentId: Types.ObjectId;
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  attemptNumber: number;
  startedAt: Date;
  expiresAt: Date;
  submittedAt: Date | null;
  timeTakenSeconds: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  responses: IAttemptResponse[];
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
  correctAnswersCount: number | null;
  scorePercentage: number | null;
  passed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

const AttemptResponseSchema = new Schema<IAttemptResponse>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    selectedOptionKey: {
      type: String,
      enum: ['A', 'B', 'C', 'D', null],
      default: null,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    timeTakenSeconds: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'SUBMITTED', 'EXPIRED'],
      default: 'IN_PROGRESS',
      index: true,
    },
    responses: {
      type: [AttemptResponseSchema],
      default: [],
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answeredCount: {
      type: Number,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    flaggedCount: {
      type: Number,
      default: 0,
    },
    correctAnswersCount: {
      type: Number,
      default: null,
    },
    scorePercentage: {
      type: Number,
      default: null,
    },
    passed: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AssessmentAttemptSchema.index({ userId: 1, courseId: 1, status: 1 });

export const AssessmentAttempt = model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);
