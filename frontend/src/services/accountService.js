import axios from 'axios';

// Create axios instance for account service
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add JWT token (same as in authService)
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

export const getAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data;
};

export const getAccountBalance = async (accountId) => {
  const response = await api.get(`/accounts/${accountId}/balance`);
  return response.data;
};

export const getTransactions = async (accountId, limit = 5) => {
  const response = await api.get(`/transactions`, {
    params: { accountId, limit }
  });
  return response.data;
};

export default api;