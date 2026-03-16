import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAccountStore } from '../stores/accountStore';
import { useAuthStore } from '../stores/authStore';
import { loginSchema } from '../utils/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUser = useAuthStore((state) => state.login);
  const hydrateAccounts = useAccountStore((state) => state.hydrateAccounts);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      hydrateAccounts(response.data.accounts || []);
      toast.success('Welcome back to TrustVault.');
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      toast.error(error.response?.data?.message || 'Unable to sign you in.');
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-xl glass-panel p-8 sm:p-10"
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-vault-gold">Sign In</p>
          <h1 className="mt-4 text-5xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-sm leading-7 text-vault-muted">
            Step back into your TrustVault dashboard with secure, cookie-based authentication.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm text-vault-muted" htmlFor="email">
                Email
              </label>
              <input className="input-shell" id="email" type="email" {...register('email')} />
              {errors.email ? <p className="mt-2 text-xs text-vault-danger">{errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-vault-muted" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="input-shell pr-12"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  className="absolute inset-y-0 right-4 text-vault-muted"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-2 text-xs text-vault-danger">{errors.password.message}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between text-sm text-vault-muted">
              <label className="flex items-center gap-3">
                <input className="accent-vault-gold" type="checkbox" {...register('rememberMe')} />
                Remember me
              </label>
              <button className="text-vault-goldSoft" type="button" onClick={() => toast('Password reset UI only for now.')}>
                Forgot password?
              </button>
            </div>

            <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Unlocking your vault...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-vault-muted">
            Need an account?{' '}
            <Link className="text-vault-goldSoft" to="/register">
              Register here
            </Link>
          </p>
        </motion.div>
      </section>

      <section className="relative hidden overflow-hidden bg-vault-radial px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-bl from-vault-gold/8 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.45em] text-vault-gold">Private Access</p>
          <h2 className="mt-8 max-w-lg text-7xl leading-none">Where balance meets calm.</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-vault-muted">
            Review transfers, track movement, and manage your account status through a quieter,
            sharper interface.
          </p>
        </div>
        <div className="relative grid gap-4">
          {['Session restoration on app load', 'Animated balance analytics', 'Transfer references and filters'].map((item) => (
            <div key={item} className="glass-panel max-w-md px-5 py-4 text-sm text-vault-muted">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
