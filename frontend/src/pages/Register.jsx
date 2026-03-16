import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import ConfirmModal from '../components/ui/ConfirmModal';
import { useAccountStore } from '../stores/accountStore';
import { useAuthStore } from '../stores/authStore';
import { registerSchema } from '../utils/validators';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: 'Weak', width: '33%', color: 'bg-vault-danger' };
  if (score <= 3) return { label: 'Strong', width: '68%', color: 'bg-vault-gold' };
  return { label: 'Excellent', width: '100%', color: 'bg-vault-success' };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const hydrateAccounts = useAccountStore((state) => state.hydrateAccounts);
  const [createdAccountNumber, setCreatedAccountNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const strength = getPasswordStrength(password || '');

  useEffect(() => {
    if (!showSuccess) {
      return undefined;
    }

    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1800);

    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  const onSubmit = async (values) => {
    try {
      const response = await registerUser(values);
      hydrateAccounts([response.data.account]);
      setCreatedAccountNumber(response.data.account.accountNumber);
      setShowSuccess(true);
      toast.success('Your account is ready.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-vault-radial px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-vault-gold/8 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.45em] text-vault-gold">TrustVault</p>
            <h1 className="mt-8 max-w-lg text-7xl leading-none">Open your vault in minutes.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-vault-muted">
              Private banking energy, modern onboarding, and a welcome balance from the treasury the
              moment you join.
            </p>
          </div>
          <div className="relative glass-panel max-w-md p-6">
            <ShieldCheck className="text-vault-gold" size={28} />
            <p className="mt-4 text-2xl font-semibold">
              "Designed to feel like wealth management, even on your first transfer."
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <motion.div
            className="w-full max-w-xl glass-panel p-8 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-vault-gold">Create Account</p>
            <h2 className="mt-4 text-5xl font-semibold">Join TrustVault</h2>
            <p className="mt-3 text-sm leading-7 text-vault-muted">
              Start with a secure login, instant account creation, and your initial ₹10,000 credit.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {[
                { label: 'Full Name', field: 'name', type: 'text' },
                { label: 'Email', field: 'email', type: 'email' },
                { label: 'Password', field: 'password', type: 'password' },
                { label: 'Confirm Password', field: 'confirmPassword', type: 'password' },
              ].map((input, index) => (
                <motion.div
                  key={input.field}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index }}
                >
                  <label className="mb-2 block text-sm text-vault-muted" htmlFor={input.field}>
                    {input.label}
                  </label>
                  <input
                    className="input-shell"
                    id={input.field}
                    type={input.type}
                    {...register(input.field)}
                  />
                  {errors[input.field] ? (
                    <p className="mt-2 text-xs text-vault-danger">{errors[input.field].message}</p>
                  ) : null}
                </motion.div>
              ))}

              <div>
                <div className="flex items-center justify-between text-xs text-vault-muted">
                  <span>Password strength</span>
                  <span>{strength.label}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/8">
                  <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                </div>
              </div>

              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Creating your vault...' : 'Open Account'}
                <ArrowRight className="ml-2" size={16} />
              </button>
            </form>

            <p className="mt-6 text-sm text-vault-muted">
              Already banking with us?{' '}
              <Link className="text-vault-goldSoft" to="/login">
                Sign in
              </Link>
            </p>
          </motion.div>
        </section>
      </div>

      <ConfirmModal
        isOpen={showSuccess}
        title="Account Created"
        description={`Your TrustVault account is live. Account number: ${createdAccountNumber}. We are redirecting you to the dashboard now.`}
        confirmLabel="Go to Dashboard"
        cancelLabel="Stay Here"
        onConfirm={() => navigate('/dashboard')}
        onCancel={() => setShowSuccess(false)}
      />
    </>
  );
}

