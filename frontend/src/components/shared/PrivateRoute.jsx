import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';

export default function PrivateRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return <LoadingSpinner label="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

