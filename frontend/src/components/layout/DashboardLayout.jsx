import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../utils/formatDate';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-6">
          <div className="glass-panel flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-vault-muted">Portfolio</p>
              <h1 className="mt-1 text-3xl font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'Client'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-secondary lg:hidden" type="button" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={16} />
              </button>
              <div className="hidden text-right md:block">
                <p className="text-sm text-vault-muted">Today</p>
                <p className="text-sm text-vault-text">{formatDate(new Date(), 'EEEE, dd MMM yyyy')}</p>
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

