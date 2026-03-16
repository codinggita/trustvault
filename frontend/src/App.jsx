import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/shared/ErrorBoundary';
import GlobalLoadingBar from './components/shared/GlobalLoadingBar';
import PageTransition from './components/shared/PageTransition';
import PrivateRoute from './components/shared/PrivateRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAccountStore } from './stores/accountStore';
import { useAuthStore } from './stores/authStore';
import { useTransactionStore } from './stores/transactionStore';

const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const AccountsPage = lazy(() => import('./pages/Accounts'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const LandingPage = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./pages/Login'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const RegisterPage = lazy(() => import('./pages/Register'));
const TransactionsPage = lazy(() => import('./pages/Transactions'));
const TransferPage = lazy(() => import('./pages/Transfer'));

function SessionBootstrap({ children }) {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  useEffect(() => {
    let isActive = true;

    const boot = async () => {
      try {
        const response = await useAuthStore.getState().fetchMe();
        if (isActive) {
          useAccountStore.getState().hydrateAccounts(response.data.accounts);
        }
      } catch (_error) {
        if (isActive) {
          useAccountStore.getState().clear();
          useTransactionStore.getState().clear();
        }
      }
    };

    const handleUnauthorized = () => {
      useAuthStore.getState().clearAuth();
      useAccountStore.getState().clear();
      useTransactionStore.getState().clear();
    };

    boot();
    window.addEventListener('trustvault:unauthorized', handleUnauthorized);

    return () => {
      isActive = false;
      window.removeEventListener('trustvault:unauthorized', handleUnauthorized);
    };
  }, []);

  if (isBootstrapping) {
    return <LoadingSpinner />;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              }
            />
            <Route
              path="accounts"
              element={
                <PageTransition>
                  <AccountsPage />
                </PageTransition>
              }
            />
            <Route
              path="transfer"
              element={
                <PageTransition>
                  <TransferPage />
                </PageTransition>
              }
            />
            <Route
              path="transactions"
              element={
                <PageTransition>
                  <TransactionsPage />
                </PageTransition>
              }
            />
            <Route
              path="profile"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SessionBootstrap>
          <GlobalLoadingBar />
          <Suspense fallback={<LoadingSpinner label="Loading your experience..." />}>
            <AnimatedRoutes />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#F6F0E3',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
        </SessionBootstrap>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
