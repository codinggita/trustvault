import { Box, Card, CardContent, Typography, Chip, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useSelector } from 'react-redux';
import { useAuthSelector } from '../../store/store';

const BalanceCard = ({ account }) => {
  const { user } = useAuthSelector((state) => state.auth);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch balance for this specific account if not already provided
  useEffect(() => {
    if (account.balance !== undefined) {
      setBalance(account.balance);
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const balanceData = await fetch(`/api/accounts/${account.id}/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!balanceData.ok) {
          throw new Error('Failed to fetch balance');
        }
        
        const data = await balanceData.json();
        setBalance(data.balance);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load balance');
        setLoading(false);
      }
    };

    if (account.id) {
      fetchBalance();
    }
  }, [account.id, account.balance]);

  // Animate balance number on load
  useEffect(() => {
    if (balance !== null) {
      gsap.fromTo(
        `.balance-amount-${account.id}`,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [balance]);

  if (loading) {
    return (
      <Card sx={{ minHeight: 180 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ minHeight: 180 }}>
        <CardContent>
          <Typography color="error.text" textAlign="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minHeight: 180, position: 'relative', overflow: 'hidden' }}>
      {/* Decorative gradient overlay */}
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        width="100%" 
        height="4px" 
        background="linear-gradient(90deg, #2563eb, #10b981)"
      />
      
      <CardContent sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600">
              {account.name || `Account ${account.id}`}
            </Typography>
            <Chip 
              label={account.type || 'Checking'} 
              size="small" 
              sx={{ backgroundColor: '#2563eb20', color: '#2563eb' }}
            />
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="baseline">
            <Typography 
              variant="h4" 
              fontWeight="700" 
              className={`balance-amount-${account.id}`}
              sx={{ color: balance >= 0 ? 'success.main' : 'error.main' }}
            >
              ${balance !== null ? balance.toFixed(2) : '--'}
            </Typography>
            <AccountBalanceIcon fontSize="small" sx={{ color: '#2563eb' }} />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Available balance
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;