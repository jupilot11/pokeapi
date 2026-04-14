import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/src/core/constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Request logger (dev only)
apiClient.interceptors.request.use((config) => {
  if (__DEV__) {
    const method = config.method?.toUpperCase() ?? 'GET';
    console.log(`[API] --> ${method} ${config.baseURL ?? ''}${config.url ?? ''}`);
  }
  return config;
});

// Response interceptor: log + normalize errors
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      const { config, status } = response;
      const method = config.method?.toUpperCase() ?? 'GET';
      console.log(`[API] <-- ${status} ${method} ${config.url ?? ''}`);
    }
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const method = error.config?.method?.toUpperCase() ?? 'GET';
      const url = error.config?.url ?? '';
      if (__DEV__) console.warn(`[API] ERR ${method} ${url} — ${status ?? error.code ?? error.message}`);
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
