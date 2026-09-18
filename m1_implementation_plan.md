# M1 Frontend — Authentication, Profile & Dashboard Implementation Plan

## 📌 Executive Summary
**Member 1 (M1)** is responsible for the complete user identity lifecycle, account management, and student LMS hub:
* **Total Screens:** 10 Screens (Desktop + Mobile)
* **Layouts Owned:** `AuthLayout.jsx`, `LmsLayout.jsx` integration (Profile & Dashboard pages)
* **Redux / Services:** `authSlice.js`, `authService.js`, `profileService.js`, `dashboardService.js`
* **Primary Routes:**
  * `/login` (Student Login)
  * `/register` (Create Account)
  * `/forgot-password` (Password Recovery Request)
  * `/reset-password` (Password Reset Confirmation)
  * `/dashboard` (Student LMS Hub)
  * `/profile` (Student Profile & Settings)

---

## 🎨 Figma UI Screenshots Mapping

| Screen / Feature | UI Screenshot in `ui-screenshots/` | Key Design Elements |
|---|---|---|
| **Student Login** | `Student login.png`, `Login-Mobile.png` | Centered card, dark MSN logo badge, "Back to Website" link, email, password with eye toggle, "Forgot Password?" link, crimson "Sign In" CTA, "Create Account" link |
| **Create Account** | `Create Account.png`, `Create account-mobile.png` | "Continue with Google" & "Continue with Apple" buttons, First & Last Name side-by-side, Email, Phone number, Password + Confirm Password, Terms checkbox, crimson CTA |
| **Forgot & Reset Password** | Matches Auth Card Design System | Email input, reset link trigger, new password & confirmation inputs with inline error feedback |
| **Student Dashboard** | `dashboard.png`, `dashboard-1.png`, `Dashboard-mb.png` | Welcome banner, "Browse More Courses" button, 4 KPI cards (Enrolled, Completed, Certificates, Pending Assessment), "Continue Learning" banner with progress bar & "Resume Lesson" CTA, "My Courses" list with progress bars, "Pending Assessment" & "My Certificates" widgets |
| **Student Profile** | `student Profile-desktop.png`, `student Profile-desktop-1.png`, `Student Profile-mob.png` | Avatar card with edit pen badge, "Personal Information" card with "Edit" mode (First Name, Last Name, Phone), "Change Password" form (Current, New, Confirm), "Notifications" email toggle switch |

---

## 🛠️ Phase-by-Phase Implementation Plan

### Phase 1 — Services & API Client Layer

#### 1.1 `frontend/src/services/profileService.js` [NEW]
```javascript
GET /users/profile     → getProfile()
PUT /users/profile     → updateProfile({ fullName, phone, avatar })
PUT /users/password    → changePassword({ currentPassword, newPassword, confirmPassword })
```

#### 1.2 `frontend/src/services/dashboardService.js` [NEW]
```javascript
GET /student/dashboard-summary → getDashboardSummary()
// Returns: { stats: { enrolled, completed, certificates, pendingAssessments }, continueLearning, recentCourses }
```

#### 1.3 `frontend/src/services/endpointUrls.js` [MODIFY]
Ensure explicit endpoints for:
```javascript
USERS: {
  PROFILE: '/users/profile',
  PASSWORD: '/users/password',
},
STUDENT: {
  DASHBOARD: '/student/dashboard-summary',
}
```

---

### Phase 2 — Authentication Shell & Pages

#### 2.1 `AuthLayout.jsx` [MODIFY]
* Update [`AuthLayout.jsx`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/frontend/src/components/layout/AuthLayout.jsx) to match `Student login.png`:
  * Top-left: `← Back to Website` link to `/`
  * Centered dark navy MSN Academy logo badge (`h-14 w-14 rounded-2xl bg-brand-navy`)
  * Full responsive centering for child form cards.

#### 2.2 `Login.jsx` [MODIFY]
* Path: [`frontend/src/pages/auth/Login.jsx`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/frontend/src/pages/auth/Login.jsx)
* Matches `Student login.png` & `Login-Mobile.png`:
  * Heading: **Student Login**
  * Subtitle: *Welcome back. Sign in to access your learning dashboard.*
  * Email Address input (with inline validation)
  * Password input with show/hide password toggle (eye icon) + "Forgot Password?" link
  * Crimson "Sign In" button with loading spinner (`Loader2`)
  * Bottom switch: *Don't have an account?* **Create Account**
  * Reads `?redirect=...` query param to return students directly to `/checkout`, `/orders`, or `/learn/:id` after sign in.
  * Dispatches `loginUser` Redux thunk.

#### 2.3 `Register.jsx` [MODIFY]
* Path: [`frontend/src/pages/auth/Register.jsx`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/frontend/src/pages/auth/Register.jsx)
* Matches `Create Account.png` & `Create account-mobile.png`:
  * Heading: **Create Account**
  * Subtitle: *Join MSN Academy and start learning today.*
  * Social buttons: **Continue with Google** & **Continue with Apple**
  * Divider: *or continue with email*
  * Side-by-side: **First Name** & **Last Name**
  * **Email Address**
  * **Phone Number** (with `+92` or local placeholder)
  * **Password** (min 8 characters, eye toggle)
  * **Confirm Password**
  * Checkbox: *I agree to the Terms of Use and Privacy Policy*
  * Crimson "Create Account" button
  * Bottom switch: *Already have an account?* **Sign In**
  * Dispatches `registerUser` Redux thunk.

#### 2.4 `ForgotPassword.jsx` & `ResetPassword.jsx` [MODIFY]
* **`ForgotPassword.jsx`**:
  * Email input form + "Send Reset Instructions" CTA.
  * Success confirmation card with instructions to check inbox.
* **`ResetPassword.jsx`**:
  * Reads reset token from URL (`?token=...`).
  * New Password + Confirm New Password inputs with strength indicator.
  * "Reset Password" CTA + success state leading to `/login`.

---

### Phase 3 — Student Dashboard Hub (`/dashboard`)

#### 3.1 `Dashboard.jsx` [MODIFY]
* Path: [`frontend/src/pages/dashboard/Dashboard.jsx`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/frontend/src/pages/dashboard/Dashboard.jsx)
* Matches `dashboard.png`, `dashboard-1.png`, `Dashboard-mb.png`:
  * **Top Welcome Bar**:
    * "Welcome back, {Student Name}!"
    * Subtext: "Here's a summary of your learning progress."
    * Red CTA Button: **Browse More Courses** (links to `/courses`)
  * **4 KPI Quick Stats Cards**:
    * 📘 **Enrolled** (count + blue icon)
    * 📗 **Completed** (count + green check icon)
    * 🎖️ **Certificates** (count + purple ribbon icon)
    * ⚠️ **Pending Assessment** (count + amber warning icon)
  * **Continue Learning Widget**:
    * Tag: `CURRENTLY LEARNING`
    * Course Title, Current Module/Lesson name
    * Red progress bar with percentage (e.g. 35%)
    * Crimson **Resume Lesson** button (links to `/learn/:courseId/lesson/:lessonId`)
  * **My Courses Preview List**:
    * Course rows with thumbnail, title, red progress bar, percentage
    * Action button: **Continue** (dark navy) or **View Certificate** (soft green)
    * "Go to My Courses →" link (links to `/my-courses`)
  * **Bottom Feature Widgets (2 columns)**:
    * Left: **Pending Assessment Card** (course title, completion status, amber "Start Assessment" button)
    * Right: **My Certificates Card** (earned certificates list with "View" links)
  * **Zero-State**: Friendly fallback UI when student is not enrolled in any courses yet.

---

### Phase 4 — Student Profile & Settings (`/profile`)

#### 4.1 `Profile.jsx` [MODIFY]
* Path: [`frontend/src/pages/dashboard/Profile.jsx`](file:///c:/Users/HS%20LAPTOP/Music/msn-academy/frontend/src/pages/dashboard/Profile.jsx)
* Matches `student Profile-desktop.png`, `student Profile-desktop-1.png`, `Student Profile-mob.png`:
  * **Breadcrumbs**: `Course Overview (LMS) > Student Profile`
  * **Title**: `Student Profile` — *Manage your personal information, password and notification preference.*
  * **Grid Layout (2x2)**:
    1. **Avatar Card**:
       * Large circular avatar with initials or photo
       * Edit pen badge overlay
       * Student Full Name & Email
    2. **Personal Information Card**:
       * Header with "Edit" / "Save Changes" toggle
       * Fields: First Name, Last Name, Email Address (read-only), Phone Number
       * Calls `PUT /users/profile` on save with toast notification.
    3. **Change Password Form Card**:
       * Current Password, New Password, Confirm New Password
       * Field-level inline errors
       * Crimson "Update Password" button (calls `PUT /users/password`)
    4. **Notifications Card**:
       * "Email Notifications: Course updates and announcements"
       * Toggle switch (Active/Inactive)

---

### Phase 5 — Navigation & Layout Polish
* **`LmsTopBar.jsx`**: Verify student avatar initials and user name pull dynamically from `state.auth.user`.
* **`ProtectedRoute.jsx`**: Ensure all LMS routes (`/dashboard`, `/profile`, `/orders`, `/certificate`, `/my-courses`) are protected.

---

## 📅 Recommended Execution Order

```
Step 1: Services (profileService.js, dashboardService.js, endpointUrls.js)
Step 2: Auth Layout (AuthLayout.jsx)
Step 3: Login Page (Login.jsx)
Step 4: Register Page (Register.jsx)
Step 5: Password Recovery Pages (ForgotPassword.jsx, ResetPassword.jsx)
Step 6: Dashboard Page (Dashboard.jsx)
Step 7: Profile Page (Profile.jsx)
Step 8: Verification (npm run build & browser check)
```
