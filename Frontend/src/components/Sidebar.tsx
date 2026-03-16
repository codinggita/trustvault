import {
  ArrowLeftRight,
  Landmark,
  LayoutDashboard,
  ReceiptText,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Landmark },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
];

export const Sidebar = ({ className = '' }: SidebarProps) => {
  return (
    <aside
      className={`hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/95 px-4 py-6 backdrop-blur md:flex md:flex-col ${className}`}
    >
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          TrustVault
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-50">
          Personal banking cockpit
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Track balances, create accounts, and move money from one secure place.
        </p>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-200'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        Local demo mode is enabled, so your data stays on this machine.
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
