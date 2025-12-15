import axios from 'axios';

// Backend URL configuration - change this to your backend URL
export const BASE_URL = 'https://saveme-backend2.onrender.com';
export const API_URL = `${BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired - let components handle the redirect
      localStorage.removeItem('token');
      // Don't redirect here, let the component handle it
    }
    return Promise.reject(error);
  }
);

// Export axios instance (URLs are already exported above)
export default api;

