import { Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSelector } from 'react-redux';
import { useAuthSelector } from '../../store/store';

const RecentTransactions = ({ accounts }) => {
  const { user } = useAuthSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent transactions for the primary account (first account) or all accounts?
  // For simplicity, we'll fetch for the first account if available, otherwise show empty.
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        if (accounts.length === 0) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        // We'll fetch transactions for the first account as an example
        const accountId = accounts[0].id;
        const response = await fetch(`/api/transactions`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: { accountId, limit: 10 } // Get 10 recent transactions
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load transactions');
        setLoading(false);
      }
    };

    if (user && accounts.length > 0) {
      fetchTransactions();
    }
  }, [user, accounts]);

  // Animate table rows on load
  useEffect(() => {
    if (transactions.length > 0) {
      gsap.fromTo(
        '.transaction-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1
        }
      );
    }
  }, [transactions.length]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography color="error.text" textAlign="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      {transactions.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            No recent transactions
          </Typography>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="transaction-row">
                <TableCell>
                  {new Date(tx.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center" gap={1}>
                    {tx.icon && <Box sx={{ width: 24, height: 24, backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* In a real app, we would have an icon component here */}
                    </Box>}
                    <Typography variant="body2">{tx.description}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight="500"
                    sx={{ color: tx.amount < 0 ? 'error.main' : 'success.main' }}
                  >
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default RecentTransactions;