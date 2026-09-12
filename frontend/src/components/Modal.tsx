import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[6px_6px_0px_var(--shadow-color)] transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b-2 border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface-alt)]">
          <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="tactile-btn p-1.5 rounded text-[var(--text-main)] bg-[var(--bg-surface)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 text-[var(--text-main)]">{children}</div>
      </div>
    </div>
  );
};
