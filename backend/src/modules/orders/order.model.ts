import { Schema, model, Document, Types } from 'mongoose';

export interface IOrderItem {
  courseId: Types.ObjectId;
  courseTitle: string;
  price: number;
}

export interface IBillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  accountMode: 'GUEST' | 'REGISTERED';
  billingInfo: IBillingInfo;
  items: IOrderItem[];
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'BANK_TRANSFER' | 'EASYPAISA' | 'JAZZCASH';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  agreedToTerms: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const BillingInfoSchema = new Schema<IBillingInfo>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      match: [/^MSN-ORD-[0-9]{3,}$/, 'Order number must follow format MSN-ORD-XXXXX'],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountMode: { type: String, required: true, enum: ['GUEST', 'REGISTERED'], default: 'REGISTERED' },
    billingInfo: { type: BillingInfoSchema, required: true },
    items: { type: [OrderItemSchema], required: true, default: [] },
    subtotalAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'PKR' },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH'],
      default: 'BANK_TRANSFER',
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    agreedToTerms: { type: Boolean, required: true, default: true },
    notes: { type: String, default: '' },
  },
  {
    collection: 'orders',
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

OrderSchema.index({ userId: 1, createdAt: -1 });

export const Order = model<IOrder>('Order', OrderSchema);
export default Order;
