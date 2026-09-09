# API Specification Document
# MSN Academy — Vocational & Technology Learning Management System

---

## 1. Document Information

* **Project Name:** MSN Academy
* **Document Name:** RESTful API Specification & Frontend-Backend Integration Contract
* **File Identifier:** `05-API-Specification.md`
* **Version:** 1.0.0 (Implementation-Ready Contract)
* **Date:** September 08, 2026
* **Status:** Approved / Official Engineering Contract
* **Author / Role:** Senior API Architect & Distributed Systems Integration Specialist
* **Target Audience:** Frontend Engineering Team (5 Developers), Backend Engineering Team (5 Developers), Full-Stack Leads, QA Automation Engineers
* **API Protocol:** RESTful over HTTP/1.1 and HTTP/2 (TLS 1.3 encrypted)
* **API Version:** `v1`
* **Base URL Placeholder:** `https://<backend-domain>/api/v1`
  * *Local Development Base URL:* `http://localhost:5000/api/v1`
  * *Staging Environment Base URL:* `https://api-staging.msnacademy.pk/api/v1` (Placeholder)
  * *Production Environment Base URL:* `https://api.msnacademy.pk/api/v1` (Placeholder)
* **Purpose:**
  This document establishes the binding, implementation-ready contract between the Next.js TypeScript frontend and the Node.js / Express.js / MongoDB backend. It defines standard communication envelopes, security mechanisms, granular endpoint contracts, data schemas, validation constraints, error codes, and a 5-developer parallel execution framework derived directly from [`01-PRD.md`](file:///c:/Users/HS%20LAPTOP/Downloads/MSN%20Academy%20project/01-PRD.md), [`02-Database-Design.md`](file:///c:/Users/HS%20LAPTOP/Downloads/MSN%20Academy%20project/02-Database-Design.md), [`03-Frontend-Architecture.md`](file:///c:/Users/HS%20LAPTOP/Downloads/MSN%20Academy%20project/03-Frontend-Architecture.md), and [`04-Backend-Architecture.md`](file:///c:/Users/HS%20LAPTOP/Downloads/MSN%20Academy%20project/04-Backend-Architecture.md).

---

## 2. API Architecture Overview

The MSN Academy API adheres to a stateless, decoupled client-server architecture. The Next.js client interacts with the Express backend strictly via JSON-over-HTTPS.

```text
Next.js Frontend (App Router Client & SSR)
       ↓
HTTPS / TLS 1.3 JSON Requests (Credentials / Cookies / Headers)
       ↓
Reverse Proxy (NGINX / Cloudflare Gateway)
       ↓
Express.js Application Router (/api/v1)
       ↓
Middleware Pipeline (CORS, Helmet, RateLimiter, CookieParser, AuthGuard, ZodValidator)
       ↓
Controller Layer (HTTP Serialization, Status Codes, Request/Response Extraction)
       ↓
Service Layer (Pure Domain Rules, Cart Calculations, Scoring, Multi-Doc Transactions)
       ↓
Mongoose ODM / Persistence Layer (Lean Queries, Compound Indexes, Atomic Writes)
       ↓
MongoDB Database (Replica Set)
```

### Communication Flow:
1. **Client Request:** The Next.js frontend dispatches requests via an Axios or native `fetch` instance configured with `withCredentials: true` (for HttpOnly session cookies) and an optional `Authorization: Bearer <token>` fallback header for mobile or headless clients.
2. **Gateway & Security:** Express middleware verifies CORS origin, strips malicious headers via Helmet, checks sliding-window rate limits, and extracts the signed JWT session token.
3. **Payload Validation:** Before reaching business logic, incoming `req.body`, `req.query`, and `req.params` are validated against strict Zod schemas. Invalid payloads immediately return HTTP 422 with a structured error array.
4. **Service Execution & Transactions:** Valid requests trigger business logic in domain services. Operations modifying multiple collections (e.g., checkout, manual payment verification, assessment completion) execute inside MongoDB ACID sessions (`session.withTransaction()`).
5. **Standardized Response:** The controller wraps service output in a standardized JSON response envelope (`{ success, message, data, meta }`) before returning it to the client.

---

## 3. API Design Principles

1. **RESTful Resource Orientation:** URIs represent nouns in lowercase plural form (e.g., `/courses`, `/orders`, `/certificates`). HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) define the action. RPC-style verbs (e.g., `/createCourse`, `/getPayment`) are strictly prohibited.
2. **Stateless Operations:** Every HTTP request carries all necessary context (authentication token, parameters) required to fulfill it. The server maintains no in-memory session state, allowing seamless horizontal scaling.
3. **Strict Validation & Authoritative Server:** The backend never trusts client inputs. Prices, discounts, exam timers, and scores are computed exclusively on the server.
4. **Predictable JSON Envelopes:** All responses, whether success or error, share an identical structural foundation for deterministic frontend deserialization.
5. **Resource Ownership Isolation:** Authenticated users can only read, mutate, or delete resources they own. Resource queries enforce `{ _id: resourceId, userId: req.user.id }` constraints at the database level.
6. **Graceful Error Handling:** Errors provide developer-friendly diagnostic codes and user-friendly localized messages without leaking database internals, stack traces, or environment secrets.
7. **Idempotency & Replay Safety:** Critical mutation endpoints (payments, order placement, webhook events) implement idempotency keys or unique transaction deduplication.

---

## 4. Base URL & Versioning

### URI Versioning Convention
MSN Academy utilizes explicit URI-path versioning:

```text
/api/v1
```

* **Rationale:** URI versioning provides immediate visibility into the API contract version across browser DevTools, network logs, and documentation. It enables major breaking revisions (e.g., `/api/v2`) to operate concurrently without disrupting existing frontend deployments or mobile wrappers.
* **Base URL Format:**
  ```text
  https://<backend-domain>/api/v1
  ```
* **Resource Route Hierarchy:**
  * Authentication: `/api/v1/auth/*`
  * User Profiles: `/api/v1/users/*`
  * Course Catalog: `/api/v1/courses/*`
  * Categories: `/api/v1/categories/*`
  * Cart Operations: `/api/v1/cart/*`
  * Orders & Checkout: `/api/v1/orders/*`
  * Payment Processing: `/api/v1/payments/*`
  * Enrollments & Student Hub: `/api/v1/student/*`
  * Learning Player: `/api/v1/learning/*`
  * Assessments: `/api/v1/assessments/*`
  * Certificates: `/api/v1/certificates/*`
  * Inquiries: `/api/v1/contact`

---

## 5. Authentication Strategy

* **Authentication Protocol:** JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`) using a cryptographically secure 256-bit secret.
* **Storage & Transmission:**
  * **Primary Mechanism (Web / Next.js):** Stored in a secure, `HttpOnly`, `SameSite=Strict`, `Secure` browser cookie named `msn_session_token`. This eliminates client-side JavaScript access and neutralizes Cross-Site Scripting (XSS) token theft.
  * **Secondary Fallback (API / Headless Clients):** Passed via the standard HTTP header:
    ```text
    Authorization: Bearer <access_token>
    ```
* **Token Expiration:**
  * Short-lived access token: `7 days` (sliding session refreshed on active use).
  * *Refresh Token Strategy:* **To Be Confirmed** for mobile app expansion; currently, sliding expiration over `HttpOnly` cookie fulfills all PRD requirements.
* **Password Security:** Passwords hashed with Argon2id (or Bcrypt with cost factor 12) before persistence. Cleartext passwords are never logged or stored.
* **Password Reset Flow:** Uses a single-use cryptographically random token (expires in 15 minutes) sent to the student's registered email address.
* **OAuth 2.0 (Google):** The Next.js frontend obtains a Google ID Token via Google Identity Services and sends it to `POST /api/v1/auth/oauth/google`. The backend verifies the token with Google APIs and provisions/links the student account.

---

## 6. Authorization Strategy

Access control is enforced via a combination of authentication middleware, Role-Based Access Control (RBAC), and Resource Ownership verification.

### Access Levels Table

| Access Level | Meaning | Authentication Required | Middleware Enforced |
| :--- | :--- | :--- | :--- |
| **Public** | Accessible to any client without credentials. | No | None |
| **Authenticated** | Accessible to any user with an active, valid JWT session. | Yes | `requireAuth` |
| **Owner** | User can access/mutate only their own records (`userId === req.user.id`). | Yes | `requireAuth` + Resource Ownership Guard |
| **Role-based (`STUDENT`)** | Specific to enrolled or active learners. | Yes | `requireAuth` + `requireRole(['STUDENT'])` |
| **Role-based (`ADMIN`)** | Back-office management, manual payment approval, catalog editing. | Yes | `requireAuth` + `requireRole(['ADMIN'])` |

---

## 7. Standard HTTP Status Codes

The API uses standard HTTP response codes deterministically:

| Status Code | Code Name | Description / Usage in MSN Academy | Typical Methods |
| :---: | :--- | :--- | :--- |
| **200** | OK | Standard successful response returning requested payload. | `GET`, `PUT`, `PATCH` |
| **201** | Created | Resource successfully created (order placed, account registered, attempt started). | `POST` |
| **204** | No Content | Action succeeded; no body returned (cart cleared, item deleted, logout). | `DELETE` |
| **400** | Bad Request | Syntactically malformed request or missing mandatory payload envelope. | `POST`, `PUT` |
| **401** | Unauthorized | Authentication missing, invalid, expired, or signature verification failed. | All |
| **403** | Forbidden | Valid authentication present, but user lacks permission (unauthorized course access, non-admin). | All |
| **404** | Not Found | Requested resource does not exist (course slug not found, invalid certificate ID). | All |
| **409** | Conflict | State conflict (email already registered, course already in cart/enrolled). | `POST` |
| **422** | Unprocessable Entity | Zod schema validation failed (invalid email format, password too short, invalid types). | `POST`, `PUT`, `PATCH` |
| **429** | Too Many Requests | Rate limit threshold exceeded. Client must pause before retrying. | All |
| **500** | Internal Server Error | Unhandled server exception or persistence failure. Safe error message returned. | All |

---

## 8. Standard Success Response

All successful API responses adhere strictly to the unified response contract:

### Single Entity Success Envelope
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8e90",
    "name": "Web Development Bootcamp"
  }
}
```

### Paginated Collection Success Envelope
```json
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": [
    {
      "id": "66d8f1e29c8e1a4b5c7d8e90",
      "title": "Mastering React & Next.js",
      "slug": "mastering-react-nextjs",
      "price": 8500
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 9. Standard Error Response

Error payloads are uniform, enabling client-side interceptors to extract and display field-level validation errors or global toast alerts cleanly:

### Standard Validation Error Response (HTTP 422)
```json
{
  "success": false,
  "message": "Request validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    },
    {
      "field": "password",
      "message": "Password must contain at least 8 characters"
    }
  ],
  "statusCode": 422
}
```

### Standard Operational / Business Error Response (HTTP 400, 401, 403, 404, 409)
```json
{
  "success": false,
  "message": "You are already enrolled in this course.",
  "errors": [],
  "statusCode": 409
}
```

---

## 10. Pagination Specification

Pagination is standard for all unbounded collection queries (`/courses`, `/orders`, `/student/enrollments`).

* **Query Parameters:**
  * `page` (integer, default: `1`, minimum: `1`)
  * `limit` (integer, default: `10`, maximum: `50`)
* **Metadata Fields:**
  * `page`: Current page number.
  * `limit`: Number of records returned per page.
  * `total`: Total count of matching records across all pages.
  * `totalPages`: Computed total pages (`Math.ceil(total / limit)`).
  * `hasNextPage`: Boolean indicating if `page < totalPages`.
  * `hasPrevPage`: Boolean indicating if `page > 1`.

---

## 11. Filtering, Search & Sorting

### URL Query Standards
Parameters are passed as URL-encoded key-value pairs:

```text
/api/v1/courses?page=1&limit=12&category=Web+Development&level=Beginner&sort=price_asc&search=react
```

### Parameter Definitions
* **`search`** (string): Case-insensitive full-text keyword query matching title and summary.
* **`category`** (string): Matches exact category enum value (`'Data Science'`, `'Artificial Intelligence'`, `'Design'`, `'Web Development'`, `'Marketing'`, `'Productivity'`).
* **`level`** (string): Matches course difficulty (`'Beginner'`, `'Intermediate'`, `'Advanced'`, `'All Levels'`).
* **`sort`** (string): Controls field sorting:
  * `newest`: Sorted by `createdAt` descending (Default).
  * `price_asc`: Sorted by `price` ascending.
  * `price_desc`: Sorted by `price` descending.
  * `popular`: Sorted by `enrolledStudentsCount` descending.
  * `rating`: Sorted by `averageRating` descending.

---

## 12. API Naming Convention

* **Paths:** Strictly lowercase nouns, hyphenated for multi-word paths (`/dashboard-summary`, `/reset-password`).
* **Parameters:** CamelCase identifiers in documentation (`:courseId`, `:attemptId`), validated as 24-character hexadecimal MongoDB ObjectIds.
* **JSON Keys:** Strictly `camelCase` for both request bodies and response payloads.
* **Database IDs:** Serialized as `id` (string representation of MongoDB `_id`) in API responses.

---

## 13. Authentication APIs

---

## POST /auth/register

### Purpose
Registers a new student account using full name, email, phone number, and password, immediately issuing a secure session cookie.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "fullName": "Muhammad Ali",
  "email": "ali.khan@example.com",
  "phone": "03001234567",
  "password": "Password123!"
}
```

### Validation Rules
* `fullName`: string, required, min 3 chars, max 60 chars.
* `email`: string, required, valid email format, normalized to lowercase.
* `phone`: string, required, valid Pakistani phone format (`^03[0-9]{9}$`).
* `password`: string, required, min 8 chars, must include at least 1 uppercase letter, 1 lowercase letter, and 1 number.

### Success Response
* **Status:** `201 Created`
* **Headers:** `Set-Cookie: msn_session_token=<jwt>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
```json
{
  "success": true,
  "message": "Account registered successfully",
  "data": {
    "user": {
      "id": "66d8f1e29c8e1a4b5c7d8e91",
      "fullName": "Muhammad Ali",
      "email": "ali.khan@example.com",
      "phone": "03001234567",
      "role": "STUDENT",
      "isEmailVerified": false,
      "createdAt": "2026-09-08T12:00:00.000Z"
    }
  }
}
```

### Error Responses
* **409 Conflict:**
  ```json
  {
    "success": false,
    "message": "An account with this email already exists",
    "errors": [{ "field": "email", "message": "Email is already registered" }],
    "statusCode": 409
  }
  ```
* **422 Unprocessable Entity:** Input validation failed.

### Business Rules
* Checks for existing user with same email (case-insensitive).
* Passwords hashed via Argon2id.
* Default role assigned is `STUDENT`.
* Creates an empty shopping cart for the new user automatically.

### Related Database Collection
`users`, `carts`

### Related PRD Requirement
`FR-AUTH-001`

### Related Frontend Feature
`features/auth/RegisterForm.tsx` (`/register`)

---

## POST /auth/login

### Purpose
Authenticates student credentials and issues a signed JWT session cookie.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "email": "ali.khan@example.com",
  "password": "Password123!"
}
```

### Validation Rules
* `email`: string, required, valid email format.
* `password`: string, required.

### Success Response
* **Status:** `200 OK`
* **Headers:** `Set-Cookie: msn_session_token=<jwt>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "66d8f1e29c8e1a4b5c7d8e91",
      "fullName": "Muhammad Ali",
      "email": "ali.khan@example.com",
      "role": "STUDENT",
      "avatar": null
    }
  }
}
```

### Error Responses
* **401 Unauthorized:**
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "errors": [],
    "statusCode": 401
  }
  ```
* **422 Unprocessable Entity:** Input validation failed.

### Business Rules
* Validates credentials against stored Argon2id hash.
* Generic error message returned on failed password to prevent user enumeration.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-AUTH-002`

### Related Frontend Feature
`features/auth/LoginForm.tsx` (`/login`)

---

## POST /auth/logout

### Purpose
Terminates the user's authenticated session by clearing the `msn_session_token` cookie.

### Access
Authenticated

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
* **Headers:** `Set-Cookie: msn_session_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

### Error Responses
* **401 Unauthorized:** Missing or invalid session token.

### Business Rules
* Instructs client browser to immediately expire and purge cookie.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-AUTH-003`

### Related Frontend Feature
`features/auth/LogoutButton.tsx` (Global Header & Sidebar)

---

## GET /auth/me

### Purpose
Retrieves current authenticated student's session summary and authorization state.

### Access
Authenticated

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>` or `Authorization: Bearer <token>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "User session fetched",
  "data": {
    "user": {
      "id": "66d8f1e29c8e1a4b5c7d8e91",
      "fullName": "Muhammad Ali",
      "email": "ali.khan@example.com",
      "phone": "03001234567",
      "role": "STUDENT",
      "avatar": "https://images.msnacademy.pk/avatars/user-1.jpg"
    }
  }
}
```

### Error Responses
* **401 Unauthorized:** Session expired or missing.

### Business Rules
* Used by Next.js client during app hydration to populate Redux auth state.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-AUTH-002`

### Related Frontend Feature
`features/auth/authSlice.ts` / Next.js Root Layout hydration

---

## POST /auth/forgot-password

### Purpose
Initiates password recovery by emailing a single-use, 15-minute reset token to the student.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "email": "ali.khan@example.com"
}
```

### Validation Rules
* `email`: string, required, valid email format.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been dispatched.",
  "data": null
}
```

### Error Responses
* **422 Unprocessable Entity:** Invalid email format.

### Business Rules
* Always returns HTTP 200 even if email is not found, to prevent account enumeration.
* Reset token expires after 15 minutes.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-AUTH-004`

### Related Frontend Feature
`features/auth/ForgotPasswordForm.tsx` (`/forgot-password`)

---

## POST /auth/reset-password

### Purpose
Sets a new password using a verified recovery token.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "token": "d8e90a1b2c3d4e5f6a7b8c9d0e1f2a3b",
  "newPassword": "NewPassword123!"
}
```

### Validation Rules
* `token`: string, required.
* `newPassword`: string, required, min 8 chars with uppercase, lowercase, and number.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully. You may now log in.",
  "data": null
}
```

### Error Responses
* **400 Bad Request:** Token invalid, altered, or expired.

### Business Rules
* Hashes new password, clears the reset token and expiry fields from user record.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-AUTH-004`

### Related Frontend Feature
`features/auth/ResetPasswordForm.tsx` (`/reset-password`)

---

## POST /auth/oauth/google

### Purpose
Authenticates or provisions a student via a verified Google ID Token.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..."
}
```

### Validation Rules
* `idToken`: string, required.

### Success Response
* **Status:** `200 OK`
* **Headers:** `Set-Cookie: msn_session_token=<jwt>; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "id": "66d8f1e29c8e1a4b5c7d8e91",
      "fullName": "Muhammad Ali",
      "email": "ali.khan@gmail.com",
      "role": "STUDENT",
      "avatar": "https://lh3.googleusercontent.com/a/..."
    }
  }
}
```

### Error Responses
* **401 Unauthorized:** Invalid or expired Google ID token.

### Business Rules
* Validates cryptographic signature with Google OAuth2 public keys.
* If user doesn't exist, auto-provisions account with verified email status.

### Related Database Collection
`users`, `carts`

### Related PRD Requirement
`FR-AUTH-005`

### Related Frontend Feature
`features/auth/GoogleOAuthButton.tsx` (`/login`, `/register`)

---

## 14. User APIs

---

## GET /users/profile

### Purpose
Fetches full profile details of the authenticated student, including contact info, biography, and notification settings.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8e91",
    "fullName": "Muhammad Ali",
    "email": "ali.khan@example.com",
    "phone": "03001234567",
    "bio": "Aspiring Full Stack Engineer and AI enthusiast.",
    "avatar": "https://images.msnacademy.pk/avatars/user-1.jpg",
    "role": "STUDENT",
    "preferences": {
      "emailNotifications": true,
      "smsNotifications": false
    },
    "createdAt": "2026-09-08T12:00:00.000Z"
  }
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.
* **404 Not Found:** User record does not exist.

### Business Rules
* Password hash and internal reset tokens are omitted from projection.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-PROF-001`

### Related Frontend Feature
`features/profile/ProfileView.tsx` (`/profile`)

---

## PUT /users/profile

### Purpose
Updates profile fields (full name, phone, biography, avatar URL, and preferences).

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "fullName": "Muhammad Ali Khan",
  "phone": "03009876543",
  "bio": "Dedicated software engineering student.",
  "avatar": "https://images.msnacademy.pk/avatars/ali-new.jpg",
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": true
  }
}
```

### Validation Rules
* `fullName`: string, optional, min 3, max 60 chars.
* `phone`: string, optional, valid Pakistani format.
* `bio`: string, optional, max 500 chars.
* `avatar`: string, optional, valid URL format.
* `preferences`: object, optional.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8e91",
    "fullName": "Muhammad Ali Khan",
    "email": "ali.khan@example.com",
    "phone": "03009876543",
    "bio": "Dedicated software engineering student.",
    "avatar": "https://images.msnacademy.pk/avatars/ali-new.jpg",
    "preferences": {
      "emailNotifications": true,
      "smsNotifications": true
    }
  }
}
```

### Error Responses
* **422 Unprocessable Entity:** Validation failed.

### Business Rules
* Email cannot be updated via this endpoint to preserve credential integrity.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-PROF-002`

### Related Frontend Feature
`features/profile/EditProfileForm.tsx` (`/profile`)

---

## PUT /users/password

### Purpose
Allows an authenticated student to update their account password after validating their current password.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "currentPassword": "Password123!",
  "newPassword": "UpdatedPassword456!"
}
```

### Validation Rules
* `currentPassword`: string, required.
* `newPassword`: string, required, min 8 chars with uppercase, lowercase, and number.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### Error Responses
* **400 Bad Request:** Current password is incorrect.
* **422 Unprocessable Entity:** New password does not meet complexity requirements.

### Business Rules
* Re-verifies `currentPassword` against Argon2id hash before committing update.

### Related Database Collection
`users`

### Related PRD Requirement
`FR-PROF-003`

### Related Frontend Feature
`features/profile/ChangePasswordForm.tsx` (`/profile`)

---

## 15. Course APIs

---

## GET /courses

### Purpose
Retrieves a paginated list of published courses with multi-faceted filtering, searching, and sorting.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
* `page`: integer (default: 1)
* `limit`: integer (default: 12, max: 50)
* `search`: string (keyword query)
* `category`: string (enum filter)
* `level`: string (`Beginner`, `Intermediate`, `Advanced`, `All Levels`)
* `sort`: string (`newest`, `price_asc`, `price_desc`, `popular`, `rating`)

### Request Headers
N/A

### Request Body
N/A

### Validation Rules
* `page`: optional, positive integer.
* `limit`: optional, integer between 1 and 50.
* `category`: optional, string.
* `level`: optional, string.
* `sort`: optional, enum.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": [
    {
      "id": "66d8f1e29c8e1a4b5c7d8e90",
      "title": "Professional Web Development Bootcamp",
      "slug": "professional-web-development-bootcamp",
      "subtitle": "Master React, Next.js, Node.js and MongoDB from scratch",
      "category": "Web Development",
      "level": "Beginner",
      "price": 8500,
      "originalPrice": 12000,
      "currency": "PKR",
      "thumbnail": "https://images.msnacademy.pk/courses/web-dev.jpg",
      "durationHours": 40,
      "totalLectures": 85,
      "averageRating": 4.8,
      "totalReviews": 124,
      "instructor": {
        "name": "Engr. Muhammad Saad",
        "title": "Senior Solutions Architect"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 36,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Responses
* **422 Unprocessable Entity:** Invalid query parameter format.

### Business Rules
* Strictly returns courses where `status === "PUBLISHED"`.
* Utilizes MongoDB text index on `{ title: "text", subtitle: "text", description: "text" }`.

### Related Database Collection
`courses`

### Related PRD Requirement
`FR-DISC-001`

### Related Frontend Feature
`features/courses/CourseCatalog.tsx` (`/courses`)

---

## GET /courses/:slug

### Purpose
Fetches full details for a single course identified by its human-readable URL slug, including curriculum modules, outcomes, prerequisites, and FAQs.

### Access
Public

### Authentication
Optional (`attachUser` if present to identify whether student is already enrolled)

### Parameters
* `slug`: string (URL slug identifier)

### Query Parameters
N/A

### Request Headers
N/A

### Request Body
N/A

### Validation Rules
* `slug`: string, required, regex `^[a-z0-9-]+$`.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Course details fetched successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8e90",
    "title": "Professional Web Development Bootcamp",
    "slug": "professional-web-development-bootcamp",
    "subtitle": "Master React, Next.js, Node.js and MongoDB from scratch",
    "description": "Comprehensive hands-on curriculum covering modern full-stack web applications.",
    "category": "Web Development",
    "level": "Beginner",
    "language": "Urdu / English",
    "price": 8500,
    "originalPrice": 12000,
    "currency": "PKR",
    "thumbnail": "https://images.msnacademy.pk/courses/web-dev.jpg",
    "previewVideoUrl": "https://stream.msnacademy.pk/preview-web-dev.mp4",
    "durationHours": 40,
    "totalLectures": 85,
    "averageRating": 4.8,
    "learningOutcomes": [
      "Build production web apps with React and Next.js",
      "Design robust RESTful APIs in Node.js and Express",
      "Deploy scalable MongoDB databases"
    ],
    "prerequisites": [
      "Basic computer literacy",
      "No prior coding experience required"
    ],
    "modules": [
      {
        "id": "mod-1",
        "title": "Module 1: Introduction to Web Technologies",
        "order": 1,
        "totalDurationMinutes": 180,
        "lectures": [
          {
            "id": "lec-101",
            "title": "How the Web Works: DNS, HTTP, Browsers",
            "order": 1,
            "durationMinutes": 25,
            "isPreview": true
          },
          {
            "id": "lec-102",
            "title": "HTML5 Semantic Architecture",
            "order": 2,
            "durationMinutes": 35,
            "isPreview": false
          }
        ]
      }
    ],
    "isEnrolled": false
  }
}
```

### Error Responses
* **404 Not Found:** Course with specified slug not found.

### Business Rules
* Full video streaming URLs for non-preview lectures are withheld; only `durationMinutes` and preview status are returned.
* If authenticated, computes `isEnrolled` against student's `enrollments`.

### Related Database Collection
`courses`, `enrollments`

### Related PRD Requirement
`FR-DISC-002`

### Related Frontend Feature
`features/courses/CourseDetailsPage.tsx` (`/courses/[slug]`)

---

## GET /courses/:courseId/syllabus

### Purpose
Returns the complete hierarchical module and lecture syllabus tree for a course.

### Access
Public

### Authentication
N/A

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
N/A

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Syllabus fetched successfully",
  "data": {
    "courseId": "66d8f1e29c8e1a4b5c7d8e90",
    "courseTitle": "Professional Web Development Bootcamp",
    "totalModules": 8,
    "totalLectures": 85,
    "modules": [
      {
        "id": "mod-1",
        "title": "Module 1: Introduction to Web Technologies",
        "order": 1,
        "lectures": [
          {
            "id": "lec-101",
            "title": "How the Web Works",
            "durationMinutes": 25,
            "isPreview": true
          }
        ]
      }
    ]
  }
}
```

### Error Responses
* **404 Not Found:** Course does not exist.

### Business Rules
* Lightweight endpoint specifically for syllabus accordion display on mobile views.

### Related Database Collection
`courses`

### Related PRD Requirement
`FR-DISC-002`

### Related Frontend Feature
`features/courses/CourseSyllabusSection.tsx`

---

## GET /categories

### Purpose
Lists all course categories along with their respective course counts and icons.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
N/A

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    { "name": "Web Development", "slug": "web-development", "courseCount": 14 },
    { "name": "Artificial Intelligence", "slug": "artificial-intelligence", "courseCount": 8 },
    { "name": "Data Science", "slug": "data-science", "courseCount": 6 },
    { "name": "Design", "slug": "design", "courseCount": 5 },
    { "name": "Marketing", "slug": "marketing", "courseCount": 4 },
    { "name": "Productivity", "slug": "productivity", "courseCount": 3 }
  ]
}
```

### Error Responses
N/A

### Business Rules
* Aggregated dynamically or cached via Redis.

### Related Database Collection
`courses`

### Related PRD Requirement
`FR-DISC-001`

### Related Frontend Feature
`features/courses/CategoryPills.tsx` (`/`, `/courses`)

---

## POST /contact

### Purpose
Submits a public contact inquiry or support message from prospective students.

### Access
Public

### Authentication
N/A

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`

### Request Body
```json
{
  "fullName": "Zain Ahmed",
  "email": "zain@example.com",
  "phone": "03123456789",
  "subject": "Inquiry about AI Course schedule",
  "message": "When will the next cohort for AI & Prompt Engineering start?"
}
```

### Validation Rules
* `fullName`: string, required, min 3 chars.
* `email`: string, required, valid email.
* `phone`: string, optional.
* `subject`: string, required, min 5 chars.
* `message`: string, required, min 10 chars, max 2000 chars.

### Success Response
* **Status:** `201 Created`
```json
{
  "success": true,
  "message": "Thank you! Your message has been received. Our team will contact you shortly.",
  "data": {
    "inquiryId": "66d8f1e29c8e1a4b5c7d8e99"
  }
}
```

### Error Responses
* **422 Unprocessable Entity:** Validation failed.

### Business Rules
* Persists inquiry to `contact_inquiries` collection and dispatches notification to admin email.

### Related Database Collection
`contact_inquiries`

### Related PRD Requirement
`FR-MISC-001`

### Related Frontend Feature
`features/courses/ContactForm.tsx` (`/contact`)

---

## 16. Cart APIs

---

## GET /cart

### Purpose
Retrieves the authenticated student's active shopping cart, itemized course list, applied discount voucher, and computed payable total.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8ea0",
    "items": [
      {
        "courseId": "66d8f1e29c8e1a4b5c7d8e90",
        "title": "Professional Web Development Bootcamp",
        "slug": "professional-web-development-bootcamp",
        "thumbnail": "https://images.msnacademy.pk/courses/web-dev.jpg",
        "price": 8500,
        "originalPrice": 12000
      }
    ],
    "appliedCoupon": {
      "code": "MSN10",
      "discountPercentage": 10,
      "discountAmount": 850
    },
    "subtotal": 8500,
    "discount": 850,
    "total": 7650,
    "currency": "PKR"
  }
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.

### Business Rules
* Computes live totals dynamically based on current course catalog prices.
* If a course was unenrolled or updated, prices are synced automatically.

### Related Database Collection
`carts`, `courses`

### Related PRD Requirement
`FR-COMM-001`

### Related Frontend Feature
`features/cart/CartDrawer.tsx` (Slide-Over Drawer)

---

## POST /cart/items

### Purpose
Adds a course to the student's active shopping cart.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "courseId": "66d8f1e29c8e1a4b5c7d8e90"
}
```

### Validation Rules
* `courseId`: string, required, valid 24-character ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Course added to cart",
  "data": {
    "totalItems": 1,
    "subtotal": 8500,
    "total": 8500
  }
}
```

### Error Responses
* **400 Bad Request:** Course does not exist or is not published.
* **409 Conflict:** Course is already in the cart OR student is already enrolled in this course.
  ```json
  {
    "success": false,
    "message": "You are already enrolled in this course",
    "errors": [],
    "statusCode": 409
  }
  ```

### Business Rules
* Prevents duplicate additions (`$addToSet` logic).
* Validates against existing active enrollments for the student before adding.

### Related Database Collection
`carts`, `courses`, `enrollments`

### Related PRD Requirement
`FR-COMM-001`

### Related Frontend Feature
`features/cart/AddToCartButton.tsx` (`/courses/[slug]`)

---

## DELETE /cart/items/:courseId

### Purpose
Removes a specific course item from the shopping cart.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "totalItems": 0,
    "subtotal": 0,
    "total": 0
  }
}
```

### Error Responses
* **404 Not Found:** Item not found in cart.

### Business Rules
* Recalculates subtotal and re-evaluates coupon eligibility.

### Related Database Collection
`carts`

### Related PRD Requirement
`FR-COMM-001`

### Related Frontend Feature
`features/cart/CartItemRow.tsx`

---

## DELETE /cart

### Purpose
Empties all course items and coupons from the active cart.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.

### Business Rules
* Resets items array to `[]` and removes coupon.

### Related Database Collection
`carts`

### Related PRD Requirement
`FR-COMM-001`

### Related Frontend Feature
`features/cart/ClearCartButton.tsx`

---

## POST /cart/promo

### Purpose
Validates and applies a promotional discount coupon to the active cart.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "code": "MSN10"
}
```

### Validation Rules
* `code`: string, required, uppercase alphanumeric.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "code": "MSN10",
    "discountPercentage": 10,
    "discountAmount": 850,
    "newTotal": 7650
  }
}
```

### Error Responses
* **400 Bad Request:** Coupon code invalid, expired, or cart minimum not met.

### Business Rules
* Server validates coupon code expiration, usage caps, and percentage limits.

### Related Database Collection
`carts`

### Related PRD Requirement
`FR-COMM-001`

### Related Frontend Feature
`features/cart/CouponInput.tsx`

---

## 17. Order APIs

---

## POST /orders/checkout

### Purpose
Converts items in the active cart into an immutable order with a unique order number (`MSN-ORD-XXXXX`), calculates final payable amounts, and reserves an order ledger.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "paymentMethod": "BANK_TRANSFER",
  "notes": "Payment will be sent via Meezan Bank"
}
```

### Validation Rules
* `paymentMethod`: enum, required (`BANK_TRANSFER`, `EASYPAISA`, `JAZZCASH`).
* `notes`: string, optional, max 250 chars.

### Success Response
* **Status:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "66d8f1e29c8e1a4b5c7d8eb0",
      "orderNumber": "MSN-ORD-00142",
      "status": "PENDING",
      "items": [
        {
          "courseId": "66d8f1e29c8e1a4b5c7d8e90",
          "title": "Professional Web Development Bootcamp",
          "price": 8500
        }
      ],
      "subtotal": 8500,
      "discount": 850,
      "totalAmount": 7650,
      "currency": "PKR",
      "paymentMethod": "BANK_TRANSFER",
      "createdAt": "2026-09-08T12:30:00.000Z"
    },
    "paymentDetails": {
      "bankName": "Meezan Bank Limited",
      "accountTitle": "MSN Academy Pvt Ltd",
      "accountNumber": "01010102938475",
      "iban": "PK45MEZN0001010102938475"
    }
  }
}
```

### Error Responses
* **400 Bad Request:** Cart is empty.
* **409 Conflict:** User already enrolled in one of the cart items.

### Business Rules
* **Strict Price Integrity:** Client-submitted price is ignored; the server re-fetches prices and calculates the total.
* Generates an immutable snapshot of course titles and prices.
* Clears the user's cart upon order generation.

### Related Database Collection
`orders`, `carts`, `courses`

### Related PRD Requirement
`FR-COMM-002`

### Related Frontend Feature
`features/checkout/CheckoutForm.tsx` (`/checkout`)

---

## GET /orders

### Purpose
Fetches a paginated history of the authenticated student's past orders and payment receipts.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
* `page`: integer (default: 1)
* `limit`: integer (default: 10)

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `page`: optional, positive integer.
* `limit`: optional, integer.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Order history retrieved",
  "data": [
    {
      "id": "66d8f1e29c8e1a4b5c7d8eb0",
      "orderNumber": "MSN-ORD-00142",
      "status": "COMPLETED",
      "totalAmount": 7650,
      "currency": "PKR",
      "itemsCount": 1,
      "paymentMethod": "BANK_TRANSFER",
      "createdAt": "2026-09-08T12:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.

### Business Rules
* Enforces `{ userId: req.user.id }` isolation.

### Related Database Collection
`orders`

### Related PRD Requirement
`FR-COMM-003`

### Related Frontend Feature
`features/orders/OrderHistoryPage.tsx` (`/orders`)

---

## GET /orders/:orderId

### Purpose
Retrieves single order details, items breakdown, payment status, and verification history.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `orderId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `orderId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Order details retrieved",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8eb0",
    "orderNumber": "MSN-ORD-00142",
    "status": "PENDING",
    "subtotal": 8500,
    "discount": 850,
    "totalAmount": 7650,
    "currency": "PKR",
    "paymentMethod": "BANK_TRANSFER",
    "items": [
      {
        "courseId": "66d8f1e29c8e1a4b5c7d8e90",
        "title": "Professional Web Development Bootcamp",
        "price": 8500
      }
    ],
    "createdAt": "2026-09-08T12:30:00.000Z"
  }
}
```

### Error Responses
* **404 Not Found:** Order not found or not owned by user.

### Business Rules
* Enforces ownership boundary.

### Related Database Collection
`orders`

### Related PRD Requirement
`FR-COMM-003`

### Related Frontend Feature
`features/orders/OrderReceiptModal.tsx`

---

## 18. Payment APIs

---

## POST /payments/create

### Purpose
Initializes a payment record for an existing pending order, returning instructions or gateway tokens.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "orderId": "66d8f1e29c8e1a4b5c7d8eb0"
}
```

### Validation Rules
* `orderId`: string, required, valid ObjectId.

### Success Response
* **Status:** `201 Created`
```json
{
  "success": true,
  "message": "Payment record initialized",
  "data": {
    "paymentId": "66d8f1e29c8e1a4b5c7d8ec0",
    "orderId": "66d8f1e29c8e1a4b5c7d8eb0",
    "amount": 7650,
    "currency": "PKR",
    "status": "PENDING_VERIFICATION",
    "instructions": {
      "method": "BANK_TRANSFER",
      "bankName": "Meezan Bank Limited",
      "accountTitle": "MSN Academy Pvt Ltd",
      "accountNumber": "01010102938475"
    }
  }
}
```

### Error Responses
* **404 Not Found:** Order does not exist.
* **409 Conflict:** Order already paid or completed.

### Business Rules
* Idempotent: If a pending payment already exists for this order, it returns the existing payment record.

### Related Database Collection
`payments`, `orders`

### Related PRD Requirement
`FR-PAY-001`

### Related Frontend Feature
`features/checkout/PaymentStep.tsx` (`/checkout`)

---

## POST /payments/:paymentId/verify

### Purpose
Allows a student to submit transaction verification proof (bank transaction reference ID, screenshot receipt URL) for manual audit.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `paymentId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "transactionReference": "TXN-MEEZAN-98472910",
  "receiptScreenshotUrl": "https://storage.msnacademy.pk/receipts/proof-98472910.jpg"
}
```

### Validation Rules
* `paymentId`: string, required, valid ObjectId.
* `transactionReference`: string, required, min 5 chars.
* `receiptScreenshotUrl`: string, optional, valid URL.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Proof of payment submitted. Verification typically completes within 24 hours.",
  "data": {
    "paymentId": "66d8f1e29c8e1a4b5c7d8ec0",
    "status": "UNDER_REVIEW",
    "submittedAt": "2026-09-08T13:00:00.000Z"
  }
}
```

### Error Responses
* **400 Bad Request:** Payment is already approved or rejected.
* **404 Not Found:** Payment record not found.

### Business Rules
* Updates payment status to `UNDER_REVIEW`. Notifies admin review queue.

### Related Database Collection
`payments`, `orders`

### Related PRD Requirement
`FR-PAY-002`

### Related Frontend Feature
`features/checkout/PaymentPendingPage.tsx` (`/order/pending`)

---

## GET /payments/:paymentId

### Purpose
Retrieves current verification status of a payment.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `paymentId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `paymentId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Payment status fetched",
  "data": {
    "paymentId": "66d8f1e29c8e1a4b5c7d8ec0",
    "orderId": "66d8f1e29c8e1a4b5c7d8eb0",
    "status": "APPROVED",
    "amount": 7650,
    "transactionReference": "TXN-MEEZAN-98472910",
    "verifiedAt": "2026-09-08T14:15:00.000Z"
  }
}
```

### Error Responses
* **404 Not Found:** Payment not found.

### Business Rules
* Polled by client or queried on success page.

### Related Database Collection
`payments`

### Related PRD Requirement
`FR-PAY-002`

### Related Frontend Feature
`features/checkout/OrderStatusPolling.tsx`

---

## POST /payments/webhook

### Purpose
Provider-independent webhook endpoint to receive asynchronous server-to-server transaction notifications from automated digital gateways (Safepay, Kuickpay, etc.).

### Access
Public (HMAC-SHA256 Signature Verified)

### Authentication
Webhook Signature Header (`X-Payment-Signature`)

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `X-Payment-Signature: <hex-signature>`

### Request Body
```json
{
  "eventId": "evt_live_839201948",
  "eventType": "payment.succeeded",
  "orderId": "66d8f1e29c8e1a4b5c7d8eb0",
  "transactionId": "TXN-GW-77382910",
  "amount": 7650,
  "currency": "PKR",
  "status": "PAID"
}
```

### Validation Rules
* Validates `X-Payment-Signature` against `PAYMENT_WEBHOOK_SECRET` using HMAC-SHA256.

### Success Response
* **Status:** `200 OK`
```json
{
  "received": true
}
```

### Error Responses
* **401 Unauthorized:** Invalid webhook cryptographic signature.
* **400 Bad Request:** Missing mandatory transaction ID.

### Business Rules
* **Strict Idempotency:** Checks if `eventId` or `transactionId` has already been processed.
* If valid, updates Payment to `APPROVED`, Order to `COMPLETED`, and atomically provisions `enrollments` within a MongoDB ACID transaction.

### Related Database Collection
`payments`, `orders`, `enrollments`

### Related PRD Requirement
`FR-PAY-003`

### Related Frontend Feature
Automated background fulfillment (No direct UI)

---

## PATCH /payments/:paymentId/approve

### Purpose
Back-office administrative endpoint to manually approve a bank receipt or manual transfer.

### Access
Role-Protected (`ADMIN`)

### Authentication
`requireAuth` + `requireRole(['ADMIN'])`

### Parameters
* `paymentId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "adminNotes": "Bank transfer verified in Meezan account statement."
}
```

### Validation Rules
* `paymentId`: string, required, valid ObjectId.
* `adminNotes`: string, optional.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Payment approved and enrollment provisioned",
  "data": {
    "paymentId": "66d8f1e29c8e1a4b5c7d8ec0",
    "status": "APPROVED",
    "orderStatus": "COMPLETED",
    "enrolledCourses": [
      "66d8f1e29c8e1a4b5c7d8e90"
    ]
  }
}
```

### Error Responses
* **403 Forbidden:** Requester lacks `ADMIN` role.
* **404 Not Found:** Payment record not found.

### Business Rules
* Executes in an atomic ACID transaction: updates Payment to `APPROVED`, Order to `COMPLETED`, creates `enrollments` records, and dispatches confirmation email.

### Related Database Collection
`payments`, `orders`, `enrollments`

### Related PRD Requirement
`FR-PAY-002`

### Related Frontend Feature
Internal Back-Office Audit Dashboard

---

## 19. Enrollment APIs

---

## GET /student/enrollments

### Purpose
Retrieves all courses currently enrolled by the authenticated student, including progress percentage, completion status, and last accessed lesson.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
* `status`: string (optional filter: `ALL`, `ACTIVE`, `COMPLETED`)
* `page`: integer (default: 1)
* `limit`: integer (default: 10)

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `status`: optional enum (`ALL`, `ACTIVE`, `COMPLETED`).

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Enrolled courses retrieved",
  "data": [
    {
      "enrollmentId": "66d8f1e29c8e1a4b5c7d8ed0",
      "courseId": "66d8f1e29c8e1a4b5c7d8e90",
      "title": "Professional Web Development Bootcamp",
      "slug": "professional-web-development-bootcamp",
      "thumbnail": "https://images.msnacademy.pk/courses/web-dev.jpg",
      "progressPercentage": 45,
      "totalLectures": 85,
      "completedLecturesCount": 38,
      "isCompleted": false,
      "lastAccessedLesson": {
        "id": "lec-105",
        "title": "CSS Grid Mastery"
      },
      "enrolledAt": "2026-09-08T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.

### Business Rules
* Filters by `{ userId: req.user.id, status: "ACTIVE" }`.

### Related Database Collection
`enrollments`, `courses`

### Related PRD Requirement
`FR-LRN-001`

### Related Frontend Feature
`features/learning/MyCoursesPage.tsx` (`/my-courses`)

---

## GET /student/dashboard-summary

### Purpose
Aggregates student metrics: enrolled courses count, completed courses, total hours learned, and certificates earned.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
N/A

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
N/A

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved",
  "data": {
    "enrolledCoursesCount": 3,
    "activeCoursesCount": 2,
    "completedCoursesCount": 1,
    "certificatesEarnedCount": 1,
    "recentActivity": [
      {
        "courseId": "66d8f1e29c8e1a4b5c7d8e90",
        "courseTitle": "Professional Web Development Bootcamp",
        "lessonTitle": "CSS Grid Mastery",
        "progressPercentage": 45,
        "lastWatchedAt": "2026-09-08T14:30:00.000Z"
      }
    ]
  }
}
```

### Error Responses
* **401 Unauthorized:** Unauthenticated.

### Business Rules
* Queries `enrollments` and `certificates` collections to render student dashboard cards.

### Related Database Collection
`enrollments`, `certificates`

### Related PRD Requirement
`FR-LRN-002`

### Related Frontend Feature
`features/learning/StudentDashboard.tsx` (`/dashboard`)

---

## 20. Learning APIs

---

## GET /learning/:courseId/overview

### Purpose
Provides full learning portal context for an enrolled course, including complete module breakdown, lesson completion markers, active progress, and assessment eligibility.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Course learning overview loaded",
  "data": {
    "courseId": "66d8f1e29c8e1a4b5c7d8e90",
    "title": "Professional Web Development Bootcamp",
    "progressPercentage": 45,
    "totalLectures": 85,
    "completedLecturesCount": 38,
    "canTakeAssessment": false,
    "modules": [
      {
        "id": "mod-1",
        "title": "Module 1: HTML & CSS Core",
        "order": 1,
        "lectures": [
          {
            "id": "lec-101",
            "title": "HTML5 Fundamentals",
            "durationMinutes": 25,
            "isCompleted": true
          },
          {
            "id": "lec-102",
            "title": "CSS Grid Mastery",
            "durationMinutes": 35,
            "isCompleted": false
          }
        ]
      }
    ]
  }
}
```

### Error Responses
* **403 Forbidden:** Student is not enrolled in this course.
  ```json
  {
    "success": false,
    "message": "Access denied. Active enrollment required.",
    "errors": [],
    "statusCode": 403
  }
  ```

### Business Rules
* Enforces strict authorization: checks existence of active enrollment.

### Related Database Collection
`enrollments`, `courses`

### Related PRD Requirement
`FR-LRN-003`

### Related Frontend Feature
`features/learning/CourseLearningOverview.tsx` (`/learn/[courseId]`)

---

## GET /learning/:courseId/lessons/:lessonId

### Purpose
Streams lecture content, secure video URL (with expiring presigned token), lecture transcript, and downloadable resources.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)
* `lessonId`: string (lesson identifier)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.
* `lessonId`: string, required.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Lesson content retrieved",
  "data": {
    "lessonId": "lec-102",
    "title": "CSS Grid Mastery",
    "description": "Deep dive into CSS Grid layout algorithms and responsiveness.",
    "videoStreamUrl": "https://stream.msnacademy.pk/hls/lec-102/master.m3u8?token=exp1725890000_sig987",
    "durationMinutes": 35,
    "order": 2,
    "isCompleted": false,
    "nextLessonId": "lec-103",
    "prevLessonId": "lec-101",
    "resources": [
      {
        "title": "Grid Cheat Sheet PDF",
        "downloadUrl": "https://storage.msnacademy.pk/resources/grid-cheatsheet.pdf"
      }
    ]
  }
}
```

### Error Responses
* **403 Forbidden:** Student is not enrolled.
* **404 Not Found:** Lesson does not exist in this course.

### Business Rules
* Generates an expiring HMAC-signed playback URL valid for 2 hours.

### Related Database Collection
`courses`, `enrollments`

### Related PRD Requirement
`FR-LRN-004`

### Related Frontend Feature
`features/learning/LessonPlayer.tsx` (`/lesson/[lessonId]`)

---

## 21. Progress APIs

---

## POST /learning/:courseId/lessons/:lessonId/complete

### Purpose
Marks a specific lesson as completed by the student, recalculates overall course progress percentage, and unlocks final assessment if 100% completed.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)
* `lessonId`: string (lesson identifier)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.
* `lessonId`: string, required.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Lesson marked as complete",
  "data": {
    "courseId": "66d8f1e29c8e1a4b5c7d8e90",
    "lessonId": "lec-102",
    "completedLecturesCount": 39,
    "totalLectures": 85,
    "progressPercentage": 46,
    "canTakeAssessment": false
  }
}
```

### Error Responses
* **403 Forbidden:** Unenrolled student.

### Business Rules
* Uses atomic `$addToSet` on `completedLessonIds` to prevent duplicate increments.
* Calculates `progressPercentage = Math.round((completedLecturesCount / totalLectures) * 100)`.
* If progress reaches 100%, updates `canTakeAssessment = true`.

### Related Database Collection
`enrollments`

### Related PRD Requirement
`FR-LRN-005`

### Related Frontend Feature
`features/learning/CompleteLessonButton.tsx` (`/lesson/[lessonId]`)

---

## GET /learning/:courseId/progress

### Purpose
Returns granular course progress metrics and list of completed lesson IDs.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Progress retrieved",
  "data": {
    "courseId": "66d8f1e29c8e1a4b5c7d8e90",
    "progressPercentage": 46,
    "completedLecturesCount": 39,
    "totalLectures": 85,
    "completedLessonIds": [
      "lec-101",
      "lec-102"
    ],
    "canTakeAssessment": false
  }
}
```

### Error Responses
* **403 Forbidden:** Unenrolled student.

### Business Rules
* Dedicated lightweight progress sync for sidebar checkmarks.

### Related Database Collection
`enrollments`

### Related PRD Requirement
`FR-LRN-005`

### Related Frontend Feature
`features/learning/CourseSidebar.tsx`

---

## 22. Assessment APIs

---

## GET /assessments/:courseId/briefing

### Purpose
Fetches pre-exam briefing details: total question count, passing percentage threshold (70%), time limit (120 minutes), and candidate's previous attempt history.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Assessment briefing loaded",
  "data": {
    "assessmentId": "66d8f1e29c8e1a4b5c7d8ee0",
    "courseId": "66d8f1e29c8e1a4b5c7d8e90",
    "courseTitle": "Professional Web Development Bootcamp",
    "totalQuestions": 50,
    "timeLimitMinutes": 120,
    "passingPercentage": 70,
    "isCourseCompleted": true,
    "canAttempt": true,
    "previousAttempts": [
      {
        "attemptId": "66d8f1e29c8e1a4b5c7d8ee1",
        "scorePercentage": 64,
        "isPassed": false,
        "submittedAt": "2026-09-07T10:00:00.000Z"
      }
    ]
  }
}
```

### Error Responses
* **403 Forbidden:** Course lessons not yet completed or not enrolled.

### Business Rules
* Validates that student has completed all lessons before permitting exam.

### Related Database Collection
`assessments`, `assessment_attempts`, `enrollments`

### Related PRD Requirement
`FR-ASS-001`

### Related Frontend Feature
`features/assessment/AssessmentBriefing.tsx` (`/learn/[courseId]/assessment`)

---

## POST /assessments/:courseId/start

### Purpose
Starts a new assessment attempt, initialises a server-anchored 120-minute expiration timestamp, and projects randomized questions **without answer keys**.

### Access
Authenticated (Enrolled Student)

### Authentication
`requireAuth` + Enrollment Check

### Parameters
* `courseId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `courseId`: string, required, valid ObjectId.

### Success Response
* **Status:** `201 Created`
```json
{
  "success": true,
  "message": "Assessment session started. Timer is running.",
  "data": {
    "attemptId": "66d8f1e29c8e1a4b5c7d8ee2",
    "startedAt": "2026-09-08T15:00:00.000Z",
    "expiresAt": "2026-09-08T17:00:00.000Z",
    "timeLimitMinutes": 120,
    "totalQuestions": 50,
    "questions": [
      {
        "questionId": "q-101",
        "order": 1,
        "text": "Which React hook is used to handle side-effects in functional components?",
        "options": [
          { "key": "A", "text": "useState" },
          { "key": "B", "text": "useEffect" },
          { "key": "C", "text": "useContext" },
          { "key": "D", "text": "useReducer" }
        ]
      }
    ]
  }
}
```

### Error Responses
* **409 Conflict:** An active, unexpired attempt is already running for this user. Returns existing `attemptId`.

### Business Rules
* **Security Critical:** Correct answer keys (`correctOptionKey`) are **strictly excluded** from API projection.
* `expiresAt` is set server-side (`now + 120 minutes`).

### Related Database Collection
`assessments`, `assessment_attempts`

### Related PRD Requirement
`FR-ASS-002`

### Related Frontend Feature
`features/assessment/AssessmentExamView.tsx` (`/learn/[courseId]/assessment/exam`)

---

## POST /assessments/:attemptId/answer

### Purpose
Persists or updates an individual answer selection and bookmark/flag status during an active assessment attempt.

### Access
Authenticated (Owner / Exam Candidate)

### Authentication
`requireAuth`

### Parameters
* `attemptId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Content-Type: application/json`
* `Cookie: msn_session_token=<jwt>`

### Request Body
```json
{
  "questionId": "q-101",
  "selectedOptionKey": "B",
  "isFlagged": false
}
```

### Validation Rules
* `attemptId`: string, required, valid ObjectId.
* `questionId`: string, required.
* `selectedOptionKey`: string, optional (`A`, `B`, `C`, `D`).
* `isFlagged`: boolean, optional.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Answer saved",
  "data": {
    "questionId": "q-101",
    "selectedOptionKey": "B",
    "isFlagged": false
  }
}
```

### Error Responses
* **403 Forbidden:** Attempt does not belong to user or is already submitted.
* **410 Gone:** Exam session has expired (`now > expiresAt`).

### Business Rules
* Server checks `now < expiresAt`. If expired, rejects update and triggers auto-submission.

### Related Database Collection
`assessment_attempts`

### Related PRD Requirement
`FR-ASS-002`

### Related Frontend Feature
`features/assessment/QuestionCard.tsx`

---

## GET /assessments/:attemptId/review

### Purpose
Retrieves an overview of all questions in the active attempt, showing answered, unanswered, and flagged questions prior to final submission.

### Access
Authenticated (Owner / Exam Candidate)

### Authentication
`requireAuth`

### Parameters
* `attemptId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `attemptId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Attempt review summary loaded",
  "data": {
    "attemptId": "66d8f1e29c8e1a4b5c7d8ee2",
    "remainingSeconds": 3420,
    "totalQuestions": 50,
    "answeredCount": 48,
    "unansweredCount": 2,
    "flaggedCount": 3,
    "questionSummary": [
      { "questionId": "q-101", "order": 1, "isAnswered": true, "isFlagged": false },
      { "questionId": "q-102", "order": 2, "isAnswered": false, "isFlagged": true }
    ]
  }
}
```

### Error Responses
* **403 Forbidden:** Attempt not owned by user.
* **410 Gone:** Exam expired.

### Business Rules
* Allows candidate to inspect unattempted questions before final submission.

### Related Database Collection
`assessment_attempts`

### Related PRD Requirement
`FR-ASS-003`

### Related Frontend Feature
`features/assessment/AssessmentReviewScreen.tsx` (`/learn/[courseId]/assessment/review`)

---

## POST /assessments/:attemptId/submit

### Purpose
Finalizes and closes an assessment attempt, triggers server-side grading, evaluates 70% passing threshold, and conditionally generates a certificate.

### Access
Authenticated (Owner / Exam Candidate)

### Authentication
`requireAuth`

### Parameters
* `attemptId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `attemptId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Assessment evaluated successfully",
  "data": {
    "attemptId": "66d8f1e29c8e1a4b5c7d8ee2",
    "totalQuestions": 50,
    "correctAnswersCount": 42,
    "scorePercentage": 84,
    "passingPercentage": 70,
    "isPassed": true,
    "submittedAt": "2026-09-08T16:30:00.000Z",
    "certificateId": "66d8f1e29c8e1a4b5c7d8ef0"
  }
}
```

### Error Responses
* **400 Bad Request:** Attempt was already submitted.
* **403 Forbidden:** User does not own attempt.

### Business Rules
* Server evaluates submitted answers against secret master key.
* If `scorePercentage >= 70`:
  * Sets `isPassed = true`.
  * Generates unique certificate record (`MSN-2024-XXXX`).
  * Enqueues BullMQ worker for PDF generation.
* If `scorePercentage < 70`:
  * Sets `isPassed = false`.
  * Allows candidate to retake exam.

### Related Database Collection
`assessment_attempts`, `assessments`, `certificates`

### Related PRD Requirement
`FR-ASS-004`

### Related Frontend Feature
`features/assessment/AssessmentResultView.tsx` (`/learn/[courseId]/assessment/result`)

---

## GET /assessments/:attemptId/result

### Purpose
Fetches past or current assessment attempt outcome, score, and pass/fail summary.

### Access
Authenticated (Owner / Exam Candidate)

### Authentication
`requireAuth`

### Parameters
* `attemptId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `attemptId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Assessment result retrieved",
  "data": {
    "attemptId": "66d8f1e29c8e1a4b5c7d8ee2",
    "courseTitle": "Professional Web Development Bootcamp",
    "totalQuestions": 50,
    "correctAnswersCount": 42,
    "scorePercentage": 84,
    "passingPercentage": 70,
    "isPassed": true,
    "certificateId": "66d8f1e29c8e1a4b5c7d8ef0"
  }
}
```

### Error Responses
* **404 Not Found:** Result not found.

### Business Rules
* Read-only result rendering.

### Related Database Collection
`assessment_attempts`

### Related PRD Requirement
`FR-ASS-004`

### Related Frontend Feature
`features/assessment/AssessmentResultView.tsx`

---

## 23. Certificate APIs

---

## GET /certificates/:certificateId

### Purpose
Retrieves authenticated student's earned certificate metadata, course name, issue date, verification code, and vector badge details.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `certificateId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `certificateId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Certificate retrieved successfully",
  "data": {
    "id": "66d8f1e29c8e1a4b5c7d8ef0",
    "certificateNumber": "MSN-2024-00142",
    "studentName": "Muhammad Ali",
    "courseTitle": "Professional Web Development Bootcamp",
    "issueDate": "2026-09-08",
    "scorePercentage": 84,
    "pdfUrl": "https://storage.msnacademy.pk/certificates/MSN-2024-00142.pdf",
    "verificationUrl": "https://msnacademy.pk/verify/MSN-2024-00142"
  }
}
```

### Error Responses
* **404 Not Found:** Certificate not found.
* **403 Forbidden:** Requester does not own this certificate.

### Business Rules
* Student name is snapshotted upon certificate issuance to prevent post-completion tampering.

### Related Database Collection
`certificates`

### Related PRD Requirement
`FR-CERT-001`

### Related Frontend Feature
`features/certificates/CertificateView.tsx` (`/certificate/[certId]`)

---

## GET /certificates/:certificateId/download

### Purpose
Returns a temporary presigned URL to download the high-resolution vector PDF certificate.

### Access
Authenticated (Owner)

### Authentication
`requireAuth`

### Parameters
* `certificateId`: string (24-char ObjectId)

### Query Parameters
N/A

### Request Headers
* `Cookie: msn_session_token=<jwt>`

### Request Body
N/A

### Validation Rules
* `certificateId`: string, required, valid ObjectId.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Download link generated",
  "data": {
    "downloadUrl": "https://storage.msnacademy.pk/certificates/MSN-2024-00142.pdf?token=exp1725899999_sig432",
    "expiresInSeconds": 300
  }
}
```

### Error Responses
* **404 Not Found:** Certificate not found.

### Business Rules
* Issues an S3 presigned expiring download URL.

### Related Database Collection
`certificates`

### Related PRD Requirement
`FR-CERT-001`

### Related Frontend Feature
`features/certificates/DownloadPdfButton.tsx`

---

## GET /certificates/verify/:certificateNumber

### Purpose
Public, unauthenticated verification endpoint allowing employers, recruiters, and academic institutions to validate certificate authenticity using the certificate number (`MSN-XXXX-XXXX`).

### Access
Public

### Authentication
N/A

### Parameters
* `certificateNumber`: string (e.g., `MSN-2024-00142`)

### Query Parameters
N/A

### Request Headers
N/A

### Request Body
N/A

### Validation Rules
* `certificateNumber`: string, required, regex `^MSN-[0-9]{4}-[0-9]{4,6}$`.

### Success Response
* **Status:** `200 OK`
```json
{
  "success": true,
  "message": "Certificate verified successfully",
  "data": {
    "isValid": true,
    "certificateNumber": "MSN-2024-00142",
    "studentName": "Muhammad Ali",
    "courseTitle": "Professional Web Development Bootcamp",
    "issueDate": "2026-09-08",
    "status": "ACTIVE"
  }
}
```

### Error Responses
* **404 Not Found:**
  ```json
  {
    "success": false,
    "message": "Certificate record not found. Please verify the certificate number.",
    "errors": [],
    "statusCode": 404
  }
  ```

### Business Rules
* Excludes student contact information (email, phone) to protect student privacy.
* Unauthenticated public lookup.

### Related Database Collection
`certificates`

### Related PRD Requirement
`FR-CERT-002`

### Related Frontend Feature
`features/certificates/PublicVerifyPage.tsx` (`/verify`, `/verify/[code]`)

---

## 24. API Dependency Map

The following architectural map illustrates dependency chains across domain modules.

```text
AUTH MODULE
 │
 ├── USERS MODULE (Profile, Password Management)
 │
 └── PROTECTED DOMAINS
        │
        ├── COURSES (Public Catalog, Syllabus Preview)
        │
        ├── CART MODULE (Item Addition, Coupon Deductions)
        │      │
        │      └── ORDERS MODULE (Checkout, Price Snapshotting)
        │             │
        │             └── PAYMENTS MODULE (Manual Audit / Gateway Webhook)
        │                    │
        │                    └── ENROLLMENTS MODULE (Student Access Provisioning)
        │
        └── LEARNING MODULE (Lecture Streaming, Lesson Unlocks)
                │
                ├── PROGRESS TRACKING (Lesson Completion, 100% Unlock)
                │
                └── ASSESSMENTS MODULE (Timed Exam Sessions, MCQ Grading)
                         │
                         └── CERTIFICATES MODULE (PDF Vector Issuance, Public Verification)
```

---

## 25. Request/Response Data Contracts

All data contracts strictly mirror the types specified in [`02-Database-Design.md`](file:///c:/Users/HS%20LAPTOP/Downloads/MSN%20Academy%20project/02-Database-Design.md).

### Entity Data Types Reference

| Field Name | Type | DB Collection | Contract Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (ObjectId) | All | Unique 24-character hexadecimal identifier. |
| `email` | `string` | `users` | Normalized lowercase student email address. |
| `orderNumber` | `string` | `orders` | Human-readable identifier format: `MSN-ORD-XXXXX`. |
| `certificateNumber` | `string` | `certificates` | Verification code format: `MSN-YYYY-XXXXX`. |
| `price`, `subtotal`, `total` | `number` | `courses`, `carts`, `orders` | Non-negative integer in Pakistani Rupees (`PKR`). |
| `progressPercentage` | `number` | `enrollments` | Integer percentage value from `0` to `100`. |
| `scorePercentage` | `number` | `assessment_attempts` | Integer percentage grade from `0` to `100`. |

---

## 26. Validation Specification

| Endpoint | Input Field | Data Type | Required | Strict Validation Rule |
| :--- | :--- | :--- | :---: | :--- |
| `POST /auth/register` | `email` | string | Yes | Valid email format; converted to lowercase. |
| `POST /auth/register` | `password` | string | Yes | Min 8 chars, $\ge 1$ uppercase, $\ge 1$ lowercase, $\ge 1$ number. |
| `POST /auth/register` | `phone` | string | Yes | Valid Pakistani format: `^03[0-9]{9}$`. |
| `POST /auth/login` | `email` | string | Yes | Valid email string format. |
| `POST /auth/login` | `password` | string | Yes | Non-empty string. |
| `PUT /users/profile` | `fullName` | string | No | String length between 3 and 60 chars. |
| `POST /cart/items` | `courseId` | string | Yes | Exactly 24-character hex ObjectId. |
| `POST /cart/promo` | `code` | string | Yes | Alphanumeric string; max 15 chars. |
| `POST /orders/checkout` | `paymentMethod`| string | Yes | Enum: `BANK_TRANSFER`, `EASYPAISA`, `JAZZCASH`. |
| `POST /payments/:id/verify`| `transactionReference`| string | Yes | Alphanumeric reference; min 5 chars, max 60 chars. |
| `POST /assessments/:id/answer`| `selectedOptionKey` | string | No | Enum: `A`, `B`, `C`, `D`. |
| `GET /certificates/verify/:num`| `certificateNumber` | string | Yes | Regex: `^MSN-[0-9]{4}-[0-9]{4,6}$`. |

---

## 27. Authentication Header Specification

For API clients or cross-origin requests unable to leverage `SameSite` cookies, the API supports the standard Bearer header:

```text
Authorization: Bearer <access_token>
```

### Authorization Processing Pipeline:
1. **Extraction:** Middleware checks `req.cookies.msn_session_token`. If absent, checks `req.headers.authorization`.
2. **Missing Token:** If both are absent, request halts with `401 Unauthorized` (`"Authentication required"`).
3. **Signature Verification:** Token signature is verified against `JWT_SECRET`. If invalid or manipulated, returns `401 Unauthorized` (`"Invalid session token"`).
4. **Expiration:** If `exp < now`, returns `401 Unauthorized` (`"Session token has expired"`).
5. **User Hydration:** If valid, user identity `{ id, email, role }` is attached to `req.user`.

---

## 28. Error & Edge Case Matrix

| API Module | Edge Case Scenario | HTTP Code | Error Response Message | Resolution / Handling |
| :--- | :--- | :---: | :--- | :--- |
| **Auth** | Registration with already-registered email | **409** | `"An account with this email already exists"` | Prompt user to log in or reset password. |
| **Auth** | Login with wrong password | **401** | `"Invalid email or password"` | Generic message prevents account enumeration. |
| **Cart** | Adding a course already enrolled | **409** | `"You are already enrolled in this course"` | Disallow duplicate purchase. |
| **Cart** | Adding duplicate course to cart | **409** | `"Course is already in your shopping cart"` | Cart maintains unique course list. |
| **Orders** | Client tampers with price payload | **422** | `"Price calculation rejected"` | Server calculates all prices independently. |
| **Payments** | Duplicate payment submission | **409** | `"Payment is already under review or approved"` | Idempotency guard prevents duplicate records. |
| **Learning** | Accessing lecture without enrollment | **403** | `"Access denied. Active enrollment required."` | Redirects to course purchase page. |
| **Assessments**| Submitting answer after 120-minute expiry | **410** | `"Assessment session has expired"` | Auto-submits current answers for grading. |
| **Assessments**| Inspecting network request for answers | **200** | Keys not sent | `correctOptionKey` omitted from payload. |
| **Certificates**| Verifying non-existent certificate | **404** | `"Certificate record not found"` | Displays invalid certificate banner. |

---

## 29. Security Requirements

1. **Strict Input Sanitization:** Zod schema parsing rejects unexpected properties (`strip()` policy). NoSQL operator injection (e.g., `{"$gt": ""}`) is neutralized.
2. **Zero Insecure Token Storage:** Web client relies exclusively on `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Tokens cannot be accessed via `document.cookie`.
3. **CORS Whitelist:** Whitelists only approved Next.js frontend domains.
4. **Rate Limiting:** Sliding-window rate limiters block credential-stuffing attacks on `/auth/login` and `/auth/register`.
5. **Security Headers:** Enforced via Helmet (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`).
6. **Payload Size Guard:** Request body size limited to `100kb` for JSON and `10mb` for multipart file uploads.

---

## 30. API Idempotency

Idempotency guarantees that identical repeated requests yield the same outcome without side effects:

* **Payment Webhooks (`POST /payments/webhook`):** The server verifies whether the unique `transactionId` or `eventId` has already been recorded in `payments`. If present, returns `200 OK` immediately without re-enrolling or updating orders.
* **Order Creation (`POST /orders/checkout`):** If an order is submitted multiple times, the server detects duplicate active pending orders for the same cart items.
* **Lesson Progress (`POST /learning/:id/lessons/:id/complete`):** Enforces atomic `$addToSet` in MongoDB, ensuring duplicate completions do not artificially inflate completion counts.

---

## 31. API Rate Limiting

Rate limits protect availability and prevent brute-force attacks:

| Endpoint Group | Recommended Rate Limit | Window | Exceeded Response | Status |
| :--- | :--- | :--- | :--- | :---: |
| `POST /auth/login` | 5 attempts / IP | 15 minutes | `"Too many login attempts. Please try again later."` | **429** |
| `POST /auth/register` | 3 attempts / IP | 60 minutes | `"Registration limit reached. Please try again later."` | **429** |
| `POST /auth/forgot-password`| 3 attempts / IP | 60 minutes | `"Password reset limit reached."` | **429** |
| `GET /certificates/verify/*`| 30 requests / IP | 1 minute | `"Too many verification requests."` | **429** |
| General Public APIs | 100 requests / IP | 1 minute | `"Rate limit exceeded."` | **429** |

*Note: Numerical rate thresholds are baseline defaults; production adjustments marked as **To Be Confirmed**.*

---

## 32. API Versioning & Future Compatibility

* Current Version: `/api/v1`
* **Non-Breaking Changes (Within `v1`):**
  * Adding new optional request fields.
  * Adding new response properties.
  * Adding new independent endpoints.
* **Breaking Changes (Requiring `/api/v2`):**
  * Renaming or removing existing response keys.
  * Changing data types of existing fields.
  * Altering authentication or authorization semantics.

---

## 33. API Module Ownership — 5 Members

The 5 developers are assigned clear, non-overlapping API domains:

| Team Member | Module Ownership | Key Endpoint Responsibilities | Database Models Owned |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Auth & User Profiles** | `POST /auth/*`, `GET/PUT /users/*` | `User` |
| **Member 2** | **Course Catalog & Contact** | `GET /courses/*`, `GET /categories`, `POST /contact` | `Course`, `ContactInquiry` |
| **Member 3** | **Cart, Orders & Payments** | `* /cart/*`, `* /orders/*`, `* /payments/*` | `Cart`, `Order`, `Payment` |
| **Member 4** | **Enrollments & Learning** | `GET /student/*`, `GET/POST /learning/*` | `Enrollment` |
| **Member 5** | **Assessments & Certificates** | `* /assessments/*`, `* /certificates/*` | `Assessment`, `AssessmentAttempt`, `Certificate` |

---

## 34. Parallel Development Strategy

This API specification serves as the frozen, implementation-ready contract enabling frontend and backend teams to build concurrently:

```text
PRD (01-PRD.md)
       ↓
Database Contract (02-Database-Design.md)
       ↓
API Specification (05-API-Specification.md)
       ↓
┌───────────────────────────────────────┴───────────────────────────────────────┐
│                                                                               │
Backend Development (5 Devs)                                     Frontend Development (5 Devs)
├── Member 1: Auth/User Routes & JWT                             ├── Member 1: Auth/Profile Pages & Redux Auth
├── Member 2: Course Aggregations & Catalog Filter              ├── Member 2: Course Catalog & Details UI
├── Member 3: Cart, Checkout & Payment Adapters                 ├── Member 3: Cart Drawer & Checkout Flow
├── Member 4: Lesson Player & Progress Engine                   ├── Member 4: Learning Portal & Player
└── Member 5: Assessment Timer & Certificate PDF                └── Member 5: Assessment Session & Certificate
```

### Mocking Guidelines for Frontend Developers:
1. **Mock Endpoints:** Frontend developers use Mock Service Worker (MSW) or Next.js Route Handlers utilizing the exact JSON success payloads documented in this specification.
2. **Contract Stability:** Field names (`id`, `orderNumber`, `certificateNumber`, `progressPercentage`) and HTTP status codes are frozen. Neither team may alter payload schemas without an approved specification amendment.

---

## 35. API Testing Strategy

### 1. Authentication Test Cases
* `POST /auth/register` returns 201 and sets `msn_session_token` cookie.
* `POST /auth/register` with duplicate email returns 409 Conflict.
* `POST /auth/login` with incorrect password returns 401 Unauthorized.

### 2. Courses Test Cases
* `GET /courses` returns 200 with paginated array and valid `meta` envelope.
* `GET /courses?category=Web+Development` filters results strictly.
* `GET /courses/:slug` with non-existent slug returns 404 Not Found.

### 3. Orders & Cart Test Cases
* `POST /cart/items` with enrolled course returns 409 Conflict.
* `POST /orders/checkout` accurately calculates discount and total on the server.
* `GET /orders` returns only orders belonging to authenticated user.

### 4. Payments Test Cases
* `POST /payments/:id/verify` updates status to `UNDER_REVIEW`.
* Duplicate webhook payloads with identical transaction IDs process idempotently.

### 5. Learning & Progress Test Cases
* `GET /learning/:courseId/overview` returns 403 Forbidden for unenrolled students.
* `POST /learning/:courseId/lessons/:lessonId/complete` recalculates progress percentage atomically.

### 6. Assessment Test Cases
* `POST /assessments/:courseId/start` projects questions without `correctOptionKey`.
* Submitting attempt after 120 minutes returns 410 Gone.
* Attempt with $\ge 70\%$ score creates certificate record and returns `isPassed: true`.

### 7. Certificate Test Cases
* `GET /certificates/verify/:certificateNumber` returns 200 for valid code and 404 for invalid code.

---

## 36. API Documentation Format Standard

Every endpoint in this specification follows this standardized structure:

```text
## METHOD /path

### Purpose

### Access

### Authentication

### Parameters

### Query Parameters

### Request Headers

### Request Body

### Validation Rules

### Success Response

### Error Responses

### Business Rules

### Related Database Collection

### Related PRD Requirement

### Related Frontend Feature
```

---

## 37. Complete API Inventory

| # | Method | Endpoint | Module | Auth | Role / Access | Purpose |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `POST` | `/api/v1/auth/register` | Auth | Public | Guest | Register student account |
| 2 | `POST` | `/api/v1/auth/login` | Auth | Public | Guest | Authenticate user & issue JWT |
| 3 | `POST` | `/api/v1/auth/logout` | Auth | Required | Authenticated | Terminate session & clear cookie |
| 4 | `GET` | `/api/v1/auth/me` | Auth | Required | Authenticated | Retrieve active session user |
| 5 | `POST` | `/api/v1/auth/forgot-password` | Auth | Public | Guest | Request password reset token |
| 6 | `POST` | `/api/v1/auth/reset-password` | Auth | Public | Guest | Reset password via token |
| 7 | `POST` | `/api/v1/auth/oauth/google` | Auth | Public | Guest | Authenticate with Google ID token |
| 8 | `GET` | `/api/v1/users/profile` | Users | Required | Owner | Get full student profile |
| 9 | `PUT` | `/api/v1/users/profile` | Users | Required | Owner | Update profile details |
| 10 | `PUT` | `/api/v1/users/password` | Users | Required | Owner | Change account password |
| 11 | `GET` | `/api/v1/courses` | Courses | Public | Guest | Search, filter, paginate courses |
| 12 | `GET` | `/api/v1/courses/:slug` | Courses | Public | Guest | Fetch course details by slug |
| 13 | `GET` | `/api/v1/courses/:courseId/syllabus` | Courses | Public | Guest | Course syllabus preview |
| 14 | `GET` | `/api/v1/categories` | Courses | Public | Guest | List categories & course counts |
| 15 | `POST` | `/api/v1/contact` | Courses | Public | Guest | Submit contact inquiry form |
| 16 | `GET` | `/api/v1/cart` | Cart | Required | Owner | Get active shopping cart |
| 17 | `POST` | `/api/v1/cart/items` | Cart | Required | Owner | Add course item to cart |
| 18 | `DELETE` | `/api/v1/cart/items/:courseId`| Cart | Required | Owner | Remove course item from cart |
| 19 | `DELETE` | `/api/v1/cart` | Cart | Required | Owner | Clear active cart |
| 20 | `POST` | `/api/v1/cart/promo` | Cart | Required | Owner | Apply discount coupon voucher |
| 21 | `POST` | `/api/v1/orders/checkout` | Orders | Required | Owner | Create order from cart |
| 22 | `GET` | `/api/v1/orders` | Orders | Required | Owner | Student order history |
| 23 | `GET` | `/api/v1/orders/:orderId` | Orders | Required | Owner | Single order receipt details |
| 24 | `POST` | `/api/v1/payments/create` | Payments | Required | Owner | Initialize payment for order |
| 25 | `POST` | `/api/v1/payments/:paymentId/verify`| Payments | Required | Owner | Submit bank payment receipt |
| 26 | `GET` | `/api/v1/payments/:paymentId` | Payments | Required | Owner | Check payment audit status |
| 27 | `POST` | `/api/v1/payments/webhook` | Payments | Public | Gateway Signature | Digital gateway webhook |
| 28 | `PATCH` | `/api/v1/payments/:paymentId/approve`| Payments | Required | `ADMIN` | Manual payment audit approval |
| 29 | `GET` | `/api/v1/student/enrollments` | Enrollments | Required | Owner | List enrolled courses |
| 30 | `GET` | `/api/v1/student/dashboard-summary` | Enrollments | Required | Owner | Student dashboard KPI summary |
| 31 | `GET` | `/api/v1/learning/:courseId/overview`| Learning | Required | Enrolled Student | Enrolled course learning hub |
| 32 | `GET` | `/api/v1/learning/:courseId/lessons/:lessonId`| Learning | Required | Enrolled Student | Stream lecture video content |
| 33 | `POST` | `/api/v1/learning/:courseId/lessons/:lessonId/complete`| Progress | Required | Enrolled Student | Complete lesson & bump progress |
| 34 | `GET` | `/api/v1/learning/:courseId/progress`| Progress | Required | Enrolled Student | Course completion progress |
| 35 | `GET` | `/api/v1/assessments/:courseId/briefing`| Assessments| Required | Enrolled Student | Exam briefing & rules |
| 36 | `POST` | `/api/v1/assessments/:courseId/start` | Assessments| Required | Enrolled Student | Start 120-minute exam attempt |
| 37 | `POST` | `/api/v1/assessments/:attemptId/answer`| Assessments| Required | Exam Candidate | Save MCQ answer selection |
| 38 | `GET` | `/api/v1/assessments/:attemptId/review`| Assessments| Required | Exam Candidate | Review attempt questions status |
| 39 | `POST` | `/api/v1/assessments/:attemptId/submit`| Assessments| Required | Exam Candidate | Final submit & grade attempt |
| 40 | `GET` | `/api/v1/assessments/:attemptId/result`| Assessments| Required | Exam Candidate | View exam result & score |
| 41 | `GET` | `/api/v1/certificates/:certificateId` | Certificates| Required | Owner | Get certificate metadata |
| 42 | `GET` | `/api/v1/certificates/:certificateId/download`| Certificates| Required | Owner | Download certificate PDF URL |
| 43 | `GET` | `/api/v1/certificates/verify/:certificateNumber`| Certificates| Public | Public | Verify certificate authenticity |

---

## 38. Traceability Matrix

| API ID | Endpoint | PRD Requirement | DB Collection | Frontend Route / Feature | Module Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API-AUTH-001** | `POST /auth/register` | FR-AUTH-001 | `users`, `carts` | `/register` (`RegisterForm.tsx`) | Member 1 |
| **API-AUTH-002** | `POST /auth/login` | FR-AUTH-002 | `users` | `/login` (`LoginForm.tsx`) | Member 1 |
| **API-AUTH-003** | `POST /auth/logout` | FR-AUTH-003 | `users` | Global Header / Sidebar | Member 1 |
| **API-AUTH-004** | `GET /auth/me` | FR-AUTH-002 | `users` | App Hydration (`authSlice.ts`) | Member 1 |
| **API-AUTH-005** | `POST /auth/forgot-password` | FR-AUTH-004 | `users` | `/forgot-password` | Member 1 |
| **API-AUTH-006** | `POST /auth/reset-password` | FR-AUTH-004 | `users` | `/reset-password` | Member 1 |
| **API-AUTH-007** | `POST /auth/oauth/google` | FR-AUTH-005 | `users`, `carts` | `/login` (`GoogleOAuthButton.tsx`) | Member 1 |
| **API-USER-001** | `GET /users/profile` | FR-PROF-001 | `users` | `/profile` (`ProfileView.tsx`) | Member 1 |
| **API-USER-002** | `PUT /users/profile` | FR-PROF-002 | `users` | `/profile` (`EditProfileForm.tsx`) | Member 1 |
| **API-USER-003** | `PUT /users/password` | FR-PROF-003 | `users` | `/profile` (`ChangePasswordForm.tsx`) | Member 1 |
| **API-COURSE-001**| `GET /courses` | FR-DISC-001 | `courses` | `/courses` (`CourseCatalog.tsx`) | Member 2 |
| **API-COURSE-002**| `GET /courses/:slug` | FR-DISC-002 | `courses` | `/courses/[slug]` | Member 2 |
| **API-COURSE-003**| `GET /courses/:id/syllabus` | FR-DISC-002 | `courses` | `/courses/[slug]` (`SyllabusSection`) | Member 2 |
| **API-COURSE-004**| `GET /categories` | FR-DISC-001 | `courses` | `/`, `/courses` (`CategoryPills.tsx`) | Member 2 |
| **API-MISC-001** | `POST /contact` | FR-MISC-001 | `contact_inquiries` | `/contact` (`ContactForm.tsx`) | Member 2 |
| **API-CART-001** | `GET /cart` | FR-COMM-001 | `carts`, `courses` | Cart Drawer (`CartDrawer.tsx`) | Member 3 |
| **API-CART-002** | `POST /cart/items` | FR-COMM-001 | `carts`, `courses` | `/courses/[slug]` (`AddToCartButton`) | Member 3 |
| **API-CART-003** | `DELETE /cart/items/:id` | FR-COMM-001 | `carts` | Cart Drawer (`CartItemRow.tsx`) | Member 3 |
| **API-CART-004** | `DELETE /cart` | FR-COMM-001 | `carts` | Cart Drawer (`ClearCartButton.tsx`) | Member 3 |
| **API-CART-005** | `POST /cart/promo` | FR-COMM-001 | `carts` | Cart Drawer (`CouponInput.tsx`) | Member 3 |
| **API-ORDER-001** | `POST /orders/checkout` | FR-COMM-002 | `orders`, `carts` | `/checkout` (`CheckoutForm.tsx`) | Member 3 |
| **API-ORDER-002** | `GET /orders` | FR-COMM-003 | `orders` | `/orders` (`OrderHistoryPage.tsx`) | Member 3 |
| **API-ORDER-003** | `GET /orders/:orderId` | FR-COMM-003 | `orders` | `/orders` (`OrderReceiptModal.tsx`) | Member 3 |
| **API-PAY-001** | `POST /payments/create` | FR-PAY-001 | `payments`, `orders` | `/checkout` (`PaymentStep.tsx`) | Member 3 |
| **API-PAY-002** | `POST /payments/:id/verify` | FR-PAY-002 | `payments`, `orders` | `/order/pending` (`ProofUpload.tsx`) | Member 3 |
| **API-PAY-003** | `GET /payments/:id` | FR-PAY-002 | `payments` | `/order/pending` (`StatusPolling.tsx`) | Member 3 |
| **API-PAY-004** | `POST /payments/webhook` | FR-PAY-003 | `payments`, `orders` | Gateway Background Webhook | Member 3 |
| **API-PAY-005** | `PATCH /payments/:id/approve`| FR-PAY-002 | `payments`, `orders` | Back-Office Admin Audit | Member 3 |
| **API-ENROLL-001**| `GET /student/enrollments` | FR-LRN-001 | `enrollments` | `/my-courses` (`MyCoursesPage.tsx`) | Member 4 |
| **API-ENROLL-002**| `GET /student/dashboard-summary`| FR-LRN-002 | `enrollments` | `/dashboard` (`StudentDashboard.tsx`) | Member 4 |
| **API-LEARN-001** | `GET /learning/:id/overview`| FR-LRN-003 | `enrollments` | `/learn/[courseId]` | Member 4 |
| **API-LEARN-002** | `GET /learning/:id/lessons/:id`| FR-LRN-004 | `courses` | `/lesson/[lessonId]` (`Player.tsx`) | Member 4 |
| **API-PROG-001** | `POST /learning/:id/lessons/:id/complete`| FR-LRN-005 | `enrollments` | `/lesson/[lessonId]` (`CompleteBtn`) | Member 4 |
| **API-PROG-002** | `GET /learning/:id/progress`| FR-LRN-005 | `enrollments` | `/learn/[courseId]` (`Sidebar.tsx`) | Member 4 |
| **API-ASSESS-001**| `GET /assessments/:id/briefing`| FR-ASS-001 | `assessments` | `/learn/[courseId]/assessment` | Member 5 |
| **API-ASSESS-002**| `POST /assessments/:id/start`| FR-ASS-002 | `assessments` | `/learn/[courseId]/assessment/exam`| Member 5 |
| **API-ASSESS-003**| `POST /assessments/:id/answer`| FR-ASS-002 | `attempts` | `/learn/[courseId]/assessment/exam`| Member 5 |
| **API-ASSESS-004**| `GET /assessments/:id/review`| FR-ASS-003 | `attempts` | `/learn/[courseId]/assessment/review`| Member 5 |
| **API-ASSESS-005**| `POST /assessments/:id/submit`| FR-ASS-004 | `attempts` | `/learn/[courseId]/assessment/submit`| Member 5 |
| **API-ASSESS-006**| `GET /assessments/:id/result`| FR-ASS-004 | `attempts` | `/learn/[courseId]/assessment/result`| Member 5 |
| **API-CERT-001** | `GET /certificates/:id` | FR-CERT-001 | `certificates` | `/certificate/[certId]` | Member 5 |
| **API-CERT-002** | `GET /certificates/:id/download`| FR-CERT-001 | `certificates` | `/certificate/[certId]` (`Download`) | Member 5 |
| **API-CERT-003** | `GET /certificates/verify/:num`| FR-CERT-002 | `certificates` | `/verify` (`PublicVerifyPage.tsx`) | Member 5 |

---

## 39. Open Questions & Assumptions

### 39.1 Confirmed Specifications
1. Express.js REST API with `/api/v1` prefix.
2. Standard response envelope: `{ success, message, data, meta }`.
3. Stateless JWT authentication over secure `HttpOnly` cookies.
4. Server-authoritative assessment timer (120 minutes) and 70% passing grade.
5. Server-side order calculation; client prices are completely untrusted.
6. Public certificate verification by unique certificate code (`MSN-YYYY-XXXXX`).

### 39.2 Strongly Implied Technical Inferences
1. Video streaming URLs use presigned tokens with a 2-hour expiration window.
2. An empty cart is auto-initialized on student registration.
3. Assessment questions are randomized on attempt initialization.

### 39.3 Assumptions
1. Currency is strictly Pakistani Rupee (`PKR`) across all course prices.
2. Students are permitted unlimited assessment retakes upon failure.
3. Admin audit approval for manual bank transfer automatically creates active student enrollments.

### 39.4 Items To Be Confirmed
1. **Automated Payment Gateway Provider:** **To Be Confirmed** (Safepay, Kuickpay, or PayFast).
2. **Video Hosting Infrastructure:** **To Be Confirmed** (Cloudflare Stream vs Vimeo OTT vs AWS S3/CloudFront).
3. **Transactional Email Service:** **To Be Confirmed** (AWS SES, SendGrid, or Postmark).

---

## 40. Final API Architecture Summary

```text
MSN Academy API (/api/v1)
│
├── Auth (Register, Login, Logout, Me, Forgot/Reset Password, Google OAuth)
├── Users (Profile View, Profile Update, Password Change)
├── Courses (Catalog Listing, Slugs, Syllabus, Categories)
├── Contact (Public Inquiry Submission)
├── Cart (View Cart, Add Item, Remove Item, Clear Cart, Apply Promo)
├── Orders (Checkout, Order History, Receipt Details)
├── Payments (Initialize, Proof Submission, Status, Webhook, Admin Approval)
├── Enrollments (Student Courses, Dashboard Statistics)
├── Learning (Course Overview, Lesson Content Streaming)
├── Progress (Complete Lesson, Progress Synchronization)
├── Assessments (Briefing, Start Exam, Save Answer, Review, Submit, Result)
└── Certificates (Student View, PDF Download, Public Verification)
```

### Metrics & Distribution:
* **Total API Endpoints:** 43
* **Public Endpoints:** 12
* **Authenticated Endpoints:** 30
* **Role-Protected Endpoints (`ADMIN`):** 1
* **Critical Integrity APIs:**
  * `POST /orders/checkout` (Server-side price enforcement)
  * `POST /payments/:id/verify` and `PATCH /payments/:id/approve` (Financial settlement)
  * `POST /assessments/:id/submit` (Server-side grading & tamper-proof certification)
* **External Integrations:**
  * Google OAuth2 API
  * S3-compatible Object Storage (PDFs & Media)
  * Digital Payment Gateways (Webhook receiver)

---
*End of API Specification Document — Baseline v1.0.0*
