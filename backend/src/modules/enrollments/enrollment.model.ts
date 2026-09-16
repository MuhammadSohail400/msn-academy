import { Schema, model, Document, Types } from 'mongoose';

export interface ICompletedLecture {
  lectureId: Types.ObjectId;
  completedAt: Date;
}

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: 'ACTIVE' | 'COMPLETED' | 'REVOKED';
  enrolledAt: Date;
  completedAt?: Date | null;
  progressPercentage: number;
  completedLectures: ICompletedLecture[];
  lastAccessedLectureId?: Types.ObjectId | null;
  assessmentStatus: 'LOCKED' | 'ELIGIBLE' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const CompletedLectureSchema = new Schema<ICompletedLecture>(
  {
    lectureId: { type: Schema.Types.ObjectId, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'COMPLETED', 'REVOKED'],
      default: 'ACTIVE',
      index: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    progressPercentage: { type: Number, required: true, default: 0, min: 0, max: 100 },
    completedLectures: { type: [CompletedLectureSchema], default: [] },
    lastAccessedLectureId: { type: Schema.Types.ObjectId, default: null },
    assessmentStatus: {
      type: String,
      required: true,
      enum: ['LOCKED', 'ELIGIBLE', 'IN_PROGRESS', 'PASSED', 'FAILED'],
      default: 'LOCKED',
    },
  },
  {
    collection: 'enrollments',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id ? (ret._id as Types.ObjectId).toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound Unique Index: One enrollment per course per user
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
EnrollmentSchema.index({ userId: 1, status: 1 });

export const Enrollment = model<IEnrollment>('Enrollment', EnrollmentSchema);
