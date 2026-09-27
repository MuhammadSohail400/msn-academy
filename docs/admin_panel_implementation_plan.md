# MSN Academy — Admin Panel Implementation Plan

## 1. Executive Summary & Objective
MSN Academy currently provides public discovery (M2), student LMS & assessments (M1, M4), and checkout (M3). To run academy operations at scale, the administration team requires an authoritative, secure **Admin Portal** to:
1. Monitor live revenue, student signups, and course enrollments.
2. Review and verify manual student payment proofs (Bank Transfer, JazzCash, EasyPaisa) with 1-click automatic course provisioning.
3. Create, update, publish, and manage courses and pricing directly without manual database scripts.
4. Track all student orders, billing invoices, and issued certificates.
5. Manage student accounts and follow up on contact inquiries/leads.

---

## 2. Architecture & Security Model

```mermaid
graph TD
    A[Admin User Browser] -->|Auth Token + Role: ADMIN| B[AdminRoute Guard]
    B -->|Authorized| C[Admin Layout Shell]
    C --> D1[Dashboard & KPIs]
    C --> D2[Course Management]
    C --> D3[Payment Approvals]
    C --> D4[Orders & Revenue]
    C --> D5[Students Directory]
    C --> D6[Contact Inquiries]

    C -->|API Calls with JWT| E[Express API Backend]
    E --> F[authGuard & roleGuard('ADMIN')]
    F --> G1[Admin Stats Controller]
    F --> G2[Courses CRUD Controller]
    F --> G3[Payments Review Controller]
    F --> G4[Admin Orders Controller]
    F --> G5[Admin Users Controller]
    F --> G6[Admin Inquiries Controller]

    G1 & G2 & G3 & G4 & G5 & G6 --> H[(MongoDB Atlas)]
```

### Access Control Rules:
* All `/api/v1/admin/*` and administrative mutation endpoints are strictly guarded by `authGuard` + `roleGuard('ADMIN')`.
* On the frontend, `AdminRoute` verifies `user?.role === 'ADMIN'`. Students attempting to access `/admin` will be redirected to `/dashboard` with an access denied toast.
* Seed super admin credentials are already present in DB: `admin@msnacademy.pk` (password: `Pakistan@12345`).

---

## 3. Backend Endpoints Specifications

### Module A: Admin Analytics & Overview (`/api/v1/admin/stats`)
* `GET /api/v1/admin/stats`
  * Aggregated KPIs:
    * Total Revenue (PKR) calculated from completed orders
    * Total Enrolled Students
    * Active Published Courses count
    * Pending Payments count (requiring review)
    * Open Contact Inquiries count
    * Recent 5 Orders & Recent 5 Payments for quick action

### Module B: Course Management CRUD (`/api/v1/courses`)
* `POST /api/v1/courses` — Create new course with title, slug, price, category, level, thumbnail, modules
* `PUT /api/v1/courses/:id` — Update course details, pricing, syllabus, and publish status
* `DELETE /api/v1/courses/:id` — Archive / delete course

### Module C: Payment Proof Verification Desk (`/api/v1/payments`)
* `GET /api/v1/payments/admin/all` — Paginated list of all payments with search, method, and status filters (`PENDING`, `UNDER_REVIEW`, `COMPLETED`, `FAILED`)
* `PATCH /api/v1/payments/:paymentId/admin-review` — Already built: approves payment, marks order completed, auto-provisions student course enrollment, and sends enrollment receipt email!

### Module D: Commercial Orders Management (`/api/v1/orders`)
* `GET /api/v1/orders/admin/all` — Paginated list of all orders with student details, items, payment method, transaction notes

### Module E: Student & User Directory (`/api/v1/admin/users`)
* `GET /api/v1/admin/users` — List registered students and admins, search by name/email, view enrollment count
* `PATCH /api/v1/admin/users/:id/role` — Update user role (`STUDENT` / `ADMIN`)

### Module F: Inquiries & Leads Management (`/api/v1/inquiries`)
* `GET /api/v1/inquiries/admin/all` — List contact form submissions with filter by status (`NEW`, `IN_PROGRESS`, `RESOLVED`)
* `PATCH /api/v1/inquiries/admin/:id/status` — Mark lead as contacted or resolved

---

## 4. Frontend Design & Component Plan

### 1. Layout & Navigation
* **`AdminLayout.jsx`**:
  * Distinctive modern slate-navy sidebar with red accent branding (`MSN Academy Admin`).
  * Navigation items:
    * 📊 **Dashboard** (`/admin`)
    * 📚 **Courses** (`/admin/courses`)
    * 💳 **Payment Desk** (`/admin/payments`) — with live red count badge for pending reviews
    * 🛒 **Orders** (`/admin/orders`)
    * 👥 **Students** (`/admin/users`)
    * 📬 **Leads / Inquiries** (`/admin/inquiries`)
  * Header with breadcrumbs, admin profile pill, "View Live Site" shortcut, and Logout.
* **`AdminRoute.jsx`**:
  * Dual check: `isAuthenticated` && `user?.role === 'ADMIN'`.
* **Quick Access from LMS**:
  * When logged in as `ADMIN`, `LmsTopBar.jsx` will display an "Admin Panel" shortcut button.

### 2. Admin Pages
1. **`AdminDashboard.jsx`**:
   * 4 Top KPI cards: Gross Revenue, Enrolled Students, Active Courses, Pending Approvals.
   * Quick Actions panel: "Review Payments", "Create Course", "Export Orders".
   * Recent payments pending manual approval with thumbnail screenshot & "Approve" button.
2. **`AdminCourses.jsx`**:
   * Course catalog table with thumbnail, title, category, price, enrollment count, status pill.
   * Modal dialog to **Add / Edit Course** (fields: title, slug, category, level, price, originalPrice, duration, description, thumbnail URL).
3. **`AdminPayments.jsx`**:
   * Filterable table (`All`, `Under Review`, `Completed`, `Pending`).
   * Modal viewer for bank transfer deposit slips / transaction IDs with 1-click **"Approve & Enroll Student"** or **"Reject"**.
4. **`AdminOrders.jsx`**:
   * Detailed transaction inspector: Order ID, Customer name, Items purchased, Amount in PKR, Payment method, Date, Status.
5. **`AdminUsers.jsx`**:
   * Student search, registered date, email verification status, total courses enrolled.
6. **`AdminInquiries.jsx`**:
   * Leads table: Inquirer name, email, phone, subject, message preview, status badge (`NEW` / `RESOLVED`).

---

## 5. Phased Execution Steps

| Phase | Tasks | Status | Deliverables |
|---|---|---|---|
| **Phase 1: Backend Admin APIs** | 1. Implement `/api/v1/admin/stats` controller & routes.<br>2. Implement Admin Course CRUD (`POST`, `PUT`, `DELETE`).<br>3. Add `GET /api/v1/payments/admin/all`.<br>4. Add `GET /api/v1/orders/admin/all`.<br>5. Add `GET /api/v1/admin/users`.<br>6. Add `GET /api/v1/inquiries/admin/all` & status update. | ✅ **COMPLETED** | Complete Admin REST API suite protected by `roleGuard('ADMIN')` + Automated Test Suite (100% pass). |
| **Phase 2: Frontend Infrastructure** | 1. Create `adminService.js` API client.<br>2. Build `AdminRoute.jsx` role guard.<br>3. Build `AdminLayout.jsx` with responsive sidebar and header.<br>4. Add "Admin Portal" link to `LmsTopBar.jsx` & `PublicHeader.jsx` for admin users.<br>5. Wire `/admin/*` routes in `App.jsx` + scaffolds. | ✅ **COMPLETED** | Protected Admin routing & shell structure (`vite build` passed cleanly). |
| **Phase 3: Admin Pages UI** | 1. Build `AdminDashboard.jsx` (KPIs + pending actions).<br>2. Build `AdminPayments.jsx` (Proof inspection + 1-click approval).<br>3. Build `AdminCourses.jsx` (List + Create/Edit modal).<br>4. Build `AdminOrders.jsx` (Commercial ledger).<br>5. Build `AdminUsers.jsx` & `AdminInquiries.jsx`. | ⏳ **NEXT** | Full operational admin UI with modals, filters & actions. |
| **Phase 4: Testing & Verification** | 1. Test admin login (`admin@msnacademy.pk` / `Pakistan@12345`).<br>2. Test payment verification flow (Approve bank transfer ➔ student immediately gets access).<br>3. Test Course creation from UI.<br>4. Verify production build with Vite. | ⏳ Pending | End-to-end verified admin portal. |

