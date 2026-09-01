import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'error':
        return <AlertCircle size={20} color="#D94B4B" />;
      case 'warning':
        return <AlertCircle size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#0393F4" />;
    }
  };

  return (
    <div className={`toast-banner toast-${toast.type}`} id="toast-banner">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-body">
        {toast.title && <h4 className="toast-title">{toast.title}</h4>}
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="btn-icon" onClick={onDismiss} id="toast-dismiss">
        <X size={16} />
      </button>

      <style>{`
        .toast-banner {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: #FFFFFF;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
          z-index: 2000;
          max-width: 420px;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-success { border-left: 4px solid var(--color-success); }
        .toast-error { border-left: 4px solid var(--color-error); }
        .toast-warning { border-left: 4px solid var(--color-warning); }
        .toast-info { border-left: 4px solid var(--color-primary); }

        .toast-body {
          flex: 1;
        }

        .toast-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-navy);
          margin-bottom: 0.15rem;
        }

        .toast-message {
          font-size: 13px;
          color: var(--color-navy);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
