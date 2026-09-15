import { Types } from 'mongoose';
import { Order, IOrder } from './order.model';
import { Payment } from '../payments/payment.model';
import { CartService } from '../cart/cart.service';
import { User } from '../users/user.model';
import { CheckoutInput, GetOrdersQuery } from './order.validation';
import { ApiError } from '../../utils/ApiError';

export interface PaymentInstructions {
  method: 'BANK_TRANSFER' | 'EASYPAISA' | 'JAZZCASH';
  bankName?: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  branchCode?: string;
  qrCodeUrl?: string;
}

export function getPaymentInstructions(method: 'BANK_TRANSFER' | 'EASYPAISA' | 'JAZZCASH'): PaymentInstructions {
  switch (method) {
    case 'BANK_TRANSFER':
      return {
        method: 'BANK_TRANSFER',
        bankName: 'Meezan Bank Limited',
        accountTitle: 'MSN Academy Pvt Ltd',
        accountNumber: '01010102938475',
        iban: 'PK45MEZN0001010102938475',
        branchCode: '0101 (DHA Phase 5, Lahore)',
      };
    case 'EASYPAISA':
      return {
        method: 'EASYPAISA',
        accountTitle: 'MSN Academy (M. Suleman Naqvi)',
        accountNumber: '03001234567',
      };
    case 'JAZZCASH':
      return {
        method: 'JAZZCASH',
        accountTitle: 'MSN Academy (M. Suleman Naqvi)',
        accountNumber: '03007654321',
      };
  }
}

export class OrderService {
  /**
   * Converts active shopping cart into an immutable order ledger entry.
   */
  public static async checkout(userId: string, input: CheckoutInput): Promise<Record<string, unknown>> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.unauthorized('User not found.');
    }

    const cart = await CartService.findOrCreateCart(userId);
    const summary = await CartService.getFormattedCart(cart);

    if (summary.items.length === 0) {
      throw ApiError.badRequest('Cart is empty. Please add courses before checking out.');
    }

    // Generate sequential order number (e.g. MSN-ORD-00101)
    const count = await Order.countDocuments();
    const orderNumber = `MSN-ORD-${String(count + 1).padStart(5, '0')}`;

    // Resolve billing information
    const fullNameParts = user.fullName ? user.fullName.trim().split(' ') : ['Student'];
    const billingInfo = {
      firstName: input.billingInfo?.firstName || fullNameParts[0] || 'Student',
      lastName: input.billingInfo?.lastName || fullNameParts.slice(1).join(' ') || 'Learner',
      email: input.billingInfo?.email || user.email,
      phoneNumber: input.billingInfo?.phoneNumber || user.phoneNumber || '+923000000000',
    };

    // Create immutable order snapshot
    const order = await Order.create({
      orderNumber,
      userId: new Types.ObjectId(userId),
      accountMode: 'REGISTERED',
      billingInfo,
      items: summary.items.map((item) => ({
        courseId: new Types.ObjectId(item.courseId),
        courseTitle: item.title,
        price: item.price,
      })),
      subtotalAmount: summary.subtotal,
      discountAmount: summary.discount,
      totalAmount: summary.total,
      currency: 'PKR',
      paymentMethod: input.paymentMethod,
      status: 'PENDING',
      notes: input.notes || '',
      agreedToTerms: true,
    });

    // Create payment tracking record
    await Payment.create({
      orderId: order._id,
      userId: new Types.ObjectId(userId),
      paymentMethod: input.paymentMethod,
      amount: order.totalAmount,
      currency: 'PKR',
      status: 'PENDING',
    });

    // Clear cart upon successful order reservation
    await CartService.clearCart(userId);

    const paymentDetails = getPaymentInstructions(input.paymentMethod);

    return {
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        items: order.items.map((i) => ({
          courseId: i.courseId.toString(),
          title: i.courseTitle,
          price: i.price,
        })),
        subtotal: order.subtotalAmount,
        discount: order.discountAmount,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
      },
      paymentDetails,
    };
  }

  /**
   * Retrieves paginated order history for the student.
   */
  public static async getMyOrders(userId: string, query: GetOrdersQuery): Promise<Record<string, unknown>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: new Types.ObjectId(userId) };

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const formattedOrders = orders.map((o) => ({
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: o.totalAmount,
      currency: o.currency,
      itemsCount: o.items.length,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt.toISOString(),
    }));

    return {
      orders: formattedOrders,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieves single order details and receipt.
   */
  public static async getOrderById(userId: string, orderId: string): Promise<Record<string, unknown>> {
    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    }).lean();

    if (!order) {
      throw ApiError.notFound('Order not found or access unauthorized.');
    }

    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotalAmount,
      discount: order.discountAmount,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      items: order.items.map((i) => ({
        courseId: i.courseId.toString(),
        title: i.courseTitle,
        price: i.price,
      })),
      createdAt: order.createdAt.toISOString(),
    };
  }
}
