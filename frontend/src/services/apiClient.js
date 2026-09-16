import axios from 'axios';

// Global Axios instance — see docs/03-Frontend-Architecture.md, section 8
// Auth uses secure HttpOnly cookies, so withCredentials must stay true.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-Client-Timestamp'] = new Date().toISOString();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    // Forward the structured errors array (used for per-field validation display)
    const errors = error.response?.data?.errors || [];

    // 401 handling (redirect to login etc.) belongs to authSlice/AuthLayout once M1 builds it.
    return Promise.reject({ status, message, errors, raw: error });
  }
);

export default apiClient;
