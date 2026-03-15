import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '@/lib/auth-client';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we've already handled a 401 to prevent multiple clears
let handled401 = false;

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses - only clear token, NO redirects here
// Redirects are handled by individual components/pages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !handled401) {
        handled401 = true;
        console.log('[API] 401 error - clearing token');
        removeToken();
        
        // Reset the flag after a short delay to allow for re-login
        setTimeout(() => {
          handled401 = false;
        }, 2000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
