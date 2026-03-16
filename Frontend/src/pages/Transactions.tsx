import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Clock, Banknote, RefreshCw } from 'lucide-react';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/transactions?userId=${user?.id}`);
      // setTransactions(response.data);
      
      // Mock data for now
      setTransactions([
        {
          id: 'txn1',
          type: 'debit',
          amount: 50.00,
          description: 'Grocery Store',
          date: '2026-03-15',
          status: 'completed'
        },
        {
          id: 'txn2',
          type: 'credit',
          amount: 1500.00,
          description: 'Salary Deposit',
          date: '2026-03-01',
          status: 'completed'
        },
        {
          id: 'txn3',
          type: 'debit',
          amount: 30.00,
          description: 'Coffee Shop',
          date: '2026-03-14',
          status: 'pending'
        }
      ]);
      toast.success('Transactions loaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch transactions');
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchTransactions();
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary-500 border-t-transparent h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-primary-400">Transaction History</h2>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map(txn => (
            <Card key={txn.id} className="hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full 
                    ${txn.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {txn.type === 'credit' ? <Banknote className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-400">{txn.description}</h3>
                    <p className="text-sm text-gray-400">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold 
                    ${txn.type === 'credit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {txn.type === 'credit' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${txn.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions yet.</p>
        </div>
      )}
    </div>
  );
};