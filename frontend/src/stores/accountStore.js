import { create } from 'zustand';

import { accountService } from '../services/accountService';

export const useAccountStore = create((set, get) => ({
  accounts: [],
  selectedAccount: null,
  hydrateAccounts: (accounts) =>
    set({
      accounts,
      selectedAccount: accounts[0] || null,
    }),
  fetchAccounts: async () => {
    const response = await accountService.getAccounts();
    const currentSelected = get().selectedAccount;
    const nextSelected =
      response.data.find((account) => account._id === currentSelected?._id) || response.data[0] || null;

    set({
      accounts: response.data,
      selectedAccount: nextSelected,
    });

    return response;
  },
  fetchAccount: async (accountId) => {
    const response = await accountService.getAccount(accountId);
    set({ selectedAccount: response.data });
    return response;
  },
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  updateStatus: async (accountId, status) => {
    const response = await accountService.updateStatus(accountId, status);
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account._id === accountId ? { ...account, ...response.data } : account
      ),
      selectedAccount:
        state.selectedAccount?._id === accountId
          ? { ...state.selectedAccount, ...response.data }
          : state.selectedAccount,
    }));
    return response;
  },
  clear: () =>
    set({
      accounts: [],
      selectedAccount: null,
    }),
}));

