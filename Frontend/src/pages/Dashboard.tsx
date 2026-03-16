import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-background-900 to-background-800 p-6"
    >
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:space-x-6"
          >
            <motion.card 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex-1 p-6 bg-background-800/50 backdrop-blur-lg border border-primary-500/20 rounded-2xl shadow-xl"
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg font-semibold text-primary-400 mb-4"
              >
                Total Balance
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-4xl font-bold text-gradient-to-tr from-primary-50 to-primary-400 bg-clip-text text-transparent"
              >
                $0.00
              </motion.p>
            </motion.card>
            
            <motion.card 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex-1 p-6 bg-background-800/50 backdrop-blur-lg border border-primary-500/20 rounded-2xl shadow-xl"
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg font-semibold text-primary-400 mb-4"
              >
                Recent Transactions
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-3"
              >
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-gray-400"
                >
                  No transactions yet
                </motion.div>
              </motion.div>
            </motion.card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <motion.card 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="p-6 bg-background-800/50 backdrop-blur-lg border border-primary-500/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                variant="outline"
                className="w-full px-4 py-3 border-border-primary-500/30 rounded-lg hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300"
              >
                View Accounts
              </motion.button>
            </motion.card>
            
            <motion.card 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="p-6 bg-background-800/50 backdrop-blur-lg border border-primary-500/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                variant="outline"
                className="w-full px-4 py-3 border-border-primary-500/30 rounded-lg hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300"
              >
                Make Transfer
              </motion.button>
            </motion.card>
            
            <motion.card 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="p-6 bg-background-800/50 backdrop-blur-lg border border-primary-500/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                variant="outline"
                className="w-full px-4 py-3 border-border-primary-500/30 rounded-lg hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300"
              >
                Add Account
              </motion.button>
            </motion.card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
