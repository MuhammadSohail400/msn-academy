# 🎓 MSN Academy — Vocational & Technology LMS

[![Live Demo](https://img.shields.io/badge/Live%20Demo-msn--academy--nine.vercel.app-crimson?style=for-the-badge&logo=vercel)](https://msn-academy-nine.vercel.app/)
[![Backend API](https://img.shields.io/badge/API%20Gateway-Live%20on%20Vercel-0F172A?style=for-the-badge&logo=express)](https://msn-academy-api1-nmvhlq756-msohailg211-gmailcoms-projects.vercel.app/api/v1/health)
[![Node Version](https://img.shields.io/badge/Node.js-20.x%20LTS-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-amber?style=for-the-badge)](LICENSE)

**MSN Academy** is a modern, career-focused vocational and technology Learning Management System (LMS) localized for Pakistan. It features course discovery, hybrid guest/registered shopping cart, localized PKR checkout with zero recurring subscriptions, video lecture streaming, a 120-minute timed MCQ assessment engine, and publicly verifiable digital certificates with QR validation.

---

## 🌐 Live Deployments

| Component | Platform | URL | Health / Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel SPA | [msn-academy-nine.vercel.app](https://msn-academy-nine.vercel.app/) | ![Active](https://img.shields.io/badge/Status-Live-success?style=flat-square) |
| **Backend API Gateway** | Vercel Serverless | [msn-academy-api1...vercel.app](https://msn-academy-api1-nmvhlq756-msohailg211-gmailcoms-projects.vercel.app/api/v1/health) | ![Active](https://img.shields.io/badge/Status-Healthy-success?style=flat-square) |
| **Database** | MongoDB Atlas | Cloud Multi-Region Cluster | ![Active](https://img.shields.io/badge/Status-Connected-success?style=flat-square) |
| **Email Delivery** | Resend API | Transactional OTP & Password Recovery | ![Active](https://img.shields.io/badge/Status-Operational-success?style=flat-square) |

---

## ⚡ Core Features & Capabilities

### 1. 🔍 Course Catalog & Discovery
* **Faceted Search & Filter**: Real-time filtering by category (Web Development, Data Science, AI, Design, Freelancing) and experience level (Beginner to Advanced).
* **Interactive Syllabus Preview**: Detailed curriculum breakdown with duration, preview lectures, learning outcomes, and prerequisites.
* **Responsive Video Player**: Distraction-free lecture player with bookmarking, lesson navigation, and completion state toggling.

### 2. 🛒 Commerce & Localized Pakistani Payments
* **Hybrid Cart**: Seamless cart persistence across anonymous guest sessions and authenticated student accounts.
* **PKR-Native Checkout**: No recurring credit card subscriptions required.
* **Local Payment Channels**:
  * 🏛️ Bank Wire Transfer (Account details, IBAN)
  * 📱 Easypaisa Mobile Account & QR
  * 💳 JazzCash Direct Mobile Wallet
* **Audit & Approval**: Manual payment verification workflow with SLA tracking.

### 3. ⏱️ 120-Minute Timed Assessment Engine
* **Rigorous Evaluation**: 120-minute countdown exam engine with automatic submission on timeout.
* **Exam Controls**: Question navigator grid, "Flag for Review" toggling, and pre-submission review modal.
* **Instant Automated Scoring**: Immediate grading against the 70% passing threshold with detailed score summaries and retake options.

### 4. 📜 Public Trust Registry & Verifiable Digital Certificates
* **Tamper-Proof Verification**: Public verification portal (`/verify`) allowing employers and institutions to authenticate student certificates by ID.
* **High-Res Digital Credentials**: Beautiful, printable certificate cards complete with security seals, student credentials, and scannable QR codes.

### 5. 🛡️ Enterprise Security & Identity
* **Authentication**: Multi-channel login supporting Email/Password and **Google One-Tap / GIS (OAuth 2.0)**.
* **HttpOnly Session Cookies**: Dual-token architecture (`access_token` and `refresh_token`) with cross-site `SameSite=None` protection.
* **Rate Limiting & Sanitation**: Helmet HTTP headers, CORS whitelisting, and strict Zod runtime request validation.

---

## 🛠️ Technology Stack

```
                     ┌────────────────────────────────┐
                     │    MSN Academy Client (SPA)    │
                     │  React 19 + Vite + Tailwind    │
                     └───────────────┬────────────────┘
                                     │ HTTPS / Cookies
                     ┌───────────────▼────────────────┐
                     │    REST API Gateway (Vercel)   │
                     │    Express + Node + TypeScript │
                     └───────┬───────────────┬────────┘
                             │               │
            ┌────────────────▼──────┐ ┌──────▼────────────────┐
            │  MongoDB Atlas (Data) │ │  Resend (Email Auth)  │
            └───────────────────────┘ └───────────────────────┘
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, Tailwind CSS, Redux Toolkit, React Router v7 |
| **UI Components** | Lucide React, Custom Responsive Design System |
| **Client Networking** | Axios (with auto-normalizing baseURL interceptors and HttpOnly credential exchange) |
| **Backend Runtime** | Node.js 20 (LTS), Express 5, TypeScript 5 |
| **Database & ODM** | MongoDB Atlas, Mongoose 9 (with serverless connection pool caching) |
| **Validation & Security** | Zod, Helmet, CORS, Cookie-Parser, Argon2, JSON Web Tokens (JWT) |
| **Logging & Monitoring** | Pino Logger, Pino HTTP serializer |
| **Email Service** | Resend API (6-digit verification OTPs, password reset links) |

---

## 📁 Repository Structure

```text
msn-academy/
├── frontend/                     # React + Vite Client Application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # Reusable UI elements (auth, cart, courses, layout)
│   │   ├── features/             # Redux slices (auth, cart)
│   │   ├── pages/                # Page components (public, dashboard, checkout, learning)
│   │   ├── services/             # Axios API client & endpoints
│   │   ├── store/                # Redux store configuration
│   │   └── App.jsx               # Application routes & layout bindings
│   ├── vercel.json               # SPA rewrite configuration
│   └── package.json
│
├── backend/                      # Express + TypeScript REST API
│   ├── api/
│   │   └── index.ts              # Vercel serverless entrypoint (cached DB connection)
│   ├── src/
│   │   ├── config/               # Database, Redis, and environment configs
│   │   ├── middleware/           # Auth guards, error handlers, request validation
│   │   ├── modules/              # Domain modules (auth, courses, cart, orders, etc.)
│   │   ├── scripts/              # Seed scripts (courses, assessments, admin user)
│   │   ├── utils/                # ApiError, ApiResponse, cookie & logger helpers
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Local standalone development server
│   ├── public/                   # Static verification files
│   ├── vercel.json               # Serverless API rewrite configuration
│   ├── tsconfig.json             # CommonJS TypeScript compilation setup
│   └── package.json
│
├── docs/                         # Project Architecture & PRD Documents
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: v20.x or higher
* **npm**: v10.x or higher
* **MongoDB**: A free MongoDB Atlas cluster connection URI or local MongoDB instance

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/MuhammadSohail400/msn-academy.git
cd msn-academy
```

---

### Step 2: Configure & Run Backend
```bash
cd backend
npm install
```

Create a `.env.development` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/msn_academy?retryWrites=true&w=majority
JWT_SECRET=msn_super_secret_jwt_access_token_key_32chars!
JWT_REFRESH_SECRET=msn_super_secret_jwt_refresh_token_key_32chars!
COOKIE_SECRET=msn_cookie_signing_secret_key_32chars!
PAYMENT_WEBHOOK_SECRET=msn_webhook_secret_key_default_32chars!
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=MSN Academy <onboarding@resend.dev>
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Seed Initial Data:**
```bash
# Seed 6 industry courses
npm run seed

# Seed default admin account
npm run seed:admin

# Seed assessment MCQ banks
npm run seed:assessments
```

**Start Backend Development Server:**
```bash
npm run dev
# Running on http://localhost:5000 (API at http://localhost:5000/api/v1)
```

---

### Step 3: Configure & Run Frontend
In a separate terminal window:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Start Frontend Development Server:**
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 📡 Key API Endpoints Reference

All endpoints are versioned under `/api/v1`:

| Domain | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :---: |
| **System** | `GET` | `/health` | Server & uptime status check | ❌ |
| **Auth** | `POST` | `/auth/register` | Register new student account | ❌ |
| **Auth** | `POST` | `/auth/login` | Email/password sign in | ❌ |
| **Auth** | `POST` | `/auth/oauth/google` | Google Identity Services token verification | ❌ |
| **Auth** | `POST` | `/auth/verify-email` | Verify email with 6-digit OTP code | ❌ |
| **Auth** | `POST` | `/auth/logout` | Clear HttpOnly session cookies | ❌ |
| **Courses** | `GET` | `/courses` | Filterable course catalog | ❌ |
| **Courses** | `GET` | `/courses/:slug` | Course details, syllabus & preview | ❌ |
| **Cart** | `GET` | `/cart` | Retrieve current student/guest cart | ❌ |
| **Cart** | `POST` | `/cart/items` | Add course to cart | ❌ |
| **Orders** | `POST` | `/orders/checkout` | Create pending PKR order | ✅ |
| **Learning**| `GET` | `/learning/:courseId/overview` | Course syllabus & lecture playlist | ✅ |
| **Exams** | `POST` | `/assessments/:courseId/start` | Begin 120-minute timed MCQ exam | ✅ |
| **Certificates** | `GET` | `/certificates/verify/:certId`| Public QR code verification registry | ❌ |

---

## 🚢 Deployment Architecture (Vercel)

The application is deployed on Vercel as two decoupled, high-performance projects:

1. **Frontend Project (`frontend/`):**
   * **Framework:** Vite React SPA
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Routing:** Rewrites configured via `frontend/vercel.json` for zero-404 client-side routing.
   * **Environment Variable:** `VITE_API_BASE_URL` set to the live backend URL.

2. **Backend Project (`backend/`):**
   * **Framework:** Serverless Node.js Express API
   * **Entrypoint:** `backend/api/index.ts` with connection caching (reuses Mongoose pool across warm serverless invocations).
   * **Routing:** `backend/vercel.json` routes all `/(.*)` requests into `api/index.ts`.
   * **TypeScript Compilation:** Configured with CommonJS output for serverless execution.

---

## 👨‍💻 Author & Contributions

* **Lead Architect & Developer:** [Muhammad Sohail](https://github.com/MuhammadSohail400)
* **Repository:** [MuhammadSohail400/msn-academy](https://github.com/MuhammadSohail400/msn-academy)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
