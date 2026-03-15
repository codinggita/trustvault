import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    gsap.fromTo(
      '.dashboard-page',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 8 }}>
      <Box className="dashboard-page">
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to TrustVault Dashboard
        </Typography>
        {user && (
          <Box textAlign="center" mb={4}>
            <Typography variant="h5" color="primary.main">
              Hello, {user.firstName} {user.lastName}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        )}
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Overview
              </Typography>
              <Typography variant="body2">
                View your account balances and recent transactions.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transfer Funds
              </Typography>
              <Typography variant="body2">
                Send money securely to anyone, anywhere.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Typography variant="body2">
                Manage your profile and security preferences.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;