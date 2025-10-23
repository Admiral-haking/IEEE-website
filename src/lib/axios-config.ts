import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Create axios instance with proper error handling
const axiosInstance = axios.create({
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with proper error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      // Request was cancelled - this is normal behavior, don't show error
      console.log('Request was cancelled:', error.config?.url);
      return Promise.reject(new Error('Request cancelled'));
    }
    
    if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request timeout:', error.config?.url);
      return Promise.reject(new Error('Request timeout'));
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.error || error.message;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      }
      
      return Promise.reject(new Error(message || `Server error: ${status}`));
    }
    
    if (error.request) {
      // Network error
      console.error('Network error:', error.config?.url);
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Other errors
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

export default axiosInstance;
