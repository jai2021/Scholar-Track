import React, { useEffect } from 'react';
import { AlertCircleIcon, XIcon, TrashIcon } from './Icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="neo-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div className="neo-modal-dialog" style={{ maxWidth: '440px' }}>
        <div className="neo-modal-header" style={{ backgroundColor: isDestructive ? '#ff6b6b' : 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isDestructive && (
              <span style={{ color: '#000000', display: 'inline-flex' }}>
                <AlertCircleIcon size={20} />
              </span>
            )}
            <h2 id="confirm-modal-title" className="neo-modal-title" style={{ color: isDestructive ? '#000000' : 'inherit' }}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="neo-icon-btn modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="neo-modal-body" style={{ padding: '1.5rem' }}>
          <p id="confirm-modal-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>
        </div>

        <div className="neo-modal-footer">
          <button
            type="button"
            className="neo-btn neo-btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`neo-btn ${isDestructive ? 'neo-btn-danger' : 'neo-btn-primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {isDestructive && <TrashIcon size={15} />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
