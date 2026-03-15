import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BalanceCard from '../../components/dashboard/BalanceCard';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import QuickActions from '../../components/dashboard/QuickActions';
import { getAccounts, getAccountBalance, getTransactions } from '../../services/accountService';
import { useSelector as useAuthSelector } from 'react-redux';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuthSelector((state) => state.auth);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accounts and their data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accountsData = await getAccounts();
        setAccounts(accountsData);
        
        // Fetch balance and transactions for each account (in parallel)
        const accountPromises = accountsData.map(async (account) => {
          const [balance, transactions] = await Promise.all([
            getAccountBalance(account.id),
            getTransactions(account.id, 5) // Get 5 recent transactions
          ]);
          return { ...account, balance, transactions };
        });
        
        const accountsWithData = await Promise.all(accountPromises);
        setAccounts(accountsWithData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // GSAP animations for hero section
  useEffect(() => {
    // Animate hero section on load
    gsap.fromTo(
      '.dashboard-hero',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Scroll-triggered animations for balance cards
    gsap.utils.toArray('.balance-card').forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Fly-in animation for recent transactions table
    gsap.fromTo(
      '.recent-transactions',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5,
        scrollTrigger: {
          trigger: '.recent-transactions',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, [accounts.length]); // Re-run when accounts data changes

  if (loading) {
    return (
      <Box 
        display="flex" 
        height="100vh" 
        justifyContent="center" 
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        color="error.text" 
        textAlign="center" 
        py={4}
      >
        {error}
      </Box>
    );
  }

  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box className="dashboard-hero" textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's your financial overview
          </Typography>
        </Box>

        {/* Balance Cards Grid */}
        <Grid container spacing={3} mb={4}>
          {accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <BalanceCard account={account} />
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box mb={4}>
          <QuickActions user={user} accounts={accounts} />
        </Box>

        {/* Recent Transactions */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Recent Transactions
          </Typography>
          <div className="recent-transactions">
            {accounts.length > 0 ? (
              <RecentTransactions accounts={accounts} />
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No transactions to display
                </Typography>
              </Box>
            )}
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;