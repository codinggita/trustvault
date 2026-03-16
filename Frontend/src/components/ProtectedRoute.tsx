import type { PropsWithChildren, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps extends PropsWithChildren {
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

ProtectedRoute.displayName = 'ProtectedRoute';
