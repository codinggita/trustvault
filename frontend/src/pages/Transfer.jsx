import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import EmptyState from '../components/ui/EmptyState';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useAccountStore } from '../stores/accountStore';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import { generateIdempotency } from '../utils/generateIdempotency';
import { transferSchema } from '../utils/validators';

const steps = ['Details', 'Review', 'Success'];

export default function TransferPage() {
  const accounts = useAccountStore((state) => state.accounts);
  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const transferMoney = useTransactionStore((state) => state.transfer);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: '',
      toAccount: '',
      amount: '',
      description: '',
      idempotencyKey: generateIdempotency(),
    },
  });

  useEffect(() => {
    fetchAccounts().catch(() => null);
    const storedRecipients = JSON.parse(localStorage.getItem('trustvault_recent_recipients') || '[]');
    setRecentRecipients(storedRecipients);
  }, [fetchAccounts]);

  useEffect(() => {
    if (accounts[0]?._id) {
      setValue('fromAccountId', accounts[0]._id);
    }
  }, [accounts, setValue]);

  const sourceAccountId = watch('fromAccountId');
  const amount = Number(watch('amount') || 0);
  const selectedSourceAccount = accounts.find((account) => account._id === sourceAccountId) || accounts[0];
  const remainingBalance = Number((Number(selectedSourceAccount?.balance || 0) - amount).toFixed(2));

  const handleDetailsSubmit = (values) => {
    setDraft(values);
    setStep(2);
  };

  const persistRecipient = (accountNumber) => {
    const nextRecipients = [accountNumber, ...recentRecipients.filter((item) => item !== accountNumber)].slice(0, 5);
    setRecentRecipients(nextRecipients);
    localStorage.setItem('trustvault_recent_recipients', JSON.stringify(nextRecipients));
  };

  const handleConfirmTransfer = async () => {
    setIsProcessingTransfer(true);
    try {
      const response = await transferMoney(draft);
      setReceipt(response.data);
      persistRecipient(draft.toAccount);
      await fetchAccounts();
      await fetchTransactions({ page: 1, limit: 10 });
      reset({
        fromAccountId: selectedSourceAccount?._id || '',
        toAccount: '',
        amount: '',
        description: '',
        idempotencyKey: generateIdempotency(),
      });
      setStep(3);
      toast.success('Transfer completed successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed.');
    } finally {
      setIsProcessingTransfer(false);
    }
  };

  const handleStartNew = () => {
    setStep(1);
    setDraft(null);
    setReceipt(null);
    setValue('idempotencyKey', generateIdempotency());
  };

  if (!accounts.length) {
    return (
      <EmptyState
        title="No funded account available"
        description="Your transfer wizard needs at least one active account before funds can move."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Transfer Wizard</p>
        <h2 className="mt-3 text-5xl">Move money with intention</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`rounded-2xl border px-4 py-4 text-sm ${
              step === index + 1
                ? 'border-vault-gold/40 bg-vault-gold/10 text-vault-text'
                : 'border-white/10 bg-white/5 text-vault-muted'
            }`}
          >
            Step {index + 1}: {label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <GlassCard className="grid gap-6 p-7 xl:grid-cols-[1fr_0.75fr]">
              <form className="space-y-5" onSubmit={handleSubmit(handleDetailsSubmit)}>
                <div>
                  <label className="mb-2 block text-sm text-vault-muted" htmlFor="fromAccountId">
                    Source account
                  </label>
                  <select className="input-shell" id="fromAccountId" {...register('fromAccountId')}>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountNumber} - {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-vault-muted" htmlFor="toAccount">
                    Recipient account number
                  </label>
                  <input className="input-shell" id="toAccount" {...register('toAccount')} />
                  {errors.toAccount ? <p className="mt-2 text-xs text-vault-danger">{errors.toAccount.message}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-vault-muted" htmlFor="amount">
                    Amount
                  </label>
                  <input className="input-shell" id="amount" step="0.01" type="number" {...register('amount')} />
                  {errors.amount ? <p className="mt-2 text-xs text-vault-danger">{errors.amount.message}</p> : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-vault-muted" htmlFor="description">
                    Description
                  </label>
                  <textarea className="input-shell min-h-[120px] resize-none" id="description" {...register('description')} />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-vault-muted">
                  <p>Idempotency key</p>
                  <p className="mt-2 break-all text-vault-text">{watch('idempotencyKey')}</p>
                </div>

                <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                  Review Transfer
                  <ArrowRight className="ml-2" size={16} />
                </button>
              </form>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-vault-gold/20 bg-black/20 p-6">
                  <p className="text-sm text-vault-muted">Available balance</p>
                  <p className="mt-3 text-4xl font-semibold text-gradient">{formatCurrency(selectedSourceAccount?.balance)}</p>
                  <p className="mt-4 text-sm text-vault-muted">
                    Remaining after transfer: {formatCurrency(remainingBalance)}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-vault-gold">Recent Recipients</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {recentRecipients.length ? (
                      recentRecipients.map((recipient) => (
                        <button
                          key={recipient}
                          className="btn-secondary"
                          type="button"
                          onClick={() => setValue('toAccount', recipient)}
                        >
                          {recipient}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-vault-muted">Your recent recipients will appear here after a successful transfer.</p>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <GlassCard className="p-7">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">Review Details</p>
                  <h3 className="mt-4 text-5xl">Confirm your transfer</h3>
                  <div className="mt-8 space-y-4">
                    {[
                      ['From', selectedSourceAccount?.accountNumber],
                      ['To', draft?.toAccount],
                      ['Amount', formatCurrency(draft?.amount)],
                      ['Description', draft?.description || 'No description'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-vault-muted">{label}</p>
                        <p className="mt-3 text-lg text-vault-text">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-vault-gold/20 bg-white/5 p-6">
                  <p className="text-sm text-vault-muted">Reference preview</p>
                  <p className="mt-3 break-all text-vault-text">{draft?.idempotencyKey}</p>
                  <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-vault-muted">Post-transfer balance</p>
                    <p className="mt-3 text-4xl font-semibold text-gradient">{formatCurrency(remainingBalance)}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button className="btn-primary" disabled={isProcessingTransfer} type="button" onClick={handleConfirmTransfer}>
                      {isProcessingTransfer ? 'Processing...' : 'Confirm Transfer'}
                    </button>
                    <button className="btn-secondary" type="button" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2" size={16} />
                      Back to Edit
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : null}

        {step === 3 ? (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <GlassCard className="relative overflow-hidden p-8 text-center">
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={index}
                    className="absolute h-2 w-2 rounded-full bg-vault-gold/70"
                    style={{
                      left: `${8 + index * 5}%`,
                      top: `${10 + (index % 5) * 14}%`,
                      opacity: 0.55,
                    }}
                  />
                ))}
              </div>
              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-vault-success/30 bg-vault-success/12 text-vault-success">
                  <CheckCircle2 size={34} />
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.4em] text-vault-gold">Transfer Complete</p>
                <h3 className="mt-4 text-5xl">Funds moved successfully</h3>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-vault-muted">
                  {formatCurrency(receipt?.transaction?.amount)} was sent to {receipt?.receiverAccountNumber}. Your transaction reference is ready below.
                </p>

                <div className="mx-auto mt-8 max-w-lg rounded-[28px] border border-white/10 bg-black/20 p-6 text-left">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-vault-muted">Status</span>
                    <StatusBadge value={receipt?.transaction?.status} />
                  </div>
                  <p className="mt-4 text-sm text-vault-muted">Reference ID</p>
                  <p className="mt-2 break-all text-vault-text">{receipt?.transaction?.referenceId}</p>
                  <p className="mt-4 text-sm text-vault-muted">Completed at</p>
                  <p className="mt-2 text-vault-text">{formatDateTime(receipt?.transaction?.createdAt)}</p>
                </div>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button className="btn-primary" type="button" onClick={handleStartNew}>
                    New Transfer
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => setStep(2)}>
                    View Review
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
