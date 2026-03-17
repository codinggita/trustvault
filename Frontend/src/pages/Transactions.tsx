import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Transaction } from '../types/app';
import api, { getApiErrorMessage } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Transaction[]>('/transactions');
      setTransactions(response.data);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Failed to fetch transactions.',
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Activity log
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-50">
            Transaction history
          </h2>
        </div>
        <Button variant="outline" onClick={() => void fetchTransactions()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} loading={loading && transactions.length === 0}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl ${
                    transaction.type === 'credit'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-amber-500/15 text-amber-200'
                  }`}
                >
                  {transaction.type === 'credit' ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-50">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-slate-400">
                    {transaction.accountName}
                    {transaction.relatedAccountName
                      ? ` • ${transaction.relatedAccountName}`
                      : ''}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {transaction.status}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p
                  className={`text-xl font-semibold ${
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
          </Card>
        ))}
      </div>

      {!loading && transactions.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">No transactions found yet.</p>
        </Card>
      ) : null}
    </div>
  );
};
