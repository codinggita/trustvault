import { create } from 'zustand';
import api from '../utils/api';
import { AxiosError } from 'axios';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store token in localStorage for API interceptor
      localStorage.setItem('access_token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', { email, password, name });
      const { user, token } = response.data;
      
      // Store token in localStorage for API interceptor
      localStorage.setItem('access_token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));