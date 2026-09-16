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
    CHANGE_PASSWORD: '/users/change-password',
  },
  COURSES: {
    LIST: '/courses',
    DETAILS: (slug) => `/courses/${slug}`,
    CATEGORIES: '/categories',
    SYLLABUS: (courseId) => `/courses/${courseId}/syllabus`,
  },
  CONTACT: '/contact',
  CART: {
    BASE: '/cart',
    ITEM: (courseId) => `/cart/${courseId}`,
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: (id) => `/orders/${id}`,
  },
  PAYMENTS: {
    CHECKOUT: '/payments/checkout',
    STATUS: (orderId) => `/payments/${orderId}/status`,
  },
  ENROLLMENTS: {
    LIST: '/student/enrollments',
  },
  LEARNING: {
    COURSE: (courseId) => `/learning/${courseId}`,
    LESSON_COMPLETE: (lessonId) => `/learning/lesson/${lessonId}/complete`,
  },
  ASSESSMENTS: {
    START: (courseId) => `/assessments/${courseId}/start`,
    SUBMIT: (attemptId) => `/assessments/${attemptId}/submit`,
  },
  CERTIFICATES: {
    MINE: '/certificates',
    VERIFY: (certId) => `/certificates/verify/${certId}`,
  },
};
