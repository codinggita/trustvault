import { create } from 'zustand';

import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  register: async (payload) => {
    const response = await authService.register(payload);
    set({
      user: response.data.user,
      isAuthenticated: true,
      isBootstrapping: false,
    });
    return response;
  },
  login: async (payload) => {
    const response = await authService.login(payload);
    set({
      user: response.data.user,
      isAuthenticated: true,
      isBootstrapping: false,
    });
    return response;
  },
  fetchMe: async () => {
    set({ isBootstrapping: true });
    try {
      const response = await authService.me();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isBootstrapping: false,
      });
      return response;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
    }
  },
  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isBootstrapping: false,
    }),
}));

