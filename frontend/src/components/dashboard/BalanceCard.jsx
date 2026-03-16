import { Box, Card, CardContent, Typography, Chip, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useSelector } from 'react-redux';

const BalanceCard = ({ account }) => {
  const { user } = useSelector((state) => state.auth);
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

  // Add hover animation
  useEffect(() => {
    const cardElement = document.querySelector(`.balance-card-${account.id}`);
    if (cardElement) {
      cardElement.addEventListener('mouseenter', () => {
        gsap.to(cardElement, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      cardElement.addEventListener('mouseleave', () => {
        gsap.to(cardElement, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in'
        });
      });
      
      return () => {
        cardElement.removeEventListener('mouseenter', () => {});
        cardElement.removeEventListener('mouseleave', () => {});
      };
    }
  }, [account.id]);

  if (loading) {
    return (
      <Card 
        className="balance-card"
        sx={{ 
          minHeight: 180, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 16
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={24} sx={{ color: '#60a5fa' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        className="balance-card"
        sx={{ 
          minHeight: 180, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 16
        }}
      >
        <CardContent>
          <Typography color="error.text" textAlign="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`balance-card-${account.id} balance-card`}
      sx={{ 
        minHeight: 180, 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: 16,
        transition: 'all 0.3s ease',
        '&:hover': {
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Decorative gradient overlay */}
      <Box 
        position="absolute" 
        top={0} 
        left={0} 
        width="100%" 
        height="4px" 
        background="linear-gradient(90deg, #60a5fa, #34d399)"
      />
      
      <CardContent sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600" sx={{ color: '#f8fafc' }}>
              {account.name || `Account ${account.id}`}
            </Typography>
            <Chip 
              label={account.type || 'Checking'} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(96, 165, 250, 0.2)', 
                color: '#60a5fa',
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}
            />
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="baseline">
            <Typography 
              variant="h3" 
              fontWeight="700" 
              className={`balance-amount-${account.id}`}
              sx={{ 
                color: balance >= 0 ? '#34d399' : '#f87171',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                letterSpacing: '-0.5px'
              }}
            >
              ${balance !== null ? balance.toFixed(2) : '--'}
            </Typography>
            <AccountBalanceIcon fontSize="small" sx={{ color: '#60a5fa' }} />
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
