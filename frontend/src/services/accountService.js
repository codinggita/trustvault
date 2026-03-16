import api from './api';

export const accountService = {
  getAccounts: async () => (await api.get('/accounts')).data,
  getAccount: async (accountId) => (await api.get(`/accounts/${accountId}`)).data,
  updateStatus: async (accountId, status) => (await api.patch(`/accounts/${accountId}/status`, { status })).data,
};

