import { LogOut, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from './Button';

interface NavbarProps {
  className?: string;
}

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/transactions': 'Transactions',
  '/transfers': 'Transfers',
};

export const Navbar = ({ className = '' }: NavbarProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const pageTitle = useMemo(
    () => routeTitles[location.pathname] ?? 'TrustVault',
    [location.pathname],
  );

  return (
    <header
      className={`sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Secure Workspace
            </p>
            <h1 className="text-xl font-semibold text-slate-50">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2">
            <p className="text-sm font-medium text-slate-100">
              {user?.name || 'Guest'}
            </p>
            <p className="text-xs text-slate-400">{user?.email || 'No email'}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void logout()}
            className="shrink-0"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};

Navbar.displayName = 'Navbar';
