import { ArrowLeftRight, Landmark, ReceiptText } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Account, Transaction } from '../types/app';
import api, { getApiErrorMessage } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [accountsResponse, transactionsResponse] = await Promise.all([
        api.get<Account[]>('/accounts'),
        api.get<Transaction[]>('/transactions'),
      ]);

      setAccounts(accountsResponse.data);
      setTransactions(transactionsResponse.data.slice(0, 5));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Unable to load the dashboard right now.',
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <Card
          loading={loading}
          header={
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">
                {formatCurrency(totalBalance)}
              </h2>
            </div>
          }
        >
          <p className="text-sm text-slate-400">
            {accounts.length} active account{accounts.length === 1 ? '' : 's'} connected.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={() => navigate('/accounts')}>
              <Landmark className="h-4 w-4" />
              Accounts
            </Button>
            <Button variant="outline" onClick={() => navigate('/transactions')}>
              <ReceiptText className="h-4 w-4" />
              Activity
            </Button>
            <Button variant="secondary" onClick={() => navigate('/transfers')}>
              <ArrowLeftRight className="h-4 w-4" />
              Transfer
            </Button>
          </div>
        </Card>

        <Card
          loading={loading}
          header={
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Accounts
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-50">
                Snapshot
              </h3>
            </div>
          }
        >
          {accounts.length === 0 && !loading ? (
            <p className="text-sm text-slate-400">Create an account to get started.</p>
          ) : (
            accounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-100">{account.name}</p>
                  <p className="text-sm capitalize text-slate-400">{account.type}</p>
                </div>
                <p className="font-semibold text-slate-50">
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
            ))
          )}
        </Card>
      </div>

      <Card
        loading={loading}
        header={
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Latest activity
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-50">
              Recent transactions
            </h3>
          </div>
        }
      >
        {error ? (
          <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {!loading && transactions.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions recorded yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {transaction.description}
                </p>
                <p className="text-sm text-slate-400">
                  {transaction.accountName}
                  {transaction.relatedAccountName
                    ? ` • ${transaction.relatedAccountName}`
                    : ''}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === 'credit'
                      ? 'text-emerald-300'
                      : 'text-amber-200'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
