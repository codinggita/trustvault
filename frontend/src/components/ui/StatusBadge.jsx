const styles = {
  ACTIVE: 'border-vault-success/30 bg-vault-success/15 text-vault-success',
  COMPLETED: 'border-vault-success/30 bg-vault-success/15 text-vault-success',
  CREDIT: 'border-vault-success/30 bg-vault-success/15 text-vault-success',
  FROZEN: 'border-vault-gold/30 bg-vault-gold/15 text-vault-goldSoft',
  PENDING: 'border-vault-gold/30 bg-vault-gold/15 text-vault-goldSoft',
  CLOSED: 'border-vault-danger/30 bg-vault-danger/15 text-vault-danger',
  FAILED: 'border-vault-danger/30 bg-vault-danger/15 text-vault-danger',
  DEBIT: 'border-white/10 bg-white/10 text-vault-text',
};

export default function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.24em] ${
        styles[value] || 'border-white/10 bg-white/5 text-vault-muted'
      }`}
    >
      {value}
    </span>
  );
}

