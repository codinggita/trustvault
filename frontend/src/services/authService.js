import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add JWT token
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

// Response interceptor for handling errors (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Optionally, you can redirect to login or logout here
      // For now, we'll just reject the promise
      localStorage.removeItem('token');
      // You might want to dispatch a logout action or redirect
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Function to set auth token (used in auth slice)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;