import { Box, Button, Typography, TextField, Link, Stack, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, register, clearError } from '../../store/authSlice';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from './Logo';
import ErrorToast from './ErrorToast';

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef(null);

  // Form validation schema based on type (login or register)
  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    ...(type === 'register' && {
      firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
      lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    })
  });

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  // Clear error when form is reset or unmounted
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useGSAP(() => {
    // Form entrance animation
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    
    // Input field animations on focus/blur
    const inputs = formRef.current.querySelectorAll('input');
    inputs.forEach(input => {
      gsap.fromTo(
        input,
          { scale: 0.95, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.3, 
          ease: 'power2.out',
          paused: true
        }
      ).progress(0.5); // Start at midpoint
      
      input.addEventListener('focus', () => {
        gsap.to(input, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      });
      
      input.addEventListener('blur', () => {
        gsap.to(input, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    });
    
    // Button hover animation
    const submitButton = formRef.current.querySelector('button[type="submit"]');
    if (submitButton) {
      gsap.fromTo(
        submitButton,
          { scale: 1 },
        { 
          scale: 1.05, 
          duration: 0.3, 
          ease: 'power2.out',
          paused: true
        }
      ).progress(0.5);
      
      submitButton.addEventListener('mouseenter', () => {
        gsap.to(submitButton, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
      });
      
      submitButton.addEventListener('mouseleave', () => {
        gsap.to(submitButton, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    }
    
    // Error shake animation
    const errorElements = formRef.current.querySelectorAll('.Mui-error');
    errorElements.forEach(error => {
      gsap.fromTo(
        error,
          { x: 0 },
        { 
          x: [{ value: -8 }, { value: 8 }, { value: -8 }, { value: 8 }, { value: 0 }],
          duration: 0.4,
          ease: 'power2.out',
          paused: true
        }
      ).progress(0.5);
      
      // Trigger shake when error appears
      const observer = new MutationObserver(() => {
        if (error.offsetParent !== null) { // Element is visible
          gsap.to(error, { 
            x: [{ value: -8 }, { value: 8 }, { value: -8 }, { value: 8 }, { value: 0 }],
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
      
      observer.observe(error, { attributes: true, childList: true, subtree: true });
    });
  }, { scope: formRef });

    const onSubmit = async (data) => {
    if (type === 'login') {
      dispatch(login({ email: data.email, password: data.password }));
    } else if (type === 'register') {
      // Remove confirmPassword and combine firstName/lastName into name for backend
      const { confirmPassword, firstName, lastName, ...registrationData } = data;
      const name = `${firstName} ${lastName}`.trim();
      dispatch(register({ ...registrationData, email: data.email, password: data.password, name }));
    }
  };

  // Handle successful submission (redirect to dashboard)
  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate('/dashboard');
    }
  }, [isSubmitSuccessful, navigate]);

  return (
    <Box 
      ref={formRef}
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      noValidate 
      sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Stack spacing={3}>
        <Logo />
        <Typography variant="h5" fontWeight="600" align="center" component="h2">
          {type === 'login' ? 'Sign In to TrustVault' : 'Create Account'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {type === 'login' ? 'Access your secure banking dashboard' : 'Join the future of secure banking'}
        </Typography>

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          {...formRegister('email')}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          autoComplete="email"
          sx={{ mt: 1 }}
          className="animate-item"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...formRegister('password')}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          autoComplete="current-password"
          sx={{ mt: 1 }}
          className="animate-item"
        />

        {type === 'register' && (
          <>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              {...formRegister('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ''}
              autoComplete="given-name"
              sx={{ mt: 1 }}
              className="animate-item"
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              {...formRegister('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
              autoComplete="family-name"
              sx={{ mt: 1 }}
              className="animate-item"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...formRegister('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              autoComplete="new-password"
              sx={{ mt: 1 }}
              className="animate-item"
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, disabled: { opacity: 0.8 }, '&:hover': { transform: 'scale(1.05)' } }}
          disabled={isSubmitSuccessful}
          className="animate-item"
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        <Stack direction="row" justifyContent="center" mt={3} sx={{ flexWrap: 'wrap' }}>
          {type === 'login' && (
            <>
              <Link
                component="a"
                href="/forgot-password"
                underline="none"
                sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
              >
                Forgot Password?
              </Link>
              <Box sx={{ width: 1, height: '1.25rem', mx: 2, bgcolor: 'divider' }} />
              <Link
                component="a"
                href="/register"
                underline="none"
                sx={{ fontSize: '0.875rem', color: 'primary.main' }}
              >
                Don't have an account? Register
              </Link>
            </>
          )}
          {type === 'register' && (
            <Link
              component="a"
              href="/login"
              underline="none"
              sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
            >
              Already have an account? Sign In
            </Link>
          )}
        </Stack>
      </Stack>
      <ErrorToast />
    </Box>
  );
};

export default AuthForm;