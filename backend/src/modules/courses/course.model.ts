import { Schema, model, Document, Types } from 'mongoose';

export interface ILectureResource {
  _id?: Types.ObjectId;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
}

export interface ILecture {
  _id?: Types.ObjectId;
  title: string;
  order: number;
  durationMinutes: number;
  isPreview: boolean;
  videoStreamUrl?: string | null;
  description?: string;
  keyTopics: string[];
  resources: ILectureResource[];
}

export interface IModule {
  _id?: Types.ObjectId;
  title: string;
  order: number;
  totalDurationMinutes: number;
  lectures: ILecture[];
}

export interface IInstructor {
  name: string;
  title: string;
  bio?: string;
  avatarUrl?: string | null;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  badge?: string | null;
  language: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  thumbnail: string;
  previewVideoUrl?: string | null;
  durationHours: number;
  totalLectures: number;
  enrolledStudentsCount: number;
  averageRating: number;
  totalReviews: number;
  instructor: IInstructor;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: IModule[];
  status: 'DRAFT' | 'PUBLISHED' | 'COMING_SOON' | 'ARCHIVED';
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LectureResourceSchema = new Schema<ILectureResource>(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileSize: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const LectureSchema = new Schema<ILecture>(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 1 },
    durationMinutes: { type: Number, required: true, default: 0 },
    isPreview: { type: Boolean, default: false },
    videoStreamUrl: { type: String, default: null },
    description: { type: String, default: '' },
    keyTopics: { type: [String], default: [] },
    resources: { type: [LectureResourceSchema], default: [] },
  },
  { _id: true }
);

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 1 },
    totalDurationMinutes: { type: Number, default: 0 },
    lectures: { type: [LectureSchema], default: [] },
  },
  { _id: true }
);

const InstructorSchema = new Schema<IInstructor>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: null },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Web Development', 'Artificial Intelligence', 'Data Science', 'Design', 'Marketing', 'Productivity'],
      index: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Job Ready'],
      default: 'All Levels',
    },
    badge: {
      type: String,
      enum: ['Bestseller', 'Design', 'Job Ready', 'Advanced', 'Coming Soon', null],
      default: null,
    },
    language: { type: String, default: 'Urdu / English' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    currency: { type: String, default: 'PKR' },
    thumbnail: { type: String, required: true },
    previewVideoUrl: { type: String, default: null },
    durationHours: { type: Number, default: 0 },
    totalLectures: { type: Number, default: 0 },
    enrolledStudentsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0, min: 1.0, max: 5.0 },
    totalReviews: { type: Number, default: 0 },
    instructor: { type: InstructorSchema, required: true },
    learningOutcomes: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    modules: { type: [ModuleSchema], default: [] },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'COMING_SOON', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
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

// Indexes
CourseSchema.index(
  { title: 'text', subtitle: 'text', description: 'text' },
  { language_override: 'none' }
);
CourseSchema.index({ category: 1, level: 1, status: 1 });
CourseSchema.index({ status: 1, price: 1 });
CourseSchema.index({ status: 1, createdAt: -1 });

export const Course = model<ICourse>('Course', CourseSchema);
export default Course;
