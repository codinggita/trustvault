import { NavLink } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  return (
    <aside className={`flex-col flex-shrink-0 w-64 bg-background-900/50 backdrop-blur-sm border-r border-border/20 ${className}`}>
      <div className="flex items-center p-4 border-b border-border/20">
        <span className="text-xl font-bold text-primary-400">TrustVault</span>
      </div>
      <nav className="mt-6 space-y-1">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `
            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
            }
          `}
        >
          <span className="mr-3">📊</span>
          Dashboard
        </NavLink>
        <NavLink
          to="/accounts"
          end
          className={({ isActive }) => `
            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
            }
          `}
        >
          <span className="mr-3">🏦</span>
          Accounts
        </NavLink>
        <NavLink
          to="/transactions"
          end
          className={({ isActive }) => `
            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
            }
          `}
        >
          <span className="mr-3">💳</span>
          Transactions
        </NavLink>
        <NavLink
          to="/transfers"
          end
          className={({ isActive }) => `
            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
            }
          `}
        >
          <span className="mr-3">🔄</span>
          Transfers
        </NavLink>
      </nav>
      <div className="mt-auto p-4 border-t border-border/20">
        <NavLink
          to="/profile"
          end
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 hover:bg-gray-50/50 hover:text-gray-100"
        >
          <span className="mr-3">👤</span>
          Profile
        </NavLink>
      </div>
    </aside>
  );
};
Sidebar.displayName = 'Sidebar';