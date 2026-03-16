import axios from 'axios';
import toast from 'react-hot-toast';

import { useUiStore } from '../stores/uiStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

let pendingRequests = 0;

const syncPendingRequests = () => {
  useUiStore.getState().setPendingRequests(pendingRequests);
};

api.interceptors.request.use(
  (config) => {
    pendingRequests += 1;
    syncPendingRequests();
    return config;
  },
  (error) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    syncPendingRequests();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    syncPendingRequests();
    return response;
  },
  (error) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    syncPendingRequests();

    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('trustvault:unauthorized'));
    }

    if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment and try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
