import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Toaster } from '../components/ui/Toaster';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <LogIn className="h-6 w-6 text-primary-400" />
          </div>
          <h2 className="ml-4 text-2xl font-bold text-primary-400">Welcome Back</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-400">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-400">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <a 
              href="/register"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign Up
            </a>
          </p>
        </div>
      </Card>
      <Toaster />
    </div>
  );
};