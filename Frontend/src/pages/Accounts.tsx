import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import type { Account } from '../types/app';
import api, { getApiErrorMessage } from '../utils/api';
import { formatCurrency } from '../utils/formatters';

export const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createAccountData, setCreateAccountData] = useState({
    name: '',
    type: 'checking' as Account['type'],
    initialDeposit: '',
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Account[]>('/accounts');
      setAccounts(response.data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to fetch accounts.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    if (!normalizedQuery) {
      return accounts;
    }

    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(normalizedQuery) ||
        account.type.toLowerCase().includes(normalizedQuery),
    );
  }, [accounts, search]);

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/accounts', {
        name: createAccountData.name,
        type: createAccountData.type,
        initialDeposit: Number(createAccountData.initialDeposit || 0),
      });

      toast.success('Account created successfully.');
      setShowCreateModal(false);
      setCreateAccountData({
        name: '',
        type: 'checking',
        initialDeposit: '',
      });
      await fetchAccounts();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to create the account.');
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Account center
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-50">
            Manage your accounts
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search accounts"
            value={search}
            onChange={setSearch}
            className="sm:w-72"
          />
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            New account
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredAccounts.map((account) => (
          <Card key={account.id} loading={loading && accounts.length === 0}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-50">{account.name}</p>
                <p className="text-sm capitalize text-slate-400">
                  {account.type} account
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-semibold text-slate-50">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
                  {account.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!loading && filteredAccounts.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            No accounts match your search yet.
          </p>
        </Card>
      ) : null}

      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        className="max-w-lg"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              New account
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-50">
              Create an account
            </h3>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <Input
              label="Account name"
              placeholder="Family checking"
              value={createAccountData.name}
              onChange={(value) =>
                setCreateAccountData((previous) => ({
                  ...previous,
                  name: value,
                }))
              }
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Account type
              </label>
              <select
                value={createAccountData.type}
                onChange={(event) =>
                  setCreateAccountData((previous) => ({
                    ...previous,
                    type: event.target.value as Account['type'],
                  }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <Input
              label="Initial deposit"
              type="number"
              min="0"
              step="0.01"
              value={createAccountData.initialDeposit}
              onChange={(value) =>
                setCreateAccountData((previous) => ({
                  ...previous,
                  initialDeposit: value,
                }))
              }
              placeholder="0.00"
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Create account
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
