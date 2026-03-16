import { create } from 'zustand';
import type { AuthUser } from '../types/app';
import api from '../utils/api';

const AUTH_STORAGE_KEY = 'trustvault.auth';

type StoredAuthState = {
  token: string | null;
  user: AuthUser | null;
};

function readStoredAuth(): StoredAuthState {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return { token: null, user: null };
    }

    const parsedValue = JSON.parse(rawValue) as StoredAuthState;

    return {
      token: parsedValue.token ?? null,
      user: parsedValue.user ?? null,
    };
  } catch {
    return { token: null, user: null };
  }
}

function persistAuth(authState: StoredAuthState) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

function clearStoredAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const initialAuthState = readStoredAuth();

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

function setAuthenticatedState(
  set: (state: Partial<AuthState>) => void,
  authState: StoredAuthState,
) {
  persistAuth(authState);
  set({
    user: authState.user,
    token: authState.token,
    isAuthenticated: Boolean(authState.token && authState.user),
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialAuthState.user,
  token: initialAuthState.token,
  isAuthenticated: Boolean(initialAuthState.token && initialAuthState.user),
  isLoading: false,
  isInitializing: Boolean(initialAuthState.token),

  initializeAuth: async () => {
    const token = get().token;

    if (!token) {
      clearStoredAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
      });
      return;
    }

    set({ isInitializing: true });

    try {
      const response = await api.get<{ user: AuthUser }>('/auth/me');

      setAuthenticatedState(set, {
        token,
        user: response.data.user,
      });

      set({ isInitializing: false });
    } catch {
      clearStoredAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await api.post<{ user: AuthUser; token: string }>(
        '/auth/login',
        { email, password },
      );

      setAuthenticatedState(set, {
        user: response.data.user,
        token: response.data.token,
      });
    } finally {
      set({ isLoading: false, isInitializing: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });

    try {
      const response = await api.post<{ user: AuthUser; token: string }>(
        '/auth/register',
        { email, password, name },
      );

      setAuthenticatedState(set, {
        user: response.data.user,
        token: response.data.token,
      });
    } finally {
      set({ isLoading: false, isInitializing: false });
    }
  },

  logout: async () => {
    try {
      if (get().token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Intentionally ignore logout request failures and clear local state.
    } finally {
      clearStoredAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
      });
    }
  },
}));
