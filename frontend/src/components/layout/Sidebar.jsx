import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  UserCircle2,
  WalletCards,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAccountStore } from '../../stores/accountStore';
import { useAuthStore } from '../../stores/authStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency } from '../../utils/formatCurrency';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/accounts', label: 'Accounts', icon: WalletCards },
  { to: '/dashboard/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/dashboard/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/dashboard/profile', label: 'Profile', icon: UserCircle2 },
];

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const clearAccounts = useAccountStore((state) => state.clear);
  const clearTransactions = useTransactionStore((state) => state.clear);
  const accounts = useAccountStore((state) => state.accounts);
  const primaryAccount = accounts[0];

  const handleLogout = async () => {
    await logout();
    clearAccounts();
    clearTransactions();
    toast.success('You have been signed out.');
    navigate('/login');
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-8 pt-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-vault-gold/25 bg-white/5">
          <span className="font-display text-2xl text-gradient">TV</span>
        </div>
        <div>
          <p className="font-display text-2xl">TrustVault</p>
          <p className="text-xs uppercase tracking-[0.35em] text-vault-muted">Private Banking</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`.trim()
            }
            to={to}
            onClick={onNavigate}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-[28px] border border-vault-gold/20 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-vault-muted">Quick View</p>
        <p className="mt-3 text-sm text-vault-muted">Primary balance</p>
        <p className="mt-1 text-2xl font-semibold text-vault-text">
          {formatCurrency(primaryAccount?.balance)}
        </p>
        <p className="mt-2 text-xs text-vault-muted">
          {primaryAccount?.accountNumber ? `•••• ${primaryAccount.accountNumber.slice(-4)}` : 'No account loaded'}
        </p>
      </div>

      <button className="btn-secondary mt-4 w-full" type="button" onClick={handleLogout}>
        <LogOut className="mr-2" size={16} />
        Logout
      </button>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className="glass-panel hidden h-[calc(100vh-2rem)] w-[300px] p-4 lg:block">
        <SidebarContent />
      </div>

      <div className="lg:hidden">
        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.button
                className="fixed inset-0 z-40 bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                type="button"
              />
              <motion.aside
                className="fixed left-0 top-0 z-50 h-full w-[86vw] max-w-[320px] bg-vault-panel p-4"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              >
                <SidebarContent onNavigate={onClose} />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
