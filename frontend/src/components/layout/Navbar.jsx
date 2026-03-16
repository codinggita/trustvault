import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 backdrop-blur-xl"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link className="flex items-center gap-3" to="/">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-vault-gold/25 bg-white/5">
          <span className="font-display text-2xl text-gradient">TV</span>
        </div>
        <div>
          <p className="font-display text-2xl">TrustVault</p>
          <p className="text-xs uppercase tracking-[0.35em] text-vault-muted">Premium Banking</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-vault-muted md:flex">
        <a href="#features">Features</a>
        <a href="#stats">Stats</a>
        <a href="#security">Security</a>
      </nav>

      <div className="flex items-center gap-3">
        <Link className="btn-secondary hidden sm:inline-flex" to="/login">
          Sign In
        </Link>
        <Link className="btn-primary" to="/register">
          Open Account
          <ArrowRight className="ml-2" size={16} />
        </Link>
      </div>
    </motion.header>
  );
}

