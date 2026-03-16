import { AnimatePresence, motion } from 'framer-motion';

import { useUiStore } from '../../stores/uiStore';

export default function GlobalLoadingBar() {
  const pendingRequests = useUiStore((state) => state.pendingRequests);

  return (
    <AnimatePresence>
      {pendingRequests > 0 ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-vault-gold via-vault-goldSoft to-transparent"
          initial={{ opacity: 0, scaleX: 0.2, transformOrigin: 'left' }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      ) : null}
    </AnimatePresence>
  );
}

