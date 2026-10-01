import axios from 'axios';

// Global Axios instance — see docs/03-Frontend-Architecture.md, section 8
// Auth uses secure HttpOnly cookies, so withCredentials must stay true.
const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (url.startsWith('http') && !url.includes('/api/v1')) {
    url += '/api/v1';
  }
  return url;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Persistent guest session identifier for cart and discovery
export function getGuestSessionId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'guest_' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('guest_session_id', id);
  }
  return id;
}

apiClient.interceptors.request.use((config) => {
  config.headers['X-Client-Timestamp'] = new Date().toISOString();
  const guestSessionId = getGuestSessionId();
  if (guestSessionId) {
    config.headers['x-guest-session-id'] = guestSessionId;
  }
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const errors = error.response?.data?.errors || [];

    // Check if 401 Unauthorized
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Don't retry refresh or login endpoints
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
        return Promise.reject({ status, message, errors, raw: error });
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${getBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.data?.accessToken;

        if (newAccessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newAccessToken);
          }
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token returned from refresh');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          const currentPath = window.location.pathname;
          // If on a protected route (admin, student portal, checkout), redirect directly to login
          if (
            currentPath.startsWith('/admin') ||
            currentPath.startsWith('/student') ||
            currentPath.startsWith('/checkout')
          ) {
            window.location.href = `/login?redirect=${encodeURIComponent(
              currentPath + window.location.search
            )}`;
          }
        }
        return Promise.reject({ status: 401, message: 'Session expired. Please sign in again.', errors: [], raw: refreshErr });
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/student') ||
        currentPath.startsWith('/checkout')
      ) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          currentPath + window.location.search
        )}`;
      }
    }

    return Promise.reject({ status, message, errors, raw: error });
  }
);

export default apiClient;

