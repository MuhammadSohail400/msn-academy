import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  paymentMethod: 'BANK_TRANSFER' | 'EASYPAISA' | 'JAZZCASH';
  amount: number;
  currency: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  transactionReference?: string | null;
  proofAttachmentUrl?: string | null;
  verificationNotes?: string | null;
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  gatewayResponse?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH'],
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'PKR' },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    transactionReference: { type: String, default: null, trim: true },
    proofAttachmentUrl: { type: String, default: null, trim: true },
    verificationNotes: { type: String, default: null, trim: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    gatewayResponse: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: 'payments',
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

PaymentSchema.index({ orderId: 1, status: 1 });

export const Payment = model<IPayment>('Payment', PaymentSchema);
export default Payment;
