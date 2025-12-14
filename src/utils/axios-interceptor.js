import axios from 'axios';
import store from '../store';

/**
 * Setup axios interceptor to handle token refresh automatically
 * When a request fails with 401 (Unauthorized), it will attempt to refresh the token
 * and retry the original request
 */
export const setupAxiosInterceptor = () => {
  // Response interceptor to catch 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the token
          await store.dispatch('refreshAccessToken');

          // Update the authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${store.state.token}`;

          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          console.error('Token refresh failed, redirecting to login');
          store.dispatch('logout');
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
