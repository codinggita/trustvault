import { Box, Typography, Stack } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect } from 'react';
import { gsap } from 'gsap';

const Logo = () => {
  useEffect(() => {
    gsap.fromTo(
      '.logo-container',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <Box className="logo-container" textAlign="center" sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <LockIcon fontSize="large" sx={{ color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ ml: 2 }}>
          TrustVault
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Secure Banking Platform
      </Typography>
    </Box>
  );
};

export default Logo;