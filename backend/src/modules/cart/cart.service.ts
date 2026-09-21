import { Types } from 'mongoose';
import { Cart, ICart } from './cart.model';
import { Course } from '../courses/course.model';
import { validatePromoCode } from '../../config/promos';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

export interface FormattedCartItem {
  courseId: string;
  title: string;
  slug: string;
  thumbnail: string;
  price: number;
  originalPrice: number | null;
}

export interface FormattedCartResponse {
  id: string;
  items: FormattedCartItem[];
  appliedCoupon: {
    code: string;
    discountPercentage: number;
    discountAmount: number;
  } | null;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export class CartService {
  /**
   * Helper: Resolves or creates a cart document for an authenticated student or guest visitor.
   */
  public static async findOrCreateCart(userId?: string, guestSessionId?: string): Promise<ICart> {
    if (!userId && !guestSessionId) {
      throw ApiError.badRequest('Session identifier required to access cart.');
    }

    let cart: ICart | null = null;

    if (userId) {
      cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });

      // If browsing as a guest, claim or merge the guest cart into the user cart!
      if (guestSessionId) {
        const guestCart = await Cart.findOne({ guestSessionId, userId: null });
        if (guestCart && guestCart.items.length > 0) {
          if (!cart) {
            cart = guestCart;
            cart.userId = new Types.ObjectId(userId);
            cart.guestSessionId = null;
            await cart.save();
          } else {
            // Merge guest cart items into existing user cart
            for (const gItem of guestCart.items) {
              const exists = cart.items.some(
                (i) => i.courseId.toString() === gItem.courseId.toString()
              );
              if (!exists) {
                cart.items.push(gItem);
              }
            }
            if (guestCart.appliedPromoCode && !cart.appliedPromoCode) {
              cart.appliedPromoCode = guestCart.appliedPromoCode;
            }
            await cart.save();
            await Cart.deleteOne({ _id: guestCart._id });
          }
        }
      }

      if (!cart) {
        cart = await Cart.create({
          userId: new Types.ObjectId(userId),
          items: [],
        });
      }
    } else if (guestSessionId) {
      cart = await Cart.findOne({ guestSessionId, userId: null });
      if (!cart) {
        cart = await Cart.create({
          guestSessionId,
          items: [],
        });
      }
    }

    return cart!;
  }

  /**
   * Helper: Computes live prices, checks promos, and formats cart according to frozen API contract.
   */
  public static async getFormattedCart(cart: ICart): Promise<FormattedCartResponse> {
    if (!cart.items || cart.items.length === 0) {
      return {
        id: cart._id.toString(),
        items: [],
        appliedCoupon: null,
        subtotal: 0,
        discount: 0,
        total: 0,
        currency: 'PKR',
      };
    }

    const courseIds = cart.items.map((i) => i.courseId);
    const courses = await Course.find({
      _id: { $in: courseIds },
      status: 'PUBLISHED',
      isDeleted: { $ne: true },
    }).lean();

    const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

    const formattedItems: FormattedCartItem[] = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const course = courseMap.get(item.courseId.toString());
      if (course) {
        formattedItems.push({
          courseId: course._id.toString(),
          title: course.title,
          slug: course.slug,
          thumbnail: course.thumbnail,
          price: course.price,
          originalPrice: course.originalPrice || null,
        });
        subtotal += course.price;
      }
    }

    // Re-evaluate applied coupon
    let appliedCoupon: FormattedCartResponse['appliedCoupon'] = null;
    let discountAmount = 0;

    if (cart.appliedPromoCode && subtotal > 0) {
      const promoResult = validatePromoCode(cart.appliedPromoCode.code, subtotal);
      if (promoResult.valid && promoResult.discountAmount) {
        discountAmount = promoResult.discountAmount;
        appliedCoupon = {
          code: promoResult.code!,
          discountPercentage: promoResult.discountPercentage || 0,
          discountAmount,
        };
      } else {
        // Discard expired or invalid coupon
        cart.appliedPromoCode = null;
        await cart.save();
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    return {
      id: cart._id.toString(),
      items: formattedItems,
      appliedCoupon,
      subtotal,
      discount: discountAmount,
      total,
      currency: 'PKR',
    };
  }

  /**
   * GET /api/v1/cart
   */
  public static async getCart(userId?: string, guestSessionId?: string): Promise<FormattedCartResponse> {
    const cart = await this.findOrCreateCart(userId, guestSessionId);
    return this.getFormattedCart(cart);
  }

  /**
   * POST /api/v1/cart/items
   */
  public static async addItem(
    courseId: string,
    userId?: string,
    guestSessionId?: string
  ): Promise<{ totalItems: number; subtotal: number; total: number }> {
    const course = await Course.findOne({
      _id: new Types.ObjectId(courseId),
      status: 'PUBLISHED',
      isDeleted: { $ne: true },
    });

    if (!course) {
      throw ApiError.badRequest('Course does not exist or is not published.');
    }

    const cart = await this.findOrCreateCart(userId, guestSessionId);

    const alreadyInCart = cart.items.some((i) => i.courseId.toString() === courseId);
    if (alreadyInCart) {
      throw ApiError.conflict('Course is already in the cart');
    }

    cart.items.push({
      courseId: course._id as Types.ObjectId,
      priceAtAddition: course.price,
      addedAt: new Date(),
    });

    await cart.save();

    const summary = await this.getFormattedCart(cart);
    return {
      totalItems: summary.items.length,
      subtotal: summary.subtotal,
      total: summary.total,
    };
  }

  /**
   * DELETE /api/v1/cart/items/:courseId
   */
  public static async removeItem(
    courseId: string,
    userId?: string,
    guestSessionId?: string
  ): Promise<{ totalItems: number; subtotal: number; total: number }> {
    const cart = await this.findOrCreateCart(userId, guestSessionId);

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.courseId.toString() !== courseId);

    if (cart.items.length === initialLength) {
      throw ApiError.notFound('Item not found in cart.');
    }

    await cart.save();

    const summary = await this.getFormattedCart(cart);
    return {
      totalItems: summary.items.length,
      subtotal: summary.subtotal,
      total: summary.total,
    };
  }

  /**
   * DELETE /api/v1/cart
   */
  public static async clearCart(userId?: string, guestSessionId?: string): Promise<void> {
    const cart = await this.findOrCreateCart(userId, guestSessionId);
    cart.items = [];
    cart.appliedPromoCode = null;
    await cart.save();
  }

  /**
   * POST /api/v1/cart/promo
   */
  public static async applyPromo(
    rawCode: string,
    userId?: string,
    guestSessionId?: string
  ): Promise<{ code: string; discountPercentage: number; discountAmount: number; newTotal: number }> {
    const cart = await this.findOrCreateCart(userId, guestSessionId);
    const summary = await this.getFormattedCart(cart);

    if (summary.items.length === 0) {
      throw ApiError.badRequest('Cart is empty. Add courses before applying a coupon.');
    }

    const promoResult = validatePromoCode(rawCode, summary.subtotal);
    if (!promoResult.valid) {
      throw ApiError.badRequest(promoResult.message || 'Invalid promo code');
    }

    cart.appliedPromoCode = {
      code: promoResult.code!,
      discountType: promoResult.discountType!,
      discountValue: promoResult.discountValue!,
    };

    await cart.save();

    const newTotal = Math.max(0, summary.subtotal - (promoResult.discountAmount || 0));

    return {
      code: promoResult.code!,
      discountPercentage: promoResult.discountPercentage || 0,
      discountAmount: promoResult.discountAmount || 0,
      newTotal,
    };
  }
}
