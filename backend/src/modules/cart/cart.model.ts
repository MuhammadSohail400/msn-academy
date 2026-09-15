import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem {
  courseId: Types.ObjectId;
  priceAtAddition: number;
  addedAt: Date;
}

export interface IAppliedPromoCode {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
}

export interface ICart extends Document {
  userId?: Types.ObjectId | null;
  guestSessionId?: string | null;
  items: ICartItem[];
  appliedPromoCode?: IAppliedPromoCode | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    priceAtAddition: { type: Number, required: true, min: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AppliedPromoCodeSchema = new Schema<IAppliedPromoCode>(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    discountType: { type: String, required: true, enum: ['PERCENTAGE', 'FIXED_AMOUNT'] },
    discountValue: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    guestSessionId: { type: String, default: null, index: true },
    items: { type: [CartItemSchema], default: [] },
    appliedPromoCode: { type: AppliedPromoCodeSchema, default: null },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days TTL
    },
  },
  {
    collection: 'carts',
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

// TTL index to automatically purge expired carts from MongoDB
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = model<ICart>('Cart', CartSchema);
export default Cart;
