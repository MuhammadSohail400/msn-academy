# MSN Academy — Phase 1 Code Review & Technical Walkthrough

Is document mein **Phase 1: Backend Admin REST Endpoints** ke andar kiye gaye tamam kaam ka mukammal step-by-step code review aur explanation darj hai taake aap har file ka code aur logic asani se samajh sakein.

---

## 📑 Fihrist (Table of Contents)

1. [Architectural Overview & Security Flow](#1-architectural-overview--security-flow)
2. [Step 1: Admin Core Module (`modules/admin`)](#2-step-1-admin-core-module-modulesadmin)
   - [`admin.validation.ts`](#21-adminvalidationts)
   - [`admin.service.ts`](#22-adminservicets)
   - [`admin.controller.ts`](#23-admincontrollerts)
   - [`admin.routes.ts`](#24-adminroutests)
3. [Step 2: Course Catalog Management CRUD (`modules/courses`)](#3-step-2-course-catalog-management-crud-modulescourses)
   - [`course.validation.ts`](#31-coursevalidationts)
   - [`course.service.ts`](#32-courseservicets)
   - [`course.controller.ts`](#33-coursecontrollerts)
   - [`course.routes.ts`](#34-courseroutests)
4. [Step 3: Payment Verification Desk Extension (`modules/payments`)](#4-step-3-payment-verification-desk-extension-modulespayments)
5. [Step 4: Commercial Orders Master Ledger (`modules/orders`)](#5-step-4-commercial-orders-master-ledger-modulesorders)
6. [Step 5: Contact Leads & Inquiries Pipeline (`modules/inquiries`)](#6-step-5-contact-leads--inquiries-pipeline-modulesinquiries)
7. [Step 6: Central API Router Mount (`src/routes/index.ts`)](#7-step-6-central-api-router-mount-srcroutesindexts)
8. [Step 7: Automated Verification Suite (`verifyPhase6Admin.ts`)](#8-step-7-automated-verification-suite-verifyphase6admints)

---

## 1. Architectural Overview & Security Flow

Har administrative endpoint par **Two-Tier Security** enforce ki gayi hai:

```text
HTTP Request (Cookies / Bearer Token)
     ↓
[1. authGuard]   → JWT decrypt karta hai aur verify karta hai ke user logged in hai.
     ↓
[2. roleGuard('ADMIN')] → Verify karta hai ke req.user.role === 'ADMIN'. 
                          Agar student ho to foran HTTP 403 Forbidden return karta hai.
     ↓
[3. validateRequest]   → Zod schema ke sath input validate karta hai.
     ↓
[Controller & Service]  → Business logic execute hoti hai.
```

* **Super Admin Login Credentials (in MongoDB):**
  * Email: `admin@msnacademy.pk`
  * Password: `Pakistan@12345`

---

## 2. Step 1: Admin Core Module (`modules/admin`)

Is module ka maqsad live operational KPIs aggregate karna aur students/admins directory manage karna hai.

### 2.1 `admin.validation.ts`
[`backend/src/modules/admin/admin.validation.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/admin/admin.validation.ts)

Yeh file query parameters aur role updates ko sanitize karti hai:

```typescript
import { z } from 'zod';

export const adminUsersQuerySchema = z.object({
  page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z.string().optional().default('10').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
  search: z.string().trim().optional(),
  role: z.enum(['STUDENT', 'ADMIN', 'ALL']).optional().default('ALL'),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['STUDENT', 'ADMIN'], {
    error: 'Role must be either STUDENT or ADMIN',
  }),
});

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export type AdminUsersQueryInput = z.infer<typeof adminUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
```

### 2.2 `admin.service.ts`
[`backend/src/modules/admin/admin.service.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/admin/admin.service.ts)

Is service ke 3 main functions hain:
1. `getStats()`: MongoDB Aggregation pipeline se total revenue (sum of completed orders), active students count, published courses, pending bank payments, open inquiries, recent orders aur recent payment receipts ek single fast query call mein gather karta hai.
2. `getUsers()`: Students aur Admins ki list fetch karta hai aur har user ke enrolled courses count ko attach karta hai.
3. `updateUserRole()`: Kisi bhi user ko Admin banana ya Student mein revert karna.

```typescript
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

export class AdminService {
  public static async getStats() {
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
      Order.countDocuments(),
      Order.countDocuments({ status: 'COMPLETED' }),
      User.countDocuments({ role: 'STUDENT' }),
      Course.countDocuments({ status: 'PUBLISHED' }),
      Course.countDocuments(),
      Payment.countDocuments({ status: { $in: ['UNDER_REVIEW', 'PENDING'] } }),
      Inquiry.countDocuments({ status: 'NEW' }),
      Certificate.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('userId', 'fullName email').lean(),
      Payment.find({ status: { $in: ['UNDER_REVIEW', 'PENDING'] } }).sort({ createdAt: -1 }).limit(6).populate('userId', 'fullName email').lean(),
    ]);

    const grossRevenuePKR = revenueResult.length > 0 ? revenueResult[0].total : 0;

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
      recentOrders: recentOrdersRaw.map((o: any) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        studentName: o.userId?.fullName || 'Student',
        studentEmail: o.userId?.email || 'N/A',
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        status: o.status,
        createdAt: o.createdAt,
      })),
      recentPendingPayments: recentPendingPaymentsRaw.map((p: any) => ({
        id: p._id.toString(),
        orderId: p.orderId?.toString(),
        studentName: p.userId?.fullName || 'Student',
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        status: p.status,
        proofImageUrl: p.proofImageUrl,
        transactionId: p.transactionId,
        createdAt: p.createdAt,
      })),
    };
  }

  public static async getUsers(query: AdminUsersQueryInput) {
    const { page, limit, search, role } = query;
    const filter: Record<string, any> = {};
    if (role && role !== 'ALL') filter.role = role;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ fullName: regex }, { email: regex }, { phoneNumber: regex }];
    }
    const skip = (page - 1) * limit;

    const [usersRaw, total] = await Promise.all([
      User.find(filter).select('-passwordHash -refreshTokenHash').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    // Attach enrollment counts
    const userIds = usersRaw.map((u: any) => u._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const map = new Map<string, number>();
    enrollmentCounts.forEach((ec: any) => map.set(ec._id.toString(), ec.count));

    return {
      users: usersRaw.map((u: any) => ({ ...u, enrolledCoursesCount: map.get(u._id.toString()) || 0 })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  public static async updateUserRole(userId: string, newRole: 'STUDENT' | 'ADMIN') {
    const user = await User.findById(new Types.ObjectId(userId));
    if (!user) throw ApiError.notFound('User not found.');
    user.role = newRole;
    await user.save();
    return user;
  }
}
```

### 2.3 `admin.controller.ts` & `admin.routes.ts`
[`backend/src/modules/admin/admin.controller.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/admin/admin.controller.ts)
[`backend/src/modules/admin/admin.routes.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/admin/admin.routes.ts)

Routes ko `authGuard` aur `roleGuard('ADMIN')` ke zariye lock kiya gaya hai:

```typescript
const router = Router();

router.use(authGuard);
router.use(roleGuard('ADMIN'));

router.get('/stats', AdminController.getStats);
router.get('/users', validateRequest({ query: adminUsersQuerySchema }), AdminController.getUsers);
router.patch('/users/:userId/role', validateRequest({ params: userIdParamSchema, body: updateUserRoleSchema }), AdminController.updateUserRole);

export default router;
```

---

## 3. Step 2: Course Catalog Management CRUD (`modules/courses`)

Pehle courses sirf public `GET` support karte thay. Admin panel ke liye humne Create (`POST`), Edit (`PUT`), aur Delete (`DELETE`) functions add kiye.

### 3.1 `course.validation.ts`
[`backend/src/modules/courses/course.validation.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/courses/course.validation.ts)

Zod schema add kiya gaya:
```typescript
export const createCourseSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).optional(),
  subtitle: z.string().trim().min(5).default('Comprehensive practical course for tech professionals.'),
  description: z.string().trim().min(10),
  category: z.enum(['Web Development', 'Artificial Intelligence', 'Data Science', 'Design', 'Marketing', 'Productivity']),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Job Ready']).default('All Levels'),
  price: z.number().min(0),
  originalPrice: z.number().min(0).nullable().optional(),
  durationHours: z.number().min(0).default(10),
  thumbnail: z.string().trim().default('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON', 'ARCHIVED']).default('PUBLISHED'),
});

export const updateCourseSchema = createCourseSchema.partial();
export const courseIdParamSchema = z.object({
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid ObjectId'),
});
```

### 3.2 `course.service.ts`
[`backend/src/modules/courses/course.service.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/courses/course.service.ts)

Course create, update, aur delete methods:
```typescript
  public static async createCourse(input: any): Promise<ICourse> {
    // Automated slug generation from title if not provided
    const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existing = await Course.findOne({ slug });
    if (existing) {
      throw ApiError.conflict(`A course with slug '${slug}' already exists. Please provide a unique slug.`);
    }

    const course = await Course.create({
      ...input,
      slug,
      status: input.status || 'PUBLISHED',
      currency: input.currency || 'PKR',
    });

    // Invalidate categories cache in Redis
    try { await redis.del(CATEGORIES_CACHE_KEY); } catch (e) {}

    return course;
  }

  public static async updateCourse(courseId: string, input: any): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course || course.isDeleted) throw ApiError.notFound('Course not found.');

    if (input.slug && input.slug !== course.slug) {
      const existing = await Course.findOne({ slug: input.slug, _id: { $ne: course._id } });
      if (existing) throw ApiError.conflict(`A course with slug '${input.slug}' already exists.`);
    }

    Object.assign(course, input);
    await course.save();

    try { await redis.del(CATEGORIES_CACHE_KEY); } catch (e) {}
    return course;
  }

  public static async deleteCourse(courseId: string): Promise<void> {
    const course = await Course.findById(courseId);
    if (!course) throw ApiError.notFound('Course not found.');

    // Soft delete & archive
    course.isDeleted = true;
    course.deletedAt = new Date();
    course.status = 'ARCHIVED';
    await course.save();

    try { await redis.del(CATEGORIES_CACHE_KEY); } catch (e) {}
  }
```

### 3.3 `course.routes.ts`
[`backend/src/modules/courses/course.routes.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/courses/course.routes.ts)

```typescript
// Protected Admin routes
router.post('/', authGuard, roleGuard('ADMIN'), validateRequest({ body: createCourseSchema }), CourseController.createCourse);
router.put('/:courseId', authGuard, roleGuard('ADMIN'), validateRequest({ params: courseIdParamSchema, body: updateCourseSchema }), CourseController.updateCourse);
router.delete('/:courseId', authGuard, roleGuard('ADMIN'), validateRequest({ params: courseIdParamSchema }), CourseController.deleteCourse);
```

---

## 4. Step 3: Payment Verification Desk Extension (`modules/payments`)
[`backend/src/modules/payments/payment.routes.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/payments/payment.routes.ts)

Admin payment approval flow already backend mein bana hua tha (`PATCH /:id/admin-review`). Humne admin desk ke liye list route add kiya:

```typescript
router.get('/admin/all', roleGuard('ADMIN'), PaymentController.getAllPayments);
```

Jab admin `/api/v1/payments/admin/all?status=UNDER_REVIEW` call karta hai, to `PaymentService.getAllPayments` tamam pending bank transfer proofs, student name, email, aur amount return karta hai.

---

## 5. Step 4: Commercial Orders Master Ledger (`modules/orders`)

Admin ko tamam students ke orders dekhne ke liye `getAllAdminOrders` implement kiya gaya:

### `order.service.ts`
[`backend/src/modules/orders/order.service.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/orders/order.service.ts)

```typescript
  public static async getAllAdminOrders(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status && query.status !== 'ALL') filter.status = query.status.toUpperCase();
    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ orderNumber: regex }, { 'billingInfo.fullName': regex }, { 'billingInfo.email': regex }];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('userId', 'fullName email phoneNumber').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return {
      orders: orders.map((o: any) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        studentName: o.userId?.fullName || o.billingInfo?.fullName || 'Student',
        studentEmail: o.userId?.email || o.billingInfo?.email || 'N/A',
        studentPhone: o.userId?.phoneNumber || o.billingInfo?.phone || 'N/A',
        status: o.status,
        totalAmount: o.totalAmount,
        currency: o.currency,
        paymentMethod: o.paymentMethod,
        items: o.items || [],
        createdAt: o.createdAt ? o.createdAt.toISOString() : null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }
```

### `order.routes.ts`
[`backend/src/modules/orders/order.routes.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/orders/order.routes.ts)

```typescript
router.get('/admin/all', roleGuard('ADMIN'), OrderController.getAllAdminOrders);
```

---

## 6. Step 5: Contact Leads & Inquiries Pipeline (`modules/inquiries`)

Website ke Contact form submissions ko track karne aur status update karne ke liye:

### `inquiry.service.ts`
[`backend/src/modules/inquiries/inquiry.service.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/inquiries/inquiry.service.ts)

```typescript
  public static async getAllAdminInquiries(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status && query.status !== 'ALL') filter.status = query.status.toUpperCase();
    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }, { subject: regex }];
    }

    const [inquiries, total] = await Promise.all([
      ContactInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactInquiry.countDocuments(filter),
    ]);

    return {
      inquiries: inquiries.map((inq: any) => ({
        id: inq._id.toString(),
        fullName: inq.fullName,
        email: inq.email,
        phone: inq.phone || 'N/A',
        subject: inq.subject,
        message: inq.message,
        status: inq.status,
        createdAt: inq.createdAt ? inq.createdAt.toISOString() : null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  public static async updateInquiryStatus(inquiryId: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') {
    const inquiry = await ContactInquiry.findById(inquiryId);
    if (!inquiry) throw new Error('Inquiry not found');
    inquiry.status = status;
    await inquiry.save();
    return inquiry;
  }
```

### `inquiry.routes.ts`
[`backend/src/modules/inquiries/inquiry.routes.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/modules/inquiries/inquiry.routes.ts)

```typescript
router.get('/admin/all', authGuard, roleGuard('ADMIN'), InquiryController.getAllInquiries);
router.patch('/admin/:inquiryId/status', authGuard, roleGuard('ADMIN'), validateRequest({ params: inquiryIdParamSchema, body: updateInquiryStatusSchema }), InquiryController.updateStatus);
```

---

## 7. Step 6: Central API Router Mount (`src/routes/index.ts`)
[`backend/src/routes/index.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/routes/index.ts)

Naya admin router API Gateway mein mount kiya gaya:

```typescript
import adminRoutes from '../modules/admin/admin.routes';

// ...
// 7. Administrative Operations & Management Routes
apiRouter.use('/admin', adminRoutes);
```

---

## 8. Step 7: Automated Verification Suite (`verifyPhase6Admin.ts`)
[`backend/src/scripts/verifyPhase6Admin.ts`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/backend/src/scripts/verifyPhase6Admin.ts)

Is script ne live server par tamam 9 scenarios ko automatically execute kiya:
1. `GET /health` ➔ 200 OK.
2. Student login karke `GET /admin/stats` call kiya ➔ **403 Forbidden** (RBAC verify ho gaya).
3. Super Admin login kiya (`admin@msnacademy.pk`) ➔ Token extract kiya.
4. `GET /admin/stats` call kiya ➔ Real-time metrics verify huay: Gross Revenue PKR 121,000, 29 Students, 6 Courses.
5. Course Create (`POST /courses`) kiya ➔ 201 Created.
6. Course Price Update (`PUT /courses/:id`) kiya ➔ 200 OK (Price changed to PKR 11,000).
7. Course Soft-Delete (`DELETE /courses/:id`) kiya ➔ 200 OK.
8. Payments Desk (`GET /payments/admin/all`) ➔ 20 records retrieve huay.
9. Orders Ledger (`GET /orders/admin/all`) ➔ 15 records retrieve huay.
10. Users Directory (`GET /admin/users`) ➔ 10 users retrieve huay.
11. Contact Leads (`GET /contact/admin/all`) ➔ 20 leads retrieve huay.

### Output:
```text
========================================================================
🎉 ALL PHASE 1 ADMIN BACKEND REST APIS VERIFIED AND PASSING 100%!
========================================================================
```

---
*MSN Academy Engineering Team — Phase 1 Code Review Complete*
