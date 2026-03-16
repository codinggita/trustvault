import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  show?: boolean;
}

export const Modal = ({ children, className = '', onClose }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`} onClick={onClose}>
      <div className={`relative bg-background-800/60 backdrop-blur-glass border border-border/20 rounded-glass p-6 max-w-2xl w-full mx-4`} onClick={(e) => e.stopPropagation()}>
        {children}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
};
Modal.displayName = 'Modal';