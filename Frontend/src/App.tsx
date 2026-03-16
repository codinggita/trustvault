import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Transfers } from './pages/Transfers';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Redirect to dashboard if authenticated, otherwise to login
  const redirectToAuth = !isAuthenticated;
  
  return (
    <BrowserRouter>
      {redirectToAuth ? (
        <Navigate to="/login" replace />
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="transfers" element={<Transfers />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;