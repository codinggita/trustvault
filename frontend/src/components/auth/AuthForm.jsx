import { Box, Button, Typography, TextField, Link, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, register, clearError } from '../../store/authSlice';
import { useEffect } from 'react';
import Logo from './Logo';
import ErrorToast from './ErrorToast';

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const onSubmit = async (data) => {
    if (type === 'login') {
      dispatch(login({ email: data.email, password: data.password }));
    } else if (type === 'register') {
      // Remove confirmPassword from data before sending to backend
      const { confirmPassword, ...registrationData } = data;
      dispatch(register(registrationData));
    }
  };

  // Handle successful submission (redirect to dashboard)
  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate('/dashboard');
    }
  }, [isSubmitSuccessful, navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
      <Stack spacing={2}>
        <Logo />
        <Typography variant="h5" align="center" gutterBottom>
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
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              {...formRegister('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
              autoComplete="family-name"
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
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, disabled: { opacity: 0.8 } }}
          disabled={isSubmitSuccessful}
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        <Stack direction="row" justifyContent="center" mt={2} sx={{ flexWrap: 'wrap' }}>
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