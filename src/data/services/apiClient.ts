import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/src/core/constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: unwrap data, normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        return Promise.reject(new Error('Not found'));
      }
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timed out'));
      }
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        'Network error';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
