import { ArrowLeftRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import type { Account } from '../types/app';
import api, { getApiErrorMessage } from '../utils/api';
import { formatCurrency } from '../utils/formatters';

export const Transfers = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Account[]>('/accounts');
      setAccounts(response.data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to load your accounts.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const selectedFromAccount = useMemo(
    () => accounts.find((account) => account.id === transferData.fromAccount) ?? null,
    [accounts, transferData.fromAccount],
  );
  const selectedToAccount = useMemo(
    () => accounts.find((account) => account.id === transferData.toAccount) ?? null,
    [accounts, transferData.toAccount],
  );
  const destinationOptions = useMemo(
    () => accounts.filter((account) => account.id !== transferData.fromAccount),
    [accounts, transferData.fromAccount],
  );

  const openReviewModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (
      !transferData.fromAccount ||
      !transferData.toAccount ||
      !Number(transferData.amount)
    ) {
      const message = 'Please complete the transfer form before continuing.';
      setError(message);
      toast.error(message);
      return;
    }

    setShowReviewModal(true);
  };

  const handleConfirmTransfer = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/transactions/transfer', {
        fromAccount: transferData.fromAccount,
        toAccount: transferData.toAccount,
        amount: Number(transferData.amount),
        description: transferData.description,
      });

      toast.success('Transfer completed successfully.');
      setShowReviewModal(false);
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
      });
      await fetchAccounts();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Transfer failed. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && accounts.length < 2) {
    return (
      <Card>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Transfers
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          You need at least two accounts
        </h2>
        <p className="text-sm text-slate-400">
          Create another account first, then come back here to move funds.
        </p>
        <div>
          <Link
            className="inline-flex rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
            to="/accounts"
          >
            Go to accounts
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Money movement
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-50">
          Transfer funds between accounts
        </h2>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card
          loading={loading}
          header={
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                New transfer
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-50">
                Review before you send
              </h3>
            </div>
          }
        >
          <form onSubmit={openReviewModal} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  From account
                </label>
                <select
                  value={transferData.fromAccount}
                  onChange={(event) =>
                    setTransferData((previous) => ({
                      ...previous,
                      fromAccount: event.target.value,
                      toAccount:
                        previous.toAccount === event.target.value
                          ? ''
                          : previous.toAccount,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} • {formatCurrency(account.balance, account.currency)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  To account
                </label>
                <select
                  value={transferData.toAccount}
                  onChange={(event) =>
                    setTransferData((previous) => ({
                      ...previous,
                      toAccount: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                >
                  <option value="">Select an account</option>
                  {destinationOptions.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} • {formatCurrency(account.balance, account.currency)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                min="0.01"
                step="0.01"
                value={transferData.amount}
                onChange={(value) =>
                  setTransferData((previous) => ({
                    ...previous,
                    amount: value,
                  }))
                }
                placeholder="0.00"
                required
              />
              <Input
                label="Description"
                value={transferData.description}
                onChange={(value) =>
                  setTransferData((previous) => ({
                    ...previous,
                    description: value,
                  }))
                }
                placeholder="Optional note"
              />
            </div>

            <Button type="submit" block>
              <ArrowLeftRight className="h-4 w-4" />
              Review transfer
            </Button>
          </form>
        </Card>

        <Card
          loading={loading}
          header={
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Available balances
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-50">
                Account overview
              </h3>
            </div>
          }
        >
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4"
            >
              <p className="font-medium text-slate-100">{account.name}</p>
              <p className="text-sm capitalize text-slate-400">{account.type}</p>
              <p className="mt-3 text-xl font-semibold text-slate-50">
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>
          ))}
        </Card>
      </div>

      <Modal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        className="max-w-lg"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Review transfer
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-50">
              Confirm details
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">From</span>
                <span className="font-medium text-slate-100">
                  {selectedFromAccount?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">To</span>
                <span className="font-medium text-slate-100">
                  {selectedToAccount?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Amount</span>
                <span className="font-medium text-slate-100">
                  {formatCurrency(Number(transferData.amount || 0))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Description</span>
                <span className="max-w-[16rem] text-right text-slate-100">
                  {transferData.description || 'No description'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowReviewModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button loading={submitting} onClick={() => void handleConfirmTransfer()}>
              Confirm transfer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
