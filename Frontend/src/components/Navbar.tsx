import { useAuthStore } from '../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, UserCircle, Menu } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = '' }: NavbarProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <header className={`flex items-center justify-between px-4 py-3 bg-background-900/50 backdrop-blur-sm border-b border-border/20 ${className}`}>
      {!isAuthRoute && (
        <button 
          className="md:hidden text-gray-400 hover:text-gray-200"
          onClick={() => {
            // Mobile menu toggle would go here
          }}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary-400 hidden md:block">TrustVault</h1>
        <div className="hidden md:flex items-center gap-4">
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
            Transfers
          </NavLink>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-200">
          <UserCircle className="h-5 w-5" />
        </button>
        {user && (
          <div className="relative">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-200">
              <span className="truncate max-w-xs">{user.name}</span>
              <Menu className="h-4 w-4" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
        )}
        {!isAuthRoute && user && (
          <button 
            className="text-red-500 hover:text-red-400"
            onClick={() => {
              // Logout would be handled by auth store
            }}
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
};
Navbar.displayName = 'Navbar';