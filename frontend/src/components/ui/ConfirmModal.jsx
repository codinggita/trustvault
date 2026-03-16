import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel w-full max-w-md p-6"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
          >
            <h3 className="text-3xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-vault-muted">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="btn-secondary flex-1" type="button" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  tone === 'danger'
                    ? 'bg-vault-danger text-white hover:brightness-110'
                    : 'btn-primary text-vault-base'
                }`}
                type="button"
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

