import { motion } from 'framer-motion';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useAccountStore } from '../stores/accountStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

const maskAccount = (accountNumber = '') =>
  accountNumber ? `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}` : 'No account';

export default function AccountsPage() {
  const user = useAuthStore((state) => state.user);
  const accounts = useAccountStore((state) => state.accounts);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const setSelectedAccount = useAccountStore((state) => state.setSelectedAccount);
  const updateStatus = useAccountStore((state) => state.updateStatus);

  useEffect(() => {
    const load = async () => {
      const response = await fetchAccounts();
      const firstAccount = response.data[0];
      if (firstAccount) {
        await fetchAccount(firstAccount._id);
      }
    };

    load().catch(() => null);
  }, [fetchAccounts, fetchAccount]);

  const handleSelect = async (account) => {
    setSelectedAccount(account);
    await fetchAccount(account._id);
  };

  const handleStatusUpdate = async (nextStatus) => {
    if (!selectedAccount) {
      return;
    }

    try {
      await updateStatus(selectedAccount._id, nextStatus);
      await fetchAccount(selectedAccount._id);
      toast.success(`Account status changed to ${nextStatus}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update account status.');
    }
  };

  if (!accounts.length) {
    return (
      <EmptyState
        title="No accounts found"
        description="Once your banking profile is loaded, your account cards and transaction drill-down will show up here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Accounts</p>
        <h2 className="mt-3 text-5xl">Your vault lineup</h2>
      </div>

      <section className="grid gap-5 xl:grid-cols-3">
        {accounts.map((account, index) => (
          <motion.button
            key={account._id}
            className={`glass-panel p-6 text-left transition ${selectedAccount?._id === account._id ? 'border-vault-gold/40 bg-white/8' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            type="button"
            onClick={() => handleSelect(account)}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-vault-muted">{account.currency} account</p>
              <StatusBadge value={account.status} />
            </div>
            <h3 className="mt-5 text-3xl">{maskAccount(account.accountNumber)}</h3>
            <p className="mt-6 text-3xl font-semibold text-gradient">{formatCurrency(account.balance)}</p>
          </motion.button>
        ))}
      </section>

      {selectedAccount ? (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="p-7">
            <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Account Details</p>
            <div className="mt-6 space-y-4 text-sm text-vault-muted">
              <div>
                <p>Account number</p>
                <p className="mt-2 text-lg text-vault-text">{selectedAccount.accountNumber}</p>
              </div>
              <div>
                <p>Balance</p>
                <p className="mt-2 text-4xl font-semibold text-gradient">{formatCurrency(selectedAccount.balance)}</p>
              </div>
              <div>
                <p>Status</p>
                <div className="mt-2">
                  <StatusBadge value={selectedAccount.status} />
                </div>
              </div>
              <div>
                <p>Created</p>
                <p className="mt-2 text-vault-text">{formatDateTime(selectedAccount.createdAt)}</p>
              </div>
            </div>

            {user?.isSystemUser ? (
              <div className="mt-8 space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-vault-muted">Status Controls</p>
                <div className="flex flex-wrap gap-3">
                  {['ACTIVE', 'FROZEN', 'CLOSED'].map((status) => (
                    <button
                      key={status}
                      className="btn-secondary"
                      type="button"
                      onClick={() => handleStatusUpdate(status)}
                    >
                      Set {status}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-8 text-sm leading-7 text-vault-muted">
                Status changes are restricted to system users, so this view stays read-only for client accounts.
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-7">
            <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Recent Transactions</p>
            <div className="mt-6 space-y-4">
              {selectedAccount.recentTransactions?.length ? (
                selectedAccount.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{transaction.description || 'TrustVault transfer'}</p>
                        <p className="mt-1 text-xs text-vault-muted">{formatDateTime(transaction.createdAt)}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-vault-muted">
                          {transaction.referenceId}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge value={transaction.type} />
                        <p className="mt-3 text-lg font-semibold">{formatCurrency(transaction.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No history yet"
                  description="Transfers involving this account will appear here as soon as they are posted."
                />
              )}
            </div>
          </GlassCard>
        </section>
      ) : null}
    </div>
  );
}
