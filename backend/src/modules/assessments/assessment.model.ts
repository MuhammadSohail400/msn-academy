import { Schema, model, Document, Types } from 'mongoose';

export interface IQuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface IQuestion {
  _id: Types.ObjectId;
  questionNumber: number;
  questionText: string;
  options: IQuestionOption[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
}

export interface IAssessment extends Document {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  passMarkPercentage: number;
  timeLimitMinutes: number;
  maxAttempts: number | null;
  questionType: 'MCQ_ONLY';
  questions: IQuestion[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    key: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D'],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [QuestionOptionSchema],
      required: true,
      validate: [
        (val: IQuestionOption[]) => val.length === 4,
        'Each assessment question must have exactly 4 options (A, B, C, D)',
      ],
    },
    correctOptionKey: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D'],
    },
  },
  { _id: true }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Assessment must be associated with a course'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
    },
    passMarkPercentage: {
      type: Number,
      required: true,
      default: 70,
    },
    timeLimitMinutes: {
      type: Number,
      required: true,
      default: 120,
    },
    maxAttempts: {
      type: Number,
      default: null,
    },
    questionType: {
      type: String,
      enum: ['MCQ_ONLY'],
      default: 'MCQ_ONLY',
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Assessment = model<IAssessment>('Assessment', AssessmentSchema);
