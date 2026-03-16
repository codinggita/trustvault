import { useState } from 'react';
import toast from 'react-hot-toast';

import ConfirmModal from '../components/ui/ConfirmModal';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useAccountStore } from '../stores/accountStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const accounts = useAccountStore((state) => state.accounts);
  const updateStatus = useAccountStore((state) => state.updateStatus);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const account = accounts[0];

  const handleCloseAccount = async () => {
    if (!account) {
      setShowCloseModal(false);
      return;
    }

    if (!user?.isSystemUser) {
      toast('Close account is presented as a premium UI flow. Admin approval is still required.');
      setShowCloseModal(false);
      return;
    }

    try {
      await updateStatus(account._id, 'CLOSED');
      await fetchAccounts();
      toast.success('Account closed successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to close account.');
    } finally {
      setShowCloseModal(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Profile</p>
          <h2 className="mt-3 text-5xl">Identity and security</h2>
        </div>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="p-7">
            <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Member Profile</p>
            <div className="mt-6 rounded-[28px] border border-white/10 bg-black/20 p-6">
              <p className="text-sm text-vault-muted">Full name</p>
              <p className="mt-2 text-3xl font-semibold">{user?.name}</p>
              <p className="mt-6 text-sm text-vault-muted">Email</p>
              <p className="mt-2 text-vault-text">{user?.email}</p>
              <p className="mt-6 text-sm text-vault-muted">Member since</p>
              <p className="mt-2 text-vault-text">{formatDate(user?.createdAt)}</p>
            </div>

            {account ? (
              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-vault-muted">Primary account</p>
                    <p className="mt-2 text-xl text-vault-text">{account.accountNumber}</p>
                  </div>
                  <StatusBadge value={account.status} />
                </div>
                <p className="mt-6 text-4xl font-semibold text-gradient">{formatCurrency(account.balance)}</p>
              </div>
            ) : null}
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-7">
              <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Change Password</p>
              <div className="mt-6 grid gap-4">
                {['Current password', 'New password', 'Confirm password'].map((label) => (
                  <div key={label}>
                    <label className="mb-2 block text-sm text-vault-muted">{label}</label>
                    <input className="input-shell" type="password" />
                  </div>
                ))}
                <button
                  className="btn-primary mt-2 w-full"
                  type="button"
                  onClick={() => toast('Password update is a UI-only section in this build.')}
                >
                  Update Password
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-7">
              <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Security Center</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-vault-muted">Active Sessions</p>
                  <p className="mt-3 text-3xl font-semibold">2</p>
                  <p className="mt-2 text-sm text-vault-muted">Web dashboard and current browser session.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-vault-muted">Login History</p>
                  <p className="mt-3 text-3xl font-semibold">Today</p>
                  <p className="mt-2 text-sm text-vault-muted">Latest sign-in from your current network.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-vault-danger/25 p-7">
              <p className="text-sm uppercase tracking-[0.35em] text-vault-danger">Danger Zone</p>
              <h3 className="mt-4 text-4xl">Close account</h3>
              <p className="mt-4 text-sm leading-7 text-vault-muted">
                This is intentionally gated. Regular users see the confirmation flow, while system users can execute the status change directly.
              </p>
              <button
                className="mt-6 rounded-full bg-vault-danger px-5 py-3 text-sm font-semibold text-white"
                type="button"
                onClick={() => setShowCloseModal(true)}
              >
                Close Account
              </button>
            </GlassCard>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={showCloseModal}
        title="Close Account"
        description="This action will move the account to CLOSED status. Continue only if you are certain."
        tone="danger"
        confirmLabel="Close Account"
        onConfirm={handleCloseAccount}
        onCancel={() => setShowCloseModal(false)}
      />
    </>
  );
}
