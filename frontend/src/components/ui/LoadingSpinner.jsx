import { motion } from 'framer-motion';

export default function LoadingSpinner({ label = 'Securing your vault...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-vault-gold/30 bg-white/5 shadow-glow"
          animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <span className="font-display text-3xl text-gradient">TV</span>
        </motion.div>
        <p className="text-sm text-vault-muted">{label}</p>
      </div>
    </div>
  );
}

