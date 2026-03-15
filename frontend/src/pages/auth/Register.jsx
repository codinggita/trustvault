import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';
import { gsap } from 'gsap';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(
      '.register-page',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <Box className="register-page">
        <Typography variant="h4" align="center" gutterBottom>
          Join TrustVault
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Create your secure banking account
        </Typography>
        <AuthForm type="register" />
        {location.state && location.state.from && (
          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Please register to continue to {location.state.from.location?.pathname || 'the requested page'}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Register;