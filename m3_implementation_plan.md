# M3 Frontend — Checkout, Orders & Certificates Implementation Plan

## Overview
Member 3 owns the complete **commerce flow**: Checkout → Payment Proof Submission → Order Confirmation → Order History → Certificate View.
All pages are currently `PagePlaceholder` stubs and must be built from scratch using the existing design system (TailwindCSS, brand tokens, `font-display`, etc.) and wired to real backend APIs.

---

## Pages to Build

| Route | Page File | Status |
|-------|-----------|--------|
| `/checkout` | `Checkout.jsx` | Placeholder |
| `/order/success` | `OrderSuccess.jsx` | Placeholder |
| `/order/pending` | `OrderPending.jsx` | Placeholder |
| `/order/failed` | `OrderFailed.jsx` | Placeholder |
| `/orders` | `OrderHistory.jsx` | Placeholder (inside LmsLayout) |
| `/certificate/:certId` | `CertificateView.jsx` | Placeholder (inside LmsLayout) |

---

## Phase 1 — Service Layer

### [NEW] `frontend/src/services/orderService.js`
```js
POST /orders/checkout     → checkout(paymentMethod, notes)
GET  /orders              → getOrders(page)
GET  /orders/:orderId     → getOrderById(orderId)
```

### [NEW] `frontend/src/services/paymentService.js`
```js
POST /payments/create                  → createPayment(orderId)
POST /payments/:paymentId/verify       → submitProof(paymentId, { transactionReference, receiptScreenshotUrl })
GET  /payments/:paymentId              → getPaymentStatus(paymentId)
```

### [NEW] `frontend/src/services/certificateService.js`
```js
GET /certificates                      → getMyCertificates()
GET /certificates/:certId              → getCertificateById(certId)
GET /certificates/verify/:certId       → verifyCertificate(certId)   ← public
```

### MODIFY `frontend/src/services/endpointUrls.js`
Add endpoint constants for ORDERS, PAYMENTS, CERTIFICATES.

---

## Phase 2 — Checkout Page `/checkout`

### UI Layout (2-column on desktop, stacked on mobile)

**Left column — Order Summary** (read-only, loaded from cart Redux state):
- List of courses with thumbnail, title, price
- Subtotal, discount (if coupon applied), **Total**
- "Secure & Encrypted" trust badge

**Right column — Payment Method Selection Form:**
- 3 payment method radio cards:
  - 🏦 **Bank Transfer** (Meezan Bank) — default
  - 📱 **Easypaisa**
  - 📱 **JazzCash**
- Optional notes textarea (max 250 chars)
- `Place Order` button (calls `POST /orders/checkout`)

**On success (201):**
- Store `order.id` and `paymentDetails` in component state (or URL params)
- Redirect → `/order/pending?orderId=xxx&paymentId=yyy`
- Display the payment bank details returned in `data.paymentDetails`

**States:** loading, error (400 empty cart, 409 conflict), auth guard (redirect `/login`)

---

## Phase 3 — Order Pending Page `/order/pending`

**Purpose:** Student submits proof of payment after making a bank transfer.

### UI Layout:
- Header: "Payment Submitted — Awaiting Verification" with clock icon
- Bank account details card (passed via query param or fetched via `GET /payments/:paymentId`):
  - Bank Name, Account Title, Account Number, IBAN
- **Proof Submission Form:**
  - `transactionReference` input (required, min 5 chars) — field-level errors shown inline
  - `receiptScreenshotUrl` input (optional URL)
  - `Submit Proof` button → calls `POST /payments/:paymentId/verify`
- On success (200): Show a "Under Review" success card + link to `/orders`
- Timeline stepper: `Order Placed → Proof Submitted → Under Review → Access Granted`

---

## Phase 4 — Order Success Page `/order/success`

**Purpose:** Shown after admin approves payment or instant gateway payment succeeds.

### UI Layout:
- Large animated ✅ checkmark (CSS animation)
- Order number: `MSN-ORD-00142`
- Summary of enrolled courses
- Two CTA buttons: **Go to My Courses** → `/my-courses` | **View Certificate** → `/certificate/:certId`
- Trust message: "Your certificate will be issued after completing the course."

Reads `orderId` from URL query param → calls `GET /orders/:orderId` to display details.

---

## Phase 5 — Order Failed Page `/order/failed`

**Purpose:** Shown when payment is rejected by admin or gateway.

### UI Layout:
- Large ❌ icon in rose circle
- "Payment Rejected" heading
- Rejection reason (if available)
- Two CTA buttons: **Try Again** → `/checkout` | **Contact Support** → `/contact`
- Link to re-submit proof

---

## Phase 6 — Order History Page `/orders` (inside LmsLayout)

**Purpose:** Student's paginated list of all past orders.

### UI Layout:
- Page header: "Order History"
- Table / Card list (mobile: cards, desktop: table):
  - `Order #`, `Date`, `Items`, `Amount`, `Payment Method`, `Status badge`, `View` button
- Status badges: `PENDING` (amber), `COMPLETED` (emerald), `CANCELLED` (rose), `UNDER_REVIEW` (sky)
- Pagination controls
- Empty state with illustration + "Browse Courses" CTA
- Clicking `View` → opens an **Order Receipt Modal** (in-page, not a new route) showing full order details from `GET /orders/:orderId`

**API:** `GET /orders?page=1&limit=10`

---

## Phase 7 — Certificate View Page `/certificate/:certId` (inside LmsLayout)

**Purpose:** Printable/shareable certificate for a completed course.

### UI Layout — Two sub-views:

**A. Certificate Card (full-page styled):**
- Brand logo (top left)
- "Certificate of Completion" heading
- Student full name (large, font-display)
- Course title
- Instructor name and signature line
- Unique cert ID + QR code (linked to `/verify?id=xxx`)
- Issue date
- `Download PDF` button (window.print() or jsPDF — keep it simple)
- `Share Certificate` copy-link button

**B. My Certificates list `/certificate` (no certId):**
- Grid of earned certificate cards showing course name, issue date, and "View Certificate" button

**API:** `GET /certificates/:certId` or `GET /certificates/verify/:certId`

---

## Phase 8 — Auth Guard

All M3 LmsLayout pages (`/orders`, `/certificate`) need an auth guard.
Add a `ProtectedRoute` wrapper component that:
- Reads `isAuthenticated` from `state.auth`
- If false → redirects to `/login?redirect=<current-path>`

---

## API Mapping Summary

| API Endpoint | Used In |
|---|---|
| `POST /orders/checkout` | `Checkout.jsx` |
| `GET /orders` | `OrderHistory.jsx` |
| `GET /orders/:orderId` | `OrderHistory.jsx` (modal) |
| `POST /payments/create` | `Checkout.jsx` (after order created) |
| `POST /payments/:paymentId/verify` | `OrderPending.jsx` |
| `GET /payments/:paymentId` | `OrderPending.jsx` (fetch details) |
| `GET /certificates` | `CertificateView.jsx` (list) |
| `GET /certificates/:certId` | `CertificateView.jsx` (single) |

---

## Design Guidelines

- **All pages** must use the existing design tokens: `brand-navy`, `brand-crimson`, `font-display`, `rounded-2xl`, `shadow-sm`
- Loading states: use the same `animate-pulse` skeleton pattern from M2
- Error states: `AlertCircle` icon + rose banner + retry button
- Auth-gated states: redirect to `/login`
- Mobile-first: stacked layout on `< lg`, two-column on `lg+`
- Use `Loader2` from lucide-react for spinners

---

## Development Order (Recommended)

```
1. Phase 1 — Service files (orderService, paymentService, certificateService)
2. Phase 2 — Checkout.jsx (most complex, core flow)
3. Phase 3 — OrderPending.jsx (depends on checkout order/paymentId)
4. Phase 4 — OrderSuccess.jsx
5. Phase 5 — OrderFailed.jsx
6. Phase 6 — OrderHistory.jsx
7. Phase 7 — CertificateView.jsx
8. Phase 8 — ProtectedRoute + auth guards
```

---

## Branch Name

```
git checkout -b features/frontend-checkout-orders-certificates
```

## Commit Convention

```
feat(m3): build checkout page with payment method selection
feat(m3): build order pending page with proof submission
feat(m3): build order history page with paginated orders
feat(m3): build certificate view page with printable layout
feat(m3): add orderService, paymentService, certificateService
feat(m3): add ProtectedRoute auth guard for LMS pages
```
