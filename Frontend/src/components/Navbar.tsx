import { useAuthStore } from '../store/useAuthStore';
import { useLocation, NavLink } from 'react-router-dom';
import { LogOut, UserCircle, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = '' }: NavbarProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-between px-4 py-3 bg-background-900/50 backdrop-blur-sm border-b border-border/20 ${className}`}
    >
      <AnimatePresence>
        {!isAuthRoute && (
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:hidden text-gray-400 hover:text-gray-200"
            onClick={() => {
              // Mobile menu toggle would go here
            }}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-xl font-bold text-gradient-to-tr from-primary-400 to-primary-300 bg-clip-text text-transparent hidden md:block"
          >
            TrustVault
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="hidden md:flex items-center gap-4"
          >
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => {
                return `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
                  }
                `;
              }}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/accounts"
              end
              className={({ isActive }) => {
                return `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
                  }
                `;
              }}
            >
              Accounts
            </NavLink>
            <NavLink
              to="/transactions"
              end
              className={({ isActive }) => {
                return `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
                  }
                `;
              }}
            >
              Transactions
            </NavLink>
            <NavLink
              to="/transfers"
              end
              className={({ isActive }) => {
                return `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'bg-primary-500/20 text-primary-400 shadow-inner'
                    : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
                  }
                `;
              }}
            >
              Transfers
            </NavLink>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-3"
        >
          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="text-gray-400 hover:text-gray-200 hover:scale-110 transition-transform duration-300"
          >
            <UserCircle className="h-5 w-5" />
          </motion.button>
          {user && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative"
            >
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 hover:scale-105 transition-transform duration-300"
              >
                <span className="truncate max-w-xs">{user.name}</span>
                <Menu className="h-4 w-4" />
              </motion.button>
              {/* Dropdown menu would go here */}
            </motion.div>
          )}
          {!isAuthRoute && user && (
            <motion.button 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-red-500 hover:text-red-400 hover:scale-110 transition-transform duration-300"
              onClick={() => {
                // Logout would be handled by auth store
              }}
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.header>
  );
};
Navbar.displayName = 'Navbar';
