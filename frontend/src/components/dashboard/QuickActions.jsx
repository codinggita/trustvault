import { Box, Button, Typography, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const QuickActions = ({ user, accounts }) => {
  const navigate = useNavigate();

  // GSAP animation for quick actions
  useEffect(() => {
    gsap.fromTo(
      '.quick-actions',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3
      }
    );
  }, []);

  return (
    <Box className="quick-actions">
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {/* New Account */}
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            startIcon={<AddIcon fontSize="inherit" />}
            onClick={() => navigate('/accounts/new')}
          >
            New Account
          </Button>
        </Grid>

        {/* Transfer Funds */}
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth
            startIcon={<SwapHorizIcon fontSize="inherit" />}
            onClick={() => navigate('/transfer')}
          >
            Transfer Funds
          </Button>
        </Grid>

        {/* Account Overview (if we have accounts) */}
        <Grid item xs={12} sm={4}>
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth
            startIcon={<CreditCardIcon fontSize="inherit" />}
            onClick={() => navigate('/accounts')}
          >
            Account Overview
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickActions;