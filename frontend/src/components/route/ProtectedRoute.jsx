import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

  // If still checking auth, show loading
  if (isLoading) {
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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const { pathname, search, hash } = window.location;
    return <Navigate to="/login" replace state={{ from: pathname + search + hash }} />;
  }

  // If authenticated, render the protected routes
  return <Outlet />;
};

export default ProtectedRoute;