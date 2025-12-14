import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { Store } from 'vuex';
import type { RootState } from '../types/store';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const setupAxiosInterceptor = (store: Store<RootState>): void => {
  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await store.dispatch('refreshAccessToken');
          originalRequest.headers.Authorization = `Bearer ${store.state.token}`;
          return axios(originalRequest);
        } catch (refreshError) {
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
