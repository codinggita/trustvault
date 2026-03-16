import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  return (
    <motion.aside 
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -60, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex-col flex-shrink-0 w-64 bg-background-900/50 backdrop-blur-lg border-r border-primary-500/20 ${className}`}
    >
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center p-4 border-b border-primary-500/10"
        >
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-bold text-gradient-to-tr from-primary-400 to-primary-300 bg-clip-text text-transparent"
          >
            TrustVault
          </motion.span>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 space-y-1"
        >
           <NavLink
             to="/dashboard"
             end
             className={({ isActive }) => `
               flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300
               ${isActive
                 ? 'bg-gradient-to-tr from-primary-500/20 to-primary-400/20 text-primary-400 shadow-inner hover:from-primary-500/25 hover:to-primary-400/25'
                 : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
               }
             `}
           >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="mr-3"
            >
              📊
            </motion.span>
            Dashboard
          </NavLink>
          
           <NavLink
             to="/accounts"
             end
             className={({ isActive }) => `
               flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300
               ${isActive
                 ? 'bg-gradient-to-tr from-primary-500/20 to-primary-400/20 text-primary-400 shadow-inner hover:from-primary-500/25 hover:to-primary-400/25'
                 : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
               }
             `}
           >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="mr-3"
            >
              🏦
            </motion.span>
            Accounts
          </NavLink>
          
           <NavLink
             to="/transactions"
             end
             className={({ isActive }) => `
               flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300
               ${isActive
                 ? 'bg-gradient-to-tr from-primary-500/20 to-primary-400/20 text-primary-400 shadow-inner hover:from-primary-500/25 hover:to-primary-400/25'
                 : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
               }
             `}
           >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="mr-3"
            >
              💳
            </motion.span>
            Transactions
          </NavLink>
          
           <NavLink
             to="/transfers"
             end
             className={({ isActive }) => `
               flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300
               ${isActive
                 ? 'bg-gradient-to-tr from-primary-500/20 to-primary-400/20 text-primary-400 shadow-inner hover:from-primary-500/25 hover:to-primary-400/25'
                 : 'text-gray-400 hover:bg-gray-50/50 hover:text-gray-100'
               }
             `}
           >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="mr-3"
            >
              🔄
            </motion.span>
            Transfers
          </NavLink>
        </motion.nav>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-auto p-4 border-t border-primary-500/10"
        >
          <NavLink
            to="/profile"
            end
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 text-gray-400 hover:bg-gray-50/50 hover:text-gray-100"
          >
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="mr-3"
            >
              👤
            </motion.span>
            Profile
          </NavLink>
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
};
Sidebar.displayName = 'Sidebar';
