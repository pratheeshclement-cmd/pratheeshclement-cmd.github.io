import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastPriority = 'critical' | 'warning' | 'info' | 'success';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  priority: ToastPriority;
  timestamp: string;
}

interface NotificationContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([
    { id: 't1', title: 'Live System Sync Active', message: 'All analytics and system monitors connected.', priority: 'info', timestamp: 'Just now' },
  ]);

  const addToast = (toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const newToast: ToastItem = {
      ...toast,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // max 5

    // Auto dismiss after 5s for non-critical
    if (toast.priority !== 'critical') {
      setTimeout(() => {
        removeToast(newToast.id);
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Render Stack */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
        width: '100%',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                pointerEvents: 'auto',
                background: 'var(--dmos-card-elevated)',
                border: `1px solid ${
                  toast.priority === 'critical' ? 'var(--dmos-danger-border)'
                  : toast.priority === 'warning' ? 'var(--dmos-warning-border)'
                  : toast.priority === 'success' ? 'var(--dmos-success-border)'
                  : 'var(--dmos-border-strong)'
                }`,
                borderRadius: 12,
                padding: '14px 16px',
                boxShadow: 'var(--dmos-shadow-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div style={{ marginTop: 2, flexShrink: 0 }}>
                {toast.priority === 'critical' && <AlertCircle size={18} color="var(--dmos-danger)" />}
                {toast.priority === 'warning' && <AlertTriangle size={18} color="var(--dmos-warning)" />}
                {toast.priority === 'success' && <CheckCircle size={18} color="var(--dmos-success)" />}
                {toast.priority === 'info' && <Info size={18} color="var(--dmos-primary-light)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--dmos-text)' }}>{toast.title}</div>
                {toast.message && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', marginTop: 2, lineHeight: 1.4 }}>{toast.message}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--dmos-text-subtle)' }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within a NotificationProvider');
  return ctx;
};
