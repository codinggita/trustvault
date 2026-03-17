import { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import api from '../utils/api';

export const Accounts = () => {
   const [accounts, setAccounts] = useState<Array<{
     id: string;
     name: string;
     type: 'checking' | 'savings' | 'credit';
     balance: number;
     status: string;
   }>>([]);
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [createAccountData, setCreateAccountData] = useState({
     name: '',
     type: 'checking' as 'checking' | 'savings' | 'credit',
     initialDeposit: ''
   });
    const { user } = useAuthStore(); // Keeping user for potential future use

    const fetchAccounts = useCallback(async () => {
       setLoading(true);
       try {
         // TODO: Replace with actual API call
         const response = await api.get(`/accounts?userId=${user?.id}`);
         setAccounts(response.data);
         
         // Mock data for now (remove when API is implemented)
         /* setAccounts([
           {
             id: 'acc1',
             name: 'Checking Account',
             type: 'checking',
             balance: 2500.00,
             status: 'ACTIVE'
           },
           {
             id: 'acc2',
             name: 'Savings Account',
             type: 'savings',
             balance: 15000.00,
             status: 'ACTIVE'
           },
           {
             id: 'acc3',
             name: 'Credit Card',
             type: 'credit',
             balance: -500.00, // Negative balance for credit
             status: 'ACTIVE'
           },
           {
             id: 'acc4',
             name: 'Frozen Account',
             type: 'checking',
             balance: 100.00,
             status: 'FROZEN'
           }
         ]); */
         toast.success('Accounts loaded successfully!');
       } catch (err) {
         const message = err instanceof Error ? err.message : 'Failed to fetch accounts';
         toast.error(message);
         setError(message);
       } finally {
         setLoading(false);
       }
     }, [user]);
   
     useEffect(() => {
       fetchAccounts();
     }, [fetchAccounts]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/accounts', {
      //   ...createAccountData,
      //   userId: user?.id,
      //   initialDeposit: parseFloat(createAccountData.initialDeposit)
      // });
      
      // Mock response
      const newAccount = {
        id: `acc${Date.now()}`,
        name: createAccountData.name,
        type: createAccountData.type,
        balance: parseFloat(createAccountData.initialDeposit) || 0,
        status: 'ACTIVE'
      };
      
       setAccounts(prev => [...prev, newAccount]);
      setShowCreateModal(false);
      setCreateAccountData({
        name: '',
        type: 'checking',
        initialDeposit: ''
      });
      toast.success('Account created successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary-500 border-t-transparent h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-primary-400">My Accounts</h2>
         <div className="flex items-center gap-3">
           <Input
             placeholder="Search accounts..."
             className="w-64"
           />
           <Button 
             variant="outline"
             onClick={() => setShowCreateModal(true)}
             className="flex items-center gap-2"
           >
             <Plus className="h-4 w-4" />
             New Account
           </Button>
         </div>
      </div>
      
      {error && (
        <div className="bg-red-50/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {accounts.length > 0 ? (
        <div className="space-y-4">
          {accounts.map(account => (
            <Card key={account.id} className="hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary-400">{account.name}</h3>
                  <p className="text-sm text-gray-400">{account.type} account</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-50">${account.balance.toFixed(2)}</p>
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${account.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 
                      account.status === 'FROZEN' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {account.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You don't have any accounts yet.</p>
        </div>
      )}
      
      <Modal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        className="max-w-md"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary-400">Create New Account</h3>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Account Name</label>
                 <Input 
                   placeholder="e.g., My Checking Account"
                   value={createAccountData.name}
                   onChange={(value) => setCreateAccountData(prev => ({ ...prev, name: value }))}
                   className="w-full"
                 />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Type</label>
                <select
                  value={createAccountData.type}
                  onChange={(e) => setCreateAccountData(prev => ({ ...prev, type: e.target.value as 'checking' | 'savings' | 'credit' }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Initial Deposit ($)</label>
                 <Input 
                   type="number"
                   value={createAccountData.initialDeposit}
                   onChange={(value) => setCreateAccountData(prev => ({ ...prev, initialDeposit: value }))}
                   placeholder="0.00"
                   className="w-full"
                 />
              </div>
            </div>
             <Button 
               variant="primary" 
               className="w-full"
               disabled={loading}
             >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

