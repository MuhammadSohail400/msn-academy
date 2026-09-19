// Centralized API route constants — see docs/05-API-Specification.md
// Base URL is applied by apiClient.js, so paths here are relative (start after /api/v1).

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    PASSWORD: '/users/password',
    CHANGE_PASSWORD: '/users/password',
  },
  COURSES: {
    LIST: '/courses',
    DETAILS: (slug) => `/courses/${slug}`,
    CATEGORIES: '/categories',
  },
  CONTACT: '/contact',
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    ITEM: (courseId) => `/cart/items/${courseId}`,
    PROMO: '/cart/promo',
  },
  ORDERS: {
    LIST: '/orders',
    CHECKOUT: '/orders/checkout',
    DETAILS: (id) => `/orders/${id}`,
  },
  PAYMENTS: {
    CREATE: '/payments/create',
    VERIFY: (paymentId) => `/payments/${paymentId}/verify`,
    STATUS: (paymentId) => `/payments/${paymentId}`,
  },
  ENROLLMENTS: {
    LIST: '/student/enrollments',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard-summary',
  },
  LEARNING: {
    OVERVIEW: (courseId) => `/learning/${courseId}/overview`,
    LESSON: (courseId, lessonId) => `/learning/${courseId}/lessons/${lessonId}`,
    COMPLETE: (courseId, lessonId) => `/learning/${courseId}/lessons/${lessonId}/complete`,
    PROGRESS: (courseId) => `/learning/${courseId}/progress`,
  },
  ASSESSMENTS: {
    BRIEFING: (courseId) => `/assessments/${courseId}/briefing`,
    START: (courseId) => `/assessments/${courseId}/start`,
    ANSWER: (attemptId) => `/assessments/${attemptId}/answer`,
    REVIEW: (attemptId) => `/assessments/${attemptId}/review`,
    SUBMIT: (attemptId) => `/assessments/${attemptId}/submit`,
    RESULT: (attemptId) => `/assessments/${attemptId}/result`,
  },
  CERTIFICATES: {
    LIST: '/certificates',
    DETAILS: (certId) => `/certificates/${certId}`,
    VERIFY: (certId) => `/certificates/verify/${certId}`,
  },
};
