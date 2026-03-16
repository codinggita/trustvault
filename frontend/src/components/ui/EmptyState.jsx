import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 rounded-full border border-vault-gold/25 bg-vault-gold/10 p-4 text-vault-gold">
        <Inbox size={24} />
      </div>
      <h3 className="text-3xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-vault-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

