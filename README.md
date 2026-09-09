# MSN Academy — Vocational & Technology LMS

MSN Academy is a career-focused vocational and technology Learning Management System (LMS). Students discover courses, check out (guest or registered), stream video lectures, pass a timed MCQ assessment, and receive a publicly verifiable digital certificate.

> Localized for the Pakistani market — PKR pricing, Bank Transfer / Easypaisa / JazzCash checkout, no recurring subscriptions.

---

## Tech Stack

**Frontend**
- React 18/19 + Vite
- Tailwind CSS
- Redux Toolkit (global state) + React Hook Form + Zod (forms/validation)
- React Router v6/v7
- Axios (HttpOnly cookie–based sessions)

**Backend**
- Node.js 20 (LTS) + TypeScript
- Express.js (Controller–Service–Model pattern)
- MongoDB + Mongoose
- Redis + BullMQ (background jobs — email, certificate PDF generation)
- JWT auth via secure HttpOnly cookies

---

## Project Structure

```
msn-academy/
├── frontend/       # React + Vite SPA
├── backend/        # Express + TypeScript REST API
├── docs/           # Planning & architecture docs (read these first)
│   ├── 01-PRD.md
│   ├── 02-Database-Design.md
│   ├── 03-Frontend-Architecture.md
│   ├── 04-Backend-Architecture.md
│   └── 05-API-Specification.md
└── README.md
```

Read the relevant doc in `/docs` before starting on your module — each one covers folder structure, conventions, and your specific ownership area in detail.

---

## Team & Module Ownership

The engineering workflow is cleanly divided into a **Solo Backend Lead** (responsible for 100% of the backend and all REST APIs) and **Frontend Team Members (M1–M4)** who build the UI, client state, and consume the backend endpoints:

### Backend Track (Solo Backend Lead — You)
> **Full Backend & API Ownership:** Responsible for the entire Express + TypeScript architecture, MongoDB schemas, all 43 REST API endpoints, BullMQ workers, and server security.

| Phase | Domain Modules | Core Responsibilities & Deliverables | APIs Delivered |
| :--- | :--- | :--- | :--- |
| **Phase 1: Foundation & Identity** | `auth`, `users` | Express bootstrap, MongoDB connection pool, JWT HttpOnly cookie session management, Zod request validator, user profiles, password recovery, and role guards (`STUDENT`, `ADMIN`). | `POST /auth/*`, `GET/PUT /users/*` |
| **Phase 2: Content & Marketing** | `courses`, `contact` | Master course catalog, faceted search & filtering, syllabus tree endpoints, category listings, and public contact inquiries. | `GET /courses/*`, `GET /categories`, `POST /contact` |
| **Phase 3: Commerce & Local Payments** | `cart`, `orders`, `payments` | Hybrid cart (guest session & student), promo coupon calculations, checkout ledger, Pakistani payment rails (Bank Wire, Easypaisa, JazzCash), and slip verification audit endpoints. | `* /cart/*`, `* /orders/*`, `* /payments/*` |
| **Phase 4: Learning Management (LMS)** | `enrollments`, `learning` | Course access grants, lecture player streaming context, downloadable attachments, lesson completion toggles, and atomic progress tracking (0–100%). | `GET /student/*`, `GET/POST /learning/*` |
| **Phase 5: Evaluation & Trust Registry** | `assessments`, `certificates` | 120-minute timed MCQ exam engine, automated scoring (70% pass mark), BullMQ Redis certificate PDF generation, vector QR codes, and public `/verify` registry. | `* /assessments/*`, `* /certificates/*` |

---

### Frontend Track (Team Distribution — 4 Frontend Members M1 to M4)
> **Frontend Engineering Team:** 4 developers build responsive React components, manage UI/UX state, and connect to the backend REST APIs. Full interactive developer checklists and component breakdowns are in [**`docs/FRONTEND-TEAM-TASK-DIVISION.md`**](docs/FRONTEND-TEAM-TASK-DIVISION.md).

| Member | Focus Area | Pages & Screens Owned | Redux & Services Owned | Consumed Backend APIs | Screenshots Assigned |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **M1** | **Auth, Profile & Dashboard** | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/profile`, `/dashboard` | `authSlice.js`, `authService.js`, `profileService.js`, `AuthLayout.jsx`, `DashboardLayout.jsx` | All `/auth/*`, `/users/*`, `/student/dashboard-summary` | **10 Screens** |
| **M2** | **Marketing & Course Discovery** | `/` (Home), `/courses` (Catalog), `/courses/:slug` (Details), `/about`, `/pricing`, `/faq`, `/contact` | `courseService.js`, `contactService.js`, `PublicLayout.jsx`, `CourseCard.jsx`, `SyllabusTree.jsx` | All `/courses/*`, `/categories`, `/contact` | **15 Screens** |
| **M3** | **Cart, Checkout, Orders & Certificates** | `/checkout`, `/order/success`, `/order/pending`, `/order/failed`, `/orders`, `/certificate/:certId`, `/verify` | `cartSlice.js`, `cartService.js`, `checkoutService.js`, `orderService.js`, `certificateService.js` | All `/cart/*`, `/orders/*`, `/payments/*`, `/certificates/*` | **22 Screens** |
| **M4** | **LMS Player & 120m Assessment Engine** | `/my-courses`, `/learn/:courseId`, `/learn/:courseId/lesson/:id`, `/learn/:courseId/assessment/*` | `learningService.js`, `assessmentService.js`, `LearningLayout.jsx`, `ExamLayout.jsx` | All `/enrollments/*`, `/learning/*`, `/assessments/*` | **24 Screens** |

---

### 🎨 Exact UI Screenshots Mapping (71 Screens in `ui-screenshots/`)

#### 👤 Member 1 (M1) — Auth, Profile & Dashboard Hub (10 Screens)
* `Student login.png` & `Login-Mobile.png` — Student Login screen
* `Create Account.png` & `Create account-mobile.png` — Student Registration screen (Google + Apple OAuth)
* `student Profile-desktop.png`, `student Profile-desktop-1.png` & `Student Profile-mob.png` — Student Profile, Password Change & Email Notification preferences
* `dashboard.png`, `dashboard-1.png` & `Dashboard-mb.png` — Student LMS Dashboard Hub (KPI widgets, Continue Learning, My Courses summary)

#### 🌐 Member 2 (M2) — Marketing & Course Discovery (15 Screens)
* `Home.png` & `home-mobile.png` — Public Landing Page (Hero, Stats, Testimonials, FAQ accordion, CTA)
* `Course catalog.png` & `Course catalog-mobile.png` — Course Directory with Search, Sort & Category/Level Filters
* `Course details.png` & `Course details-1.png` — Course Syllabus, Outcomes, Video Preview Modal & Sticky Enroll Card
* `About.png` — About MSN Academy, Mission, Core Values & Impact Metrics
* `Pricing.png` & `Pricing-1.png` — Transparent Pricing Guide (PKR 8k–18k), Inclusions Checklist & FAQs
* `FAQs.png` & `FAQs-mobile.png` — Interactive FAQ Accordion with Category Pill Filtering
* `Contact.png` & `Contact us-mobile.png` — Contact Inquiry Form with WhatsApp Integration Card
* `Menu.png` & `Menu-1.png` — Mobile Navigation Hamburger Drawer

#### 🛒 Member 3 (M3) — Cart, Checkout, Orders & Certificates (22 Screens)
* **Cart, Checkout & Orders (14 Screens):**
  * `Shopping cart.png` — Slide-Over Cart Drawer & Mobile Cart View (Item removal, Promo Code input)
  * `Checkout.png` & `Checkout-1.png` — Guest vs. Student Checkout Form, PKR Order Summary & Multi-Step Stepper
  * `Success.png`, `Payment successful-mb.png` & `Pass-mob.png` — Order Confirmation & Instant Access States
  * `pending.png` & `Pending-mb.png` — Manual Bank/Wallet Payment Pending Notice (24h SLA) with "Check Status" CTA
  * `Failed.png`, `Payment failed-mb.png` & `Fail-mob.png` — Payment Decline & Retry Screen
  * `Order history.png`, `Order history-1.png` & `Order history-mob.png` — Student Orders Ledger, Filter Tabs & Invoice Receipt Modal
* **Certificates & Public Verification Registry (8 Screens):**
  * `certificate.png` & `certificate-1.png` — High-Resolution Certificate of Completion with Founder Signature & Security Seal
  * `Certificate-mob.png` — Mobile Certificate Card with Scannable QR Code Box & "Verify Online" link
  * `certificate verification.png`, `certificate verification-1.png` & `Certificate verification-mobile.png` — Public Verification Search with Sample Demo Chips (`MSN-DEMO-0001`, `MSN-DEMO-0002`)
  * `verification complete.png` & `verification complete-1.png` — Authentic Certificate Verified Modal with Student Name & Course Details

#### 🎓 Member 4 (M4) — LMS Player & 120-Minute Timed Assessment Engine (24 Screens)
* **LMS Course Hub & Lecture Player (9 Screens):**
  * `My courses.png`, `My courses-1.png` & `My courses-mb.png` — Enrolled Course Library (Tabs: All, In Progress, Completed)
  * `course overview.png`, `course overview-1.png` & `Overview-mb.png` — Course Modules Tree, Syllabus Status & Downloadable Resources
  * `lecture.png`, `lecture-1.png` & `Lecture-mb.png` — Distraction-Free Video Player, Lecture Description, Key Topics, Attachments & "✓ Mark as Complete"
* **Timed Assessment Engine — 120 Mins (15 Screens):**
  * `Course assessment.png`, `Course assessment-1.png` & `Course assessment-mb.png` — Exam Briefing Rules (70% pass threshold, 2-hour countdown)
  * `Assessmet questions.png`, `Assessmet questions-1.png` & `asses. Questions-mb.png` — Live Timed MCQ Session with Question Navigator Grid & Flag for Review
  * `Review and submit.png`, `Review and submit-1.png` & `Review-mb.png` — Pre-Submission Question Summary & Unanswered Questions Alert
  * `go back.png` & `go back-1.png` — "Submit Assessment?" Final Submission Confirmation Safeguard Modal
  * `assessment pass.png` & `assessment pass-1.png` — Exam Passed Result Screen (82% Score, Celebration Badge & Certificate Unlock CTA)
  * `assessment fail.png` & `assessment fail-1.png` — Exam Failed Result Screen (55% Score, Unlimited Retakes CTA & Review Course CTA)

---

## Getting Started

### Prerequisites
- Node.js 20.x LTS
- MongoDB (Atlas or local)
- Redis (for background jobs)
- Git

### Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/msn-academy.git
cd msn-academy

# Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Backend (in a separate terminal)
cd backend
npm install
cp .env.example .env.development
npm run dev
```

Frontend runs on `http://localhost:5173`, backend API on `http://localhost:5000/api/v1`.

---

## Branching Strategy

- `main` — production-ready code only
- `develop` — integration branch, all feature branches merge here first
- `feature/backend-<module>-<feature-name>` — e.g. `feature/backend-auth-login`
- `feature/frontend-<module>-<feature-name>` — e.g. `feature/frontend-catalog-search`

**Rules:**
- Never push directly to `main` or `develop`
- Open a PR into `develop`, get at least 1 approval before merging
- PRs should be small and scoped to one feature/screen where possible

---

## Contributing

1. Pull latest `develop`: `git checkout develop && git pull`
2. Create your feature branch: `git checkout -b feature/<track>-<module>-<name>`
3. Commit with clear messages (e.g. `feat(auth): add login form validation`)
4. Push and open a PR into `develop`
5. Fill in the PR template, request review, address feedback, merge

---

## Useful Links

- Traceability Matrix (feature → screen mapping): [`docs/01-PRD.md`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/docs/01-PRD.md), section 26
- API Endpoints Reference: [`docs/05-API-Specification.md`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/docs/05-API-Specification.md)
- Database Schema: [`docs/02-Database-Design.md`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/docs/02-Database-Design.md)
