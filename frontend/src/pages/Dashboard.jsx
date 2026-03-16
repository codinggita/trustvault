import { motion } from 'framer-motion';
import { ArrowLeftRight, Landmark, PlusCircle, ReceiptText } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useAccountStore } from '../stores/accountStore';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatDateTime } from '../utils/formatDate';

const quickActions = [
  { label: 'Send Money', icon: ArrowLeftRight, to: '/dashboard/transfer' },
  { label: 'Request', icon: Landmark, onClick: () => toast('Request flow is a UI placeholder for now.') },
  { label: 'Add Money', icon: PlusCircle, onClick: () => toast('Use admin funding or seed flow for balance credits.') },
  { label: 'Pay Bills', icon: ReceiptText, onClick: () => toast('Bills is present as a premium UI preview.') },
];

const maskAccount = (accountNumber = '') =>
  accountNumber ? `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}` : 'No account';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const accounts = useAccountStore((state) => state.accounts);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const transactions = useTransactionStore((state) => state.transactions);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchAccounts().catch(() => null);
    fetchTransactions({ page: 1, limit: 20 }).catch(() => null);
  }, [fetchAccounts, fetchTransactions]);

  const primaryAccount = accounts[0];

  const chartMap = {};
  transactions.forEach((transaction) => {
    const month = formatDate(transaction.createdAt, 'MMM');
    if (!chartMap[month]) {
      chartMap[month] = { month, credit: 0, debit: 0 };
    }
    if (transaction.type === 'CREDIT') {
      chartMap[month].credit += transaction.amount;
    } else {
      chartMap[month].debit += transaction.amount;
    }
  });
  const chartData = Object.values(chartMap).slice(-6);

  if (!accounts.length) {
    return (
      <EmptyState
        title="No account data yet"
        description="Once your account is restored, your balances, transfers, and charts will show up here."
        action={
          <Link className="btn-primary" to="/dashboard/transfer">
            Start a transfer
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="relative overflow-hidden p-7 sm:p-8">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-vault-gold/10 blur-3xl" />
          <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Overview</p>
          <h2 className="mt-4 text-5xl font-semibold">Good day, {user?.name?.split(' ')[0] || 'Client'}</h2>
          <p className="mt-2 text-sm text-vault-muted">{formatDate(new Date(), 'EEEE, dd MMM yyyy')}</p>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-black/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-vault-muted">Available balance</p>
                <p className="mt-3 text-5xl font-semibold text-gradient">
                  {formatCurrency(primaryAccount.balance, primaryAccount.currency)}
                </p>
                <p className="mt-4 text-sm text-vault-muted">{maskAccount(primaryAccount.accountNumber)}</p>
              </div>
              <StatusBadge value={primaryAccount.status} />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              if (action.to) {
                return (
                  <Link key={action.label} className="btn-secondary justify-start" to={action.to}>
                    <Icon className="mr-2" size={16} />
                    {action.label}
                  </Link>
                );
              }

              return (
                <button key={action.label} className="btn-secondary justify-start" type="button" onClick={action.onClick}>
                  <Icon className="mr-2" size={16} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Recent Activity</p>
          <div className="mt-6 space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{transaction.description || 'TrustVault transfer'}</p>
                    <p className="mt-1 text-xs text-vault-muted">{formatDateTime(transaction.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge value={transaction.type} />
                    <p className="mt-2 text-sm font-semibold">{formatCurrency(transaction.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
            {!transactions.length ? <SkeletonCard className="min-h-[280px]" /> : null}
          </div>
        </GlassCard>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Spending Chart</p>
              <h3 className="mt-3 text-4xl">Debit vs credit flow</h3>
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            {chartData.length ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#A8A3B3" />
                  <YAxis stroke="#A8A3B3" />
                  <Tooltip
                    contentStyle={{
                      background: '#111118',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '18px',
                    }}
                  />
                  <Bar dataKey="credit" fill="#E8C96A" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="debit" fill="#6B7280" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="Chart building soon"
                description="As soon as transactions land, your credit and debit activity will graph here."
              />
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Account Snapshot</p>
          <div className="mt-6 space-y-4">
            {accounts.map((account) => (
              <div key={account._id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{maskAccount(account.accountNumber)}</p>
                    <p className="mt-1 text-xs text-vault-muted">{account.currency} account</p>
                  </div>
                  <StatusBadge value={account.status} />
                </div>
                <p className="mt-4 text-2xl font-semibold">{formatCurrency(account.balance)}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

