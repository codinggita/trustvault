import { AnimatePresence, motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

const downloadCsv = (rows) => {
  const header = ['Date', 'Type', 'Amount', 'Description', 'Status', 'Reference'];
  const csvRows = [
    header.join(','),
    ...rows.map((row) =>
      [
        formatDateTime(row.createdAt),
        row.type,
        row.amount,
        `"${(row.description || '').replace(/"/g, '""')}"`,
        row.status,
        row.referenceId,
      ].join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'trustvault-transactions.csv';
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function TransactionsPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const pagination = useTransactionStore((state) => state.pagination);
  const activeTransaction = useTransactionStore((state) => state.activeTransaction);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const fetchTransaction = useTransactionStore((state) => state.fetchTransaction);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [search, setSearch] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    fetchTransactions({
      page,
      limit: 10,
      type: filters.type || undefined,
      status: filters.status || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      search: deferredSearch || undefined,
    }).catch(() => null);
  }, [page, filters, deferredSearch, fetchTransactions]);

  const handleRowClick = async (transactionId) => {
    try {
      await fetchTransaction(transactionId);
      setShowDetails(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load transaction details.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Transactions</p>
          <h2 className="mt-3 text-5xl">Search every movement</h2>
        </div>
        <button className="btn-secondary" type="button" onClick={() => downloadCsv(transactions)}>
          <Download className="mr-2" size={16} />
          Export CSV
        </button>
      </div>

      <GlassCard className="p-6">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_repeat(4,0.7fr)]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vault-muted" size={16} />
            <input
              className="input-shell pl-11"
              placeholder="Search reference or description"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
          </label>

          <select
            className="input-shell"
            value={filters.type}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, type: event.target.value }));
            }}
          >
            <option value="">All types</option>
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>

          <select
            className="input-shell"
            value={filters.status}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, status: event.target.value }));
            }}
          >
            <option value="">All statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          <input
            className="input-shell"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, dateFrom: event.target.value }));
            }}
          />

          <input
            className="input-shell"
            type="date"
            value={filters.dateTo}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, dateTo: event.target.value }));
            }}
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        {transactions.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-vault-muted">
                <tr>
                  {['Date', 'Type', 'Amount', 'Description', 'Status', 'Reference'].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="cursor-pointer border-b border-white/6 transition hover:bg-white/5"
                    onClick={() => handleRowClick(transaction.id)}
                  >
                    <td className="px-5 py-4 text-vault-muted">{formatDateTime(transaction.createdAt)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={transaction.type} />
                    </td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(transaction.amount)}</td>
                    <td className="px-5 py-4 text-vault-muted">{transaction.description || 'TrustVault transfer'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={transaction.status} />
                    </td>
                    <td className="px-5 py-4 text-vault-muted">{transaction.referenceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No transactions found"
              description="Adjust the filters or complete a transfer to populate this ledger view."
            />
          </div>
        )}
      </GlassCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-vault-muted">
          Page {pagination.page} of {pagination.totalPages || 1}
        </p>
        <div className="flex gap-3">
          <button
            className="btn-secondary"
            disabled={page <= 1}
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </button>
          <button
            className="btn-secondary"
            disabled={page >= (pagination.totalPages || 1)}
            type="button"
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && activeTransaction ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-panel w-full max-w-2xl p-7"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Transaction Detail</p>
                  <h3 className="mt-4 text-4xl">Reference {activeTransaction.referenceId}</h3>
                </div>
                <button className="btn-secondary" type="button" onClick={() => setShowDetails(false)}>
                  Close
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ['Amount', formatCurrency(activeTransaction.amount)],
                  ['Type', activeTransaction.type],
                  ['Status', activeTransaction.status],
                  ['Created', formatDateTime(activeTransaction.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-vault-muted">{label}</p>
                    <p className="mt-3 text-vault-text">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-vault-muted">Description</p>
                <p className="mt-3 text-vault-text">{activeTransaction.description || 'TrustVault transfer'}</p>
              </div>

              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Ledger Entries</p>
                <div className="mt-4 space-y-3">
                  {activeTransaction.ledgerEntries?.map((entry) => (
                    <div key={entry._id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <StatusBadge value={entry.type} />
                        <p className="text-sm text-vault-muted">{formatCurrency(entry.amount)}</p>
                      </div>
                      <p className="mt-3 text-sm text-vault-muted">
                        Balance after entry: <span className="text-vault-text">{formatCurrency(entry.balanceAfter)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
