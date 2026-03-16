import { Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSelector } from 'react-redux';

const RecentTransactions = ({ accounts }) => {
  const { user } = useSelector((state) => state.auth);
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
      <Paper 
        sx={{ 
          minHeight: 200, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 16
        }}
      >
        <CircularProgress sx={{ color: '#60a5fa' }} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper 
        sx={{ 
          minHeight: 200, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 16
        }}
      >
        <Typography color="error.text" textAlign="center" sx={{ color: '#f87171' }}>
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 3,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        '&:hover': {
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ 
        color: '#f8fafc',
        fontWeight: 600,
        letterSpacing: '-0.5px'
      }}>
        Recent Transactions
      </Typography>
      {transactions.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary" sx={{ 
            color: '#94a3b8',
            fontStyle: 'italic'
          }}>
            No recent transactions
          </Typography>
        </Box>
      ) : (
        <Table 
          sx={{ 
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc'
            },
            '& .MuiTableHead-root': {
              '& .MuiTableCell-root': {
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                color: '#94a3b8'
              }
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="transaction-row" sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'backgroundColor 0.2s ease'
                }
              }}>
                <TableCell sx={{ 
                  py: 2,
                  fontSize: '0.875rem'
                }}>
                  {new Date(tx.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="left" sx={{ 
                  py: 2,
                  fontSize: '0.875rem'
                }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      backgroundColor: 'rgba(96, 165, 250, 0.1)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid rgba(96, 165, 250, 0.2)'
                    }}>
                      {/* In a real app, we would have an icon component here */}
                      <Box sx={{ fontSize: '1rem' }}>
                        💳
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 500,
                      letterSpacing: '-0.25px'
                    }}>
                      {tx.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ 
                  py: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: tx.amount < 0 ? '#f87171' : '#34d399',
                      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
                    }}
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
