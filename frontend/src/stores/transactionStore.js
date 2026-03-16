import { create } from 'zustand';

import { transactionService } from '../services/transactionService';

export const useTransactionStore = create((set) => ({
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  activeTransaction: null,
  fetchTransactions: async (params = {}) => {
    const response = await transactionService.getTransactions(params);
    set({
      transactions: response.data.items,
      pagination: response.data.pagination,
    });
    return response;
  },
  fetchTransaction: async (transactionId) => {
    const response = await transactionService.getTransaction(transactionId);
    set({ activeTransaction: response.data });
    return response;
  },
  transfer: async (payload) => transactionService.transfer(payload),
  clear: () =>
    set({
      transactions: [],
      activeTransaction: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
}));

