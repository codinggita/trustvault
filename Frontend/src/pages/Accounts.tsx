import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Banknote, Plus } from 'lucide-react';

export const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/accounts?userId=${user?.id}`);
      // setAccounts(response.data);
      
      // Mock data for now
      setAccounts([
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
        }
      ]);
      toast.success('Accounts loaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch accounts');
      setError(err.response?.data?.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (accountData: {
    name: string;
    type: 'checking' | 'savings' | 'credit';
    initialDeposit: number;
  }) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/accounts', {
      //   ...accountData,
      //   userId: user?.id
      // });
      
      // Mock response
      const newAccount = {
        id: `acc${Date.now()}`,
        ...accountData,
        balance: accountData.initialDeposit,
        status: 'ACTIVE'
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setShowCreateModal(false);
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
      setError(err.response?.data?.message || 'Failed to create account');
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
          <form onSubmit={(e) => {
            e.preventDefault();
            // Form submission handled by mock data in handleCreateAccount
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Account Name</label>
              <Input 
                placeholder="e.g., My Checking Account"
                // value and onChange would be handled by form state
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Type</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Initial Deposit ($)</label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  // value and onChange would be handled by form state
                />
              </div>
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};