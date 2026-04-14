import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/src/core/constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Request logger
apiClient.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase() ?? 'GET';
  console.log(`[API] --> ${method} ${config.baseURL ?? ''}${config.url ?? ''}`);
  return config;
});

// Response interceptor: log + unwrap data, normalize errors
apiClient.interceptors.response.use(
  (response) => {
    const { config, status } = response;
    const method = config.method?.toUpperCase() ?? 'GET';
    console.log(`[API] <-- ${status} ${method} ${config.url ?? ''}`);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const method = error.config?.method?.toUpperCase() ?? 'GET';
      const url = error.config?.url ?? '';
      console.warn(`[API] ERR ${method} ${url} — ${status ?? error.code ?? error.message}`);
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
