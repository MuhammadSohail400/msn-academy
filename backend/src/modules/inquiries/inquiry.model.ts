import { Schema, model, Document, Types } from 'mongoose';

export interface IContactInquiry extends Document {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: null, trim: true },
    subject: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'RESOLVED'],
      default: 'NEW',
      index: true,
    },
    resolvedAt: { type: Date, default: null },
  },
  {
    collection: 'contact_inquiries',
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

ContactInquirySchema.index({ createdAt: -1 });

export const ContactInquiry = model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
export default ContactInquiry;
