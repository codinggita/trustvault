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

  // Add hover animations for buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.quick-action-btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in'
        });
      });
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <Box className="quick-actions">
      <Typography variant="h5" gutterBottom sx={{ 
        color: '#f8fafc',
        fontWeight: 600,
        letterSpacing: '-0.5px'
      }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {/* New Account */}
        <Grid item xs={12} sm={4}>
          <Button 
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<AddIcon fontSize="inherit" />}
            className="quick-action-btn"
            sx={{ 
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              color: '#60a5fa',
              fontWeight: 500,
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(96, 165, 250, 0.15)'
              }
            }}
            onClick={() => navigate('/accounts/new')}
          >
            New Account
          </Button>
        </Grid>

        {/* Transfer Funds */}
        <Grid item xs={12} sm={4}>
          <Button 
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<SwapHorizIcon fontSize="inherit" />}
            className="quick-action-btn"
            sx={{ 
              backgroundColor: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#34d399',
              fontWeight: 500,
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(52, 211, 153, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(52, 211, 153, 0.15)'
              }
            }}
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
            className="quick-action-btn"
            sx={{ 
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              color: '#60a5fa',
              fontWeight: 500,
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(96, 165, 250, 0.15)'
              }
            }}
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