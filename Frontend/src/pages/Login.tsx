import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';
import { getApiErrorMessage } from '../utils/api';

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(email, password);
      toast.success('Welcome back.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Login failed. Please check your credentials and try again.',
        ),
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_30%)]" />
      <Card className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              TrustVault
            </p>
            <h1 className="text-2xl font-semibold text-slate-50">Sign in</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            required
          />
          <Button type="submit" block loading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Need an account?{' '}
          <Link className="font-medium text-sky-300 hover:text-sky-200" to="/register">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
};
