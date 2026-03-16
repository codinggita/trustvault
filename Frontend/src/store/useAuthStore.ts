import { create } from 'zustand';

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
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/login', { email, password });
      // const { user, token } = response.data;
      
      // Mock response for now
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user'
      };
      const mockToken = 'mock-jwt-token';
      
      set({ 
        user: mockUser, 
        token: mockToken, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/register', { email, password, name });
      // const { user, token } = response.data;
      
      // Mock response for now
      const mockUser = {
        id: '1',
        email,
        name,
        role: 'user'
      };
      const mockToken = 'mock-jwt-token';
      
      set({ 
        user: mockUser, 
        token: mockToken, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));