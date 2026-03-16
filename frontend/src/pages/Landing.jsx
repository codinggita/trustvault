import { motion } from 'framer-motion';
import { LockKeyhole, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';

const featureCards = [
  {
    title: 'Security',
    description: 'HTTP-only auth cookies, JWT session control, and transaction-safe ledger operations.',
    icon: LockKeyhole,
  },
  {
    title: 'Speed',
    description: 'Fast transfers, focused workflows, and a dashboard designed to surface what matters instantly.',
    icon: TrendingUp,
  },
  {
    title: 'Transparency',
    description: 'Reference IDs, live balances, and detailed transaction history without the usual banking clutter.',
    icon: Sparkles,
  },
];

const stats = [
  { label: 'Transferred', value: '₹2.4Cr+' },
  { label: 'Users', value: '50K+' },
  { label: 'Uptime', value: '99.99%' },
];

const heroPhrases = ['Banking. Reimagined.', 'Security. Elevated.', 'Trust. In Motion.'];

export default function LandingPage() {
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const phrase = heroPhrases[phraseIndex];
    let characterIndex = 0;
    const timer = setInterval(() => {
      characterIndex += 1;
      setTypedText(phrase.slice(0, characterIndex));
      if (characterIndex === phrase.length) {
        clearInterval(timer);
        setTimeout(() => {
          setPhraseIndex((current) => (current + 1) % heroPhrases.length);
          setTypedText('');
        }, 1600);
      }
    }, 65);

    return () => clearInterval(timer);
  }, [phraseIndex]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-32 h-40 w-40 rounded-full bg-vault-gold/10 blur-3xl" />
        <div className="absolute right-[12%] top-[18rem] h-64 w-64 rounded-full bg-vault-goldSoft/8 blur-3xl" />
        <div className="absolute bottom-24 left-1/2 h-28 w-28 -translate-x-1/2 rotate-45 border border-vault-gold/20 bg-vault-gold/5" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <section className="grid items-center gap-16 py-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              className="text-sm uppercase tracking-[0.5em] text-vault-gold"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Premium Digital Banking
            </motion.p>
            <motion.h1
              className="mt-6 max-w-3xl text-6xl leading-[0.94] sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <span className="text-gradient">{typedText}</span>
              <span className="animate-pulse text-vault-gold">|</span>
            </motion.h1>
            <motion.p
              className="mt-8 max-w-xl text-lg leading-8 text-vault-muted"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              TrustVault blends premium design with secure transactions, transparent ledgers, and
              a banking flow that finally feels modern.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
            >
              <Link className="btn-primary" to="/register">
                Open Account
              </Link>
              <Link className="btn-secondary" to="/login">
                Sign In
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="glass-panel relative overflow-hidden p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
          >
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full border border-vault-gold/30 bg-vault-gold/10 blur-md" />
            <p className="text-xs uppercase tracking-[0.35em] text-vault-muted">Private Vault</p>
            <h2 className="mt-5 max-w-sm text-5xl leading-tight">Luxury-grade banking for everyday movement.</h2>
            <div className="mt-8 space-y-4">
              {[
                'Protected sessions with HTTP-only cookies',
                'Atomic transfer ledger with transaction references',
                'Refined analytics for credits, debits, and trends',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-vault-muted">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 py-8 md:grid-cols-3" id="features">
          {featureCards.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={title}
              className="glass-panel p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-vault-gold/20 bg-vault-gold/10 text-vault-gold">
                <Icon size={20} />
              </div>
              <h3 className="mt-6 text-4xl">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-vault-muted">{description}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 py-12 md:grid-cols-3" id="stats">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-panel p-8 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="text-4xl font-semibold text-gradient">{stat.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.32em] text-vault-muted">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <section className="glass-panel mt-8 px-8 py-12 text-center" id="security">
          <p className="text-sm uppercase tracking-[0.45em] text-vault-gold">Built For Trust</p>
          <h2 className="mt-5 text-5xl">A polished stack underneath the polish.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-vault-muted">
            JWT sessions, Mongo-backed ledgers, validated requests, transfer idempotency, and a
            design language that makes premium finance feel calm instead of cold.
          </p>
        </section>
      </main>
    </div>
  );
}

