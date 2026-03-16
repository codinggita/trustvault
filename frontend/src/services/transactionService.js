import api from './api';

export const transactionService = {
  transfer: async (payload) => (await api.post('/transactions/transfer', payload)).data,
  getTransactions: async (params) => (await api.get('/transactions', { params })).data,
  getTransaction: async (transactionId) => (await api.get(`/transactions/${transactionId}`)).data,
};

