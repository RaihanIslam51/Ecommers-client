import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    // You can add auth token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - Server took too long to respond');
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🔴 Network Error - Server might be offline. Please ensure the server is running on http://localhost:5000');
      console.error('💡 Tip: Run "cd server && npm run dev" in a terminal');
    } else if (error.response?.status === 401) {
      console.error('🔒 Unauthorized access');
    } else if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server error:', error.response?.data?.message || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
