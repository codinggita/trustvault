import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

export const Transfers = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const { user } = useAuthStore(); // Keeping user for potential future use when API is implemented

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Generate idempotency key for transfer
      const idempotencyKey = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // TODO: Replace with actual API call
      // await api.post('/transfers', {
      //   ...transferData,
      //   userId: user?.id,
      //   idempotencyKey
      // }, {
      //   headers: {
      //     'Idempotency-Key': idempotencyKey
      //   }
      // });
      
      // Mock successful transfer
      setShowSendModal(false);
      
      // Reset form
      setTransferData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
      });
      
      toast.success('Transfer sent successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transfer failed. Please try again.');
      setError(err.response?.data?.message || 'Transfer failed. Please try again.');
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
        <h2 className="text-2xl font-bold text-primary-400">Send Money</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowSendModal(true)}
          className="flex items-center gap-2"
        >
          <SendHorizontal className="h-4 w-4" />
          New Transfer
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {accounts.length >= 2 ? (
        <div className="space-y-4">
          <div className="bg-background-800/50 backdrop-blur-glass border border-border/20 rounded-glass p-4">
            <h3 className="text-lg font-semibold text-primary-400 mb-3">Quick Transfer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">From Account</label>
                  <select
                    value={transferData.fromAccount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, fromAccount: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type}) - ${acc.balance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">To Account</label>
                  <select
                    value={transferData.toAccount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, toAccount: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type}) - ${acc.balance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Amount ($)</label>
                  <Input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description (optional)</label>
                  <Input
                    value={transferData.description}
                    onChange={(e) => setTransferData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a note..."
                    className="w-full"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send Money'}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You need at least two accounts to make a transfer.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              // Navigate to accounts page or show create account modal
            }}
          >
            Create Account
          </Button>
        </div>
      )}
      
      <Modal 
        show={showSendModal} 
        onClose={() => setShowSendModal(false)}
        className="max-w-md"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary-400">Transfer Confirmation</h3>
          <p className="text-gray-400">Review your transfer details before sending.</p>
          
          <div className="bg-background-800/50 backdrop-blur-glass border border-border/20 rounded-glass p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">From</span>
                <span className="font-medium text-primary-400">{accounts.find(acc => acc.id === transferData.fromAccount)?.name || 'Select account'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">To</span>
                <span className="font-medium text-primary-400">{accounts.find(acc => acc.id === transferData.toAccount)?.name || 'Select account'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="font-medium text-primary-400">${parseFloat(transferData.amount || '0').toFixed(2)}</span>
              </div>
              {transferData.description && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Description</span>
                  <span className="text-sm text-gray-300">{transferData.description}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSendModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Transfer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};