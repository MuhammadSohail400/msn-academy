import { Types } from 'mongoose';
import { User, IUser } from '../users/user.model';
import { Course } from '../courses/course.model';
import { Order } from '../orders/order.model';
import { Payment } from '../payments/payment.model';
import { ContactInquiry as Inquiry } from '../inquiries/inquiry.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Certificate } from '../certificates/certificate.model';
import { ApiError } from '../../utils/ApiError';
import { AdminUsersQueryInput } from './admin.validation';

export interface AdminStatsResult {
  grossRevenuePKR: number;
  totalOrders: number;
  completedOrdersCount: number;
  totalStudents: number;
  activeCourses: number;
  totalCourses: number;
  pendingPaymentReviews: number;
  openInquiries: number;
  totalCertificatesIssued: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    studentName: string;
    studentEmail: string;
    courses: Array<{ title: string; price: number }>;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    createdAt: Date;
  }>;
  recentPendingPayments: Array<{
    id: string;
    orderId: string;
    studentName: string;
    studentEmail: string;
    amount: number;
    paymentMethod: string;
    status: string;
    proofImageUrl?: string;
    transactionId?: string;
    submittedAt?: Date;
    createdAt: Date;
  }>;
}

export class AdminService {
  /**
   * Aggregates real-time executive KPIs across academy operations.
   */
  public static async getStats(): Promise<AdminStatsResult> {
    const [
      revenueResult,
      totalOrders,
      completedOrdersCount,
      totalStudents,
      activeCourses,
      totalCourses,
      pendingPaymentReviews,
      openInquiries,
      totalCertificatesIssued,
      recentOrdersRaw,
      recentPendingPaymentsRaw,
    ] = await Promise.all([
      // 1. Gross Revenue (PKR) from COMPLETED orders
      Order.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      // 2. Total Orders
      Order.countDocuments(),
      // 3. Completed Orders
      Order.countDocuments({ status: 'COMPLETED' }),
      // 4. Total Students
      User.countDocuments({ role: 'STUDENT' }),
      // 5. Active Published Courses
      Course.countDocuments({ status: 'PUBLISHED' }),
      // 6. Total Courses
      Course.countDocuments(),
      // 7. Pending Bank Transfer / Wallet Verifications
      Payment.countDocuments({ status: { $in: ['UNDER_REVIEW', 'PENDING'] } }),
      // 8. Open Contact Inquiries
      Inquiry.countDocuments({ status: 'NEW' }),
      // 9. Issued Certificates
      Certificate.countDocuments(),
      // 10. Recent 6 Orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('userId', 'fullName email')
        .lean(),
      // 11. Recent Pending Payments requiring review
      Payment.find({ status: { $in: ['UNDER_REVIEW', 'PENDING'] } })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('userId', 'fullName email')
        .lean(),
    ]);

    const grossRevenuePKR = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentOrders = recentOrdersRaw.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
      studentName: order.userId?.fullName || order.billingInfo?.fullName || 'Guest Student',
      studentEmail: order.userId?.email || order.billingInfo?.email || 'N/A',
      courses: (order.items || []).map((item: any) => ({
        title: item.title,
        price: item.price,
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    }));

    const recentPendingPayments = recentPendingPaymentsRaw.map((p: any) => ({
      id: p._id.toString(),
      orderId: p.orderId ? p.orderId.toString() : '',
      studentName: p.userId?.fullName || 'Student',
      studentEmail: p.userId?.email || 'N/A',
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      status: p.status,
      proofImageUrl: p.proofImageUrl,
      transactionId: p.transactionId,
      submittedAt: p.submittedAt,
      createdAt: p.createdAt,
    }));

    return {
      grossRevenuePKR,
      totalOrders,
      completedOrdersCount,
      totalStudents,
      activeCourses,
      totalCourses,
      pendingPaymentReviews,
      openInquiries,
      totalCertificatesIssued,
      recentOrders,
      recentPendingPayments,
      overview: {
        totalRevenue: grossRevenuePKR,
        totalStudents,
        totalOrders,
        pendingPayments: pendingPaymentReviews,
        openInquiries,
        activeCourses,
      },
      recentActivity: {
        orders: recentOrders,
        payments: recentPendingPayments,
      },
    } as any;
  }

  /**
   * Paginated directory of registered students and administrators.
   */
  public static async getUsers(query: AdminUsersQueryInput) {
    const { page, limit, search, role } = query;
    const filter: Record<string, any> = {};

    if (role && role !== 'ALL') {
      filter.role = role;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ fullName: regex }, { email: regex }, { phoneNumber: regex }];
    }

    const skip = (page - 1) * limit;

    const [usersRaw, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshTokenHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Attach enrolled courses count for each user
    const userIds = usersRaw.map((u: any) => u._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const enrollmentCountMap = new Map<string, number>();
    enrollmentCounts.forEach((ec: any) => {
      enrollmentCountMap.set(ec._id.toString(), ec.count);
    });

    const users = usersRaw.map((u: any) => ({
      ...u,
      enrolledCoursesCount: enrollmentCountMap.get(u._id.toString()) || 0,
    }));

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Elevates or demotes a user's role.
   */
  public static async updateUserRole(userId: string, newRole: 'STUDENT' | 'ADMIN'): Promise<IUser> {
    const user = await User.findById(new Types.ObjectId(userId));
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    user.role = newRole;
    await user.save();
    return user;
  }
}

export default AdminService;
