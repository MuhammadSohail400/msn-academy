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

| Member | Track | Modules |
| :--- | :--- | :--- |
| **Backend Lead** | Backend (solo) | Auth/User → Courses → Cart/Orders/Payments → Enrollments/Learning → Assessments/Certificates |
| **M1** | Frontend | Auth, Profile, Dashboard & Learning Player |
| **M2** | Frontend | Course Catalog, Details & Marketing |
| **M3** | Frontend | Cart, Checkout & Order History |
| **M4** | Frontend | Assessments & Certificate Verification |

Build in this order — later modules depend on earlier ones (see `docs/04-Backend-Architecture.md`, section 30, API Dependency Map).

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
