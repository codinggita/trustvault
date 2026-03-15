import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';
import { gsap } from 'gsap';

const Login = () => {
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
      '.login-page',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <Box className="login-page">
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Sign in to your TrustVault account
        </Typography>
        <AuthForm type="login" />
        {location.state && location.state.from && (
          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Please log in to continue to {location.state.from.location?.pathname || 'the requested page'}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;