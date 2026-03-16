import { create } from 'zustand';

export const useUiStore = create((set) => ({
  pendingRequests: 0,
  setPendingRequests: (pendingRequests) => set({ pendingRequests: Math.max(0, pendingRequests) }),
}));

