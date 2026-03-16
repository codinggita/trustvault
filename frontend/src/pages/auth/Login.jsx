import { Box, Container, Typography, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const containerRef = useRef();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useGSAP(() => {
    // Entrance animation for the login container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
    );
    
    // Staggered animation for form elements
    gsap.fromTo(
      containerRef.current.querySelectorAll('.animate-item'),
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: 'power3.out' 
      }
    );
    
    // Subtle floating animation for background elements
    gsap.to(
      containerRef.current.querySelector('.floating-bg'),
      { 
        y: 10, 
        duration: 3, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut' 
      }
    );
  }, { scope: containerRef });

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 12, minHeight: '100vh' }}>
      <Box 
        ref={containerRef} 
        className="login-page"
        sx={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating background elements */}
        <Box 
          className="floating-bg"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 20%)',
            pointerEvents: 'none'
          }}
        />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ height: '100%' }}>
          {/* Left side - Illustration/Info */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              flex: 1,
              backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderTopLeftRadius: 'lg',
              borderBottomLeftRadius: 'lg',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.5
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                padding: 6,
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" fontWeight="600" component="h2">
                TrustVault
              </Typography>
              <Typography variant="body2" color="white">
                Secure your digital assets with military-grade encryption
              </Typography>
            </Box>
          </Box>
          
          {/* Right side - Form */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: 400, 
                p: 6,
                borderRadius: 'xl',
                boxShadow: 3
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h4" fontWeight="600" align="center" component="h1">
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Sign in to your TrustVault account
                </Typography>
                <AuthForm type="login" className="animate-item" />
                {location.state && location.state.from && (
                  <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
                    Please log in to continue to {location.state.from.location?.pathname || 'the requested page'}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;