// NEW: Centralized Axios instance with auth & error handling
import axios from 'axios';
import { toast } from 'react-hot-toast'; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Access denied.');
      window.location.href = '/access-denied';
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
    return Promise.reject(error);
  }
);

export default api;