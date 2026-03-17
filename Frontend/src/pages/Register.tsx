import { UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';
import { getApiErrorMessage } from '../utils/api';

export const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await register(email, password, name);
      toast.success('Your account is ready.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Registration failed. Please review your details and try again.',
        ),
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_30%)]" />
      <Card className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            <UserRoundPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              TrustVault
            </p>
            <h1 className="text-2xl font-semibold text-slate-50">
              Create your account
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            type="text"
            label="Full name"
            placeholder="Alex Johnson"
            value={name}
            onChange={setName}
            required
          />
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
            placeholder="At least 6 characters"
            value={password}
            onChange={setPassword}
            required
          />
          <Button type="submit" block loading={isLoading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already registered?{' '}
          <Link className="font-medium text-sky-300 hover:text-sky-200" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};
