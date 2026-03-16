import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
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
          {/* Protected routes will go here */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;