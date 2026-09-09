# MSN Academy — Frontend Team UI Work Breakdown (4 Frontend Members + 1 Backend Lead)

Yeh document **5-Member Team** (1 Solo Backend Lead + 4 Frontend Developers) k darmiyan tamam **71 UI Screens** aur technical deliverables ko cleanly divide karta hai.

---

## 👥 Overall Project Team Structure

| Role | Member | Primary Responsibility | Scope / Deliverables |
| :--- | :--- | :--- | :--- |
| **Backend Track** | **Solo Backend Lead (You)** | **100% Backend & API Layer** | Node.js 20, Express, TypeScript, MongoDB, Redis/BullMQ, All 43 REST Endpoints |
| **Frontend Track** | **Member 1 (M1)** | **Auth, Profile & Dashboard** | 10 Screens (Login, Register, Profile, LMS Dashboard Hub) |
| **Frontend Track** | **Member 2 (M2)** | **Marketing & Course Discovery** | 15 Screens (Landing Page, Course Catalog, Details, About, FAQs, Contact) |
| **Frontend Track** | **Member 3 (M3)** | **Cart, Checkout, Orders & Certificates** | 22 Screens (Cart, Stepper Checkout, Order Receipts, QR Certificate & Public Verify) |
| **Frontend Track** | **Member 4 (M4)** | **LMS Video Player & 120m Exam Engine** | 24 Screens (Enrolled Library, Lecture Player, 120m Timed MCQs, Pass/Fail Results) |

**Total UI Screens:** 10 + 15 + 22 + 24 = **71 Screens** (100% Coverage of `ui-screenshots/`).

---

## 📊 Summary Matrix for Frontend Members (M1 – M4)

| Member | Focus Area | Screens Count | Primary Routes | Redux / Services | Key Backend APIs Consumed |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **M1** | **Auth, Profile & Dashboard** | **10 Screens** | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/profile`, `/dashboard` | `authSlice.js`, `authService.js`, `profileService.js` | `POST /auth/*`, `GET/PUT /users/*`, `GET /student/dashboard-summary` |
| **M2** | **Marketing & Course Discovery** | **15 Screens** | `/`, `/courses`, `/courses/:slug`, `/about`, `/pricing`, `/faq`, `/contact` | `courseService.js`, `contactService.js` | `GET /courses/*`, `GET /categories`, `POST /contact` |
| **M3** | **Cart, Checkout, Orders & Certificates** | **22 Screens** | `/checkout`, `/order/success`, `/order/pending`, `/order/failed`, `/orders`, `/certificate/:certId`, `/verify` | `cartSlice.js`, `cartService.js`, `checkoutService.js`, `orderService.js`, `certificateService.js` | `* /cart/*`, `* /orders/*`, `* /payments/*`, `* /certificates/*` |
| **M4** | **LMS Player & 120m Assessment Engine** | **24 Screens** | `/my-courses`, `/learn/:courseId`, `/learn/:courseId/lesson/:id`, `/learn/:courseId/assessment/*` | `learningService.js`, `assessmentService.js` | `GET /student/enrollments`, `* /learning/*`, `* /assessments/*` |

---

# 📋 Detailed Developer Task Packages (M1 – M4)

---

### 👤 Member 1 (M1): Authentication, Profile & Dashboard Hub
* **Total Screens:** 10 Screens (Desktop + Mobile)
* **Layouts Owned:** `AuthLayout.jsx`, `DashboardLayout.jsx`
* **Redux / Services:** `authSlice.js`, `authService.js`, `profileService.js`
* **Route URLs:**
  * `/login`
  * `/register`
  * `/forgot-password`
  * `/reset-password`
  * `/profile`
  * `/dashboard`

#### 🖼️ UI Screens to Reference (in `ui-screenshots/`):
1. `Student login.png` (Desktop student login form)
2. `Login-Mobile.png` (Mobile login screen)
3. `Create Account.png` (Registration card with Google & Apple buttons)
4. `Create account-mobile.png` (Mobile registration card)
5. `student Profile-desktop.png` (Student profile information & avatar)
6. `student Profile-desktop-1.png` (Password change & notification settings)
7. `Student Profile-mob.png` (Mobile profile view)
8. `dashboard.png` (LMS Dashboard hub: KPI widgets, quick stats)
9. `dashboard-1.png` (Recent activities & enrolled courses preview)
10. `Dashboard-mb.png` (Mobile dashboard layout)

#### 🧩 Components to Build:
* `LoginForm.jsx` (Email, password, error feedback, remember me)
* `RegisterForm.jsx` (Name, email, password, phone, Zod validation)
* `SocialAuthButtons.jsx` (Google & Apple OAuth styled buttons)
* `ProfileCard.jsx` (Profile photo upload, editable user details)
* `PasswordChangeForm.jsx` (Current, new, confirm password with validation)
* `DashboardKpiCard.jsx` (Enrolled count, in-progress count, certificates count)
* `ContinueLearningWidget.jsx` (Progress bar + "Resume Lesson" CTA)

#### 🔌 APIs to Connect (from Backend Lead):
* `POST /api/v1/auth/register`
* `POST /api/v1/auth/login`
* `POST /api/v1/auth/logout`
* `GET  /api/v1/auth/me`
* `POST /api/v1/auth/forgot-password`
* `POST /api/v1/auth/reset-password`
* `GET  /api/v1/users/profile`
* `PUT  /api/v1/users/profile`
* `PUT  /api/v1/users/password`
* `GET  /api/v1/student/dashboard-summary`

---

### 🌐 Member 2 (M2): Marketing, Course Catalog & Discovery
* **Total Screens:** 15 Screens (Desktop + Mobile)
* **Layouts Owned:** `PublicLayout.jsx` (Navbar, Footer, Mobile Drawer)
* **Redux / Services:** `courseService.js`, `contactService.js`
* **Route URLs:**
  * `/` (Home landing)
  * `/courses` (Catalog)
  * `/courses/:slug` (Course Details)
  * `/about`
  * `/pricing`
  * `/faq`
  * `/contact`

#### 🖼️ UI Screens to Reference (in `ui-screenshots/`):
1. `Home.png` (Landing hero, stats counter, featured courses, testimonials)
2. `home-mobile.png` (Mobile landing page)
3. `Course catalog.png` (Course directory with search, category pills, price sorting)
4. `Course catalog-mobile.png` (Mobile catalog with filter modal)
5. `Course details.png` (Syllabus accordion, instructor bio, sticky enroll bar)
6. `Course details-1.png` (Course learning outcomes & reviews)
7. `About.png` (About MSN Academy, mission, core values, impact)
8. `Pricing.png` (PKR 8k–18k pricing guide, tier cards, inclusions)
9. `Pricing-1.png` (Pricing features checklist & pricing FAQs)
10. `FAQs.png` (Accordion FAQs with category filters)
11. `FAQs-mobile.png` (Mobile FAQ view)
12. `Contact.png` (Inquiry form, office details, WhatsApp card)
13. `Contact us-mobile.png` (Mobile contact form)
14. `Menu.png` (Mobile hamburger navigation drawer)
15. `Menu-1.png` (Mobile navigation links & CTA buttons)

#### 🧩 Components to Build:
* `Navbar.jsx` & `Footer.jsx` (Responsive header with Cart counter & Auth buttons)
* `MobileMenuDrawer.jsx` (Slide-in mobile menu)
* `HeroSection.jsx` & `StatsBar.jsx`
* `CourseCard.jsx` (Badge, thumbnail, title, rating, PKR price, Add to Cart)
* `CourseFilterBar.jsx` (Search input, category dropdown, sort by price)
* `SyllabusAccordion.jsx` (Modules tree with lecture durations & preview tags)
* `StickyEnrollCard.jsx` (Sidebar card with price, money-back badge, Enroll CTA)
* `FaqAccordion.jsx` (Smooth collapsible Q&A items)
* `ContactForm.jsx` (Name, email, phone, message with Zod validation)

#### 🔌 APIs to Connect (from Backend Lead):
* `GET  /api/v1/courses` (Query params: search, category, level, sort, page)
* `GET  /api/v1/courses/:slug`
* `GET  /api/v1/categories`
* `POST /api/v1/contact`

---

### 🛒 Member 3 (M3): Cart, Checkout, Orders & Digital Certificates
* **Total Screens:** 22 Screens (14 Checkout/Orders + 8 Certificates/Verification)
* **Layouts Owned:** `PublicLayout.jsx` (Cart slide-over), `DashboardLayout.jsx` (Order history tab)
* **Redux / Services:** `cartSlice.js`, `cartService.js`, `checkoutService.js`, `orderService.js`, `certificateService.js`
* **Route URLs:**
  * `/checkout`
  * `/order/success`
  * `/order/pending`
  * `/order/failed`
  * `/orders` (Order History)
  * `/certificate/:certId`
  * `/verify` (Public Verification Registry)

#### 🖼️ UI Screens to Reference (in `ui-screenshots/`):
* **Cart, Checkout & Orders (14 Screens):**
  1. `Shopping cart.png` (Slide-over drawer, items list, subtotal, promo code box)
  2. `Checkout.png` (Guest vs. Student login tabs, Billing form, Payment method selector)
  3. `Checkout-1.png` (Mobile 4-step stepper: Cart -> Details -> Payment -> Confirm)
  4. `Success.png` (Order success screen with instant access button)
  5. `Payment successful-mb.png` (Mobile success view)
  6. `Pass-mob.png` (Mobile checkout confirmation)
  7. `pending.png` (Manual Bank/Easypaisa audit notice, 24h SLA)
  8. `Pending-mb.png` (Mobile pending payment with "Check Status" CTA)
  9. `Failed.png` (Payment failed screen with retry CTA)
  10. `Payment failed-mb.png` (Mobile payment declined view)
  11. `Fail-mob.png` (Mobile payment error dialog)
  12. `Order history.png` (Student order table, filter tabs: All, Paid, Pending, Failed)
  13. `Order history-1.png` (Order invoice modal preview)
  14. `Order history-mob.png` (Mobile orders list)
* **Certificates & Verification Registry (8 Screens):**
  15. `certificate.png` (High-res Certificate display with Founder signature & seal)
  16. `certificate-1.png` (Certificate view with Download PDF button)
  17. `Certificate-mob.png` (Mobile Certificate card with QR code)
  18. `certificate verification.png` (Public verification search page)
  19. `certificate verification-1.png` (Public search with sample chips: `MSN-DEMO-0001`)
  20. `Certificate verification-mobile.png` (Mobile verification search)
  21. `verification complete.png` (Authentic certificate details modal)
  22. `verification complete-1.png` (Verified badge & credentials summary)

#### 🧩 Components to Build:
* `CartDrawer.jsx` (Slide-over drawer with item removal & auto subtotal)
* `CouponInput.jsx` (Discount voucher validation & real-time deduction)
* `CheckoutStepper.jsx` (4-step progress: Cart -> Details -> Payment -> Confirm)
* `PaymentMethodRadio.jsx` (Bank Transfer, Easypaisa, JazzCash selector)
* `BankSlipUploadModal.jsx` (File upload for bank transfer receipt / transaction ID)
* `OrderInvoiceModal.jsx` (Printable order receipt modal)
* `CertificateCanvas.jsx` (Digital certificate layout with QR code stamp)
* `PublicVerifySearch.jsx` (Credential ID search input with demo chips)
* `VerificationBadgeModal.jsx` (Verified student record display)

#### 🔌 APIs to Connect (from Backend Lead):
* `GET  /api/v1/cart`
* `POST /api/v1/cart/items`
* `DELETE /api/v1/cart/items/:courseId`
* `POST /api/v1/cart/apply-coupon`
* `POST /api/v1/orders/checkout`
* `GET  /api/v1/orders/my-orders`
* `GET  /api/v1/orders/:orderId`
* `POST /api/v1/payments/submit-proof`
* `GET  /api/v1/certificates/:certificateId`
* `GET  /api/v1/certificates/verify/:certificateId`

---

### 🎓 Member 4 (M4): LMS Learning Player & 120-Minute Timed Assessment Engine
* **Total Screens:** 24 Screens (9 LMS + 15 Assessment)
* **Layouts Owned:** `LearningLayout.jsx`, `ExamLayout.jsx`
* **Redux / Services:** `learningService.js`, `assessmentService.js`
* **Route URLs:**
  * `/my-courses`
  * `/learn/:courseId`
  * `/learn/:courseId/lesson/:id`
  * `/learn/:courseId/assessment`
  * `/learn/:courseId/assessment/exam`
  * `/learn/:courseId/assessment/review`
  * `/learn/:courseId/assessment/result`

#### 🖼️ UI Screens to Reference (in `ui-screenshots/`):
* **LMS Course Hub & Lecture Player (9 Screens):**
  1. `My courses.png` (Enrolled courses grid with progress bars)
  2. `My courses-1.png` (Tabs: All, In Progress, Completed)
  3. `My courses-mb.png` (Mobile courses library)
  4. `course overview.png` (Course curriculum tree, progress summary, resources)
  5. `course overview-1.png` (Modules breakdown with lesson duration)
  6. `Overview-mb.png` (Mobile course overview)
  7. `lecture.png` (Distraction-free Video Player, lesson notes, attachments)
  8. `lecture-1.png` (Lecture syllabus drawer + "✓ Mark as Complete" button)
  9. `Lecture-mb.png` (Mobile video lecture player)
* **120-Minute Timed Assessment Engine (15 Screens):**
  10. `Course assessment.png` (Exam Briefing: 120 mins, 70% pass threshold, rules)
  11. `Course assessment-1.png` (Assessment syllabus requirements & instructions)
  12. `Course assessment-mb.png` (Mobile exam briefing)
  13. `Assessmet questions.png` (Active exam session: 120m countdown, question card, options)
  14. `Assessmet questions-1.png` (Question Navigator grid 1–50, Flag for Review toggle)
  15. `asses. Questions-mb.png` (Mobile exam question view)
  16. `Review and submit.png` (Summary grid: Answered, Flagged, Unanswered warning)
  17. `Review and submit-1.png` (Question status review table)
  18. `Review-mb.png` (Mobile review summary)
  19. `go back.png` ("Are you sure you want to submit?" confirmation modal)
  20. `go back-1.png` (Unanswered questions safeguard modal)
  21. `assessment pass.png` (Passed Result Screen: 82% score, celebration badge, Unlock Certificate)
  22. `assessment pass-1.png` (Exam breakdown by module)
  23. `assessment fail.png` (Failed Result Screen: 55% score, Retake Exam CTA, review syllabus)
  24. `assessment fail-1.png` (Score deficit and retry rules)

#### 🧩 Components to Build:
* `VideoPlayer.jsx` (Custom video player with playback speed, full screen, resume time)
* `LessonSidebar.jsx` (Collapsible curriculum with completed checkmarks)
* `LessonAttachmentList.jsx` (Downloadable files, source code, PDFs)
* `ExamCountdownTimer.jsx` (120-minute countdown with warning at 10 minutes & auto-submit)
* `QuestionCard.jsx` (MCQ question statement, radio options A/B/C/D)
* `QuestionNavigatorGrid.jsx` (1 to 50 numbered bubbles with color states: Answered, Flagged, Unvisited)
* `FlagForReviewToggle.jsx` (Bookmark question for later review)
* `SubmitSafeguardModal.jsx` (Confirms remaining unanswered questions before submitting)
* `AssessmentResultScorecard.jsx` (Celebration badge for $\ge 70\%$, score gauge, retake CTA)

#### 🔌 APIs to Connect (from Backend Lead):
* `GET  /api/v1/student/enrollments`
* `GET  /api/v1/learning/:courseId/modules`
* `GET  /api/v1/learning/:courseId/lessons/:lessonId`
* `POST /api/v1/learning/:courseId/lessons/:lessonId/complete`
* `GET  /api/v1/assessments/:courseId/briefing`
* `POST /api/v1/assessments/:courseId/start`
* `POST /api/v1/assessments/:sessionId/answer`
* `POST /api/v1/assessments/:sessionId/submit`
* `GET  /api/v1/assessments/:sessionId/results`

---

## 🛠️ Step-by-Step Execution Guidelines for Frontend Developers

Har Frontend Developer ko kaam shuru karte waqt yeh 6 steps follow karne chahiye:

1. **Step 1: Inspect Screens in `ui-screenshots/`**
   * Apne assigned screens ko open karein aur layout, buttons, inputs, spacing note karein.
2. **Step 2: Check Theme / Design Tokens**
   * Primary Color: Crimson `#990000`
   * Secondary Navy: `#0B192C`
   * Dark Slate: `#1E3E62`
   * Accent Amber: `#FF6500` / Gold `#E5A93C`
   * Background: `#F8FAFC`
3. **Step 3: Build Stateless UI Components (`components/`)**
   * Pehle responsive HTML/Tailwind structure banayein (Desktop aur Mobile dono check karein).
4. **Step 4: Create Page Views (`pages/`) & Link Routes (`routes/index.jsx`)**
   * Page ko respective layout (`PublicLayout`, `DashboardLayout`, `LearningLayout`, `ExamLayout`) mein mount karein.
5. **Step 5: Connect Redux / Axios Service (`features/`)**
   * API calls ko connect karein with `withCredentials: true`. (Jab tak backend endpoint ban raha ho, mock data use karein).
6. **Step 6: Verify Responsive Breakpoints**
   * Mobile (< 768px), Tablet (768px–1024px), Desktop (> 1024px) verify karein.
