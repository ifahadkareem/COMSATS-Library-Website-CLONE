import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
 * Toast — Liquid Knowledge Design System
 *
 * Lightweight toast notification with icon, message,
 * and dismiss button. Uses local state (no external provider).
 * ═══════════════════════════════════════════════════════════════ */

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'bottom-right' | 'top-right' | 'bottom-center';
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    borderClass: 'border-success/30',
    iconClass: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    borderClass: 'border-warning/30',
    iconClass: 'text-warning',
  },
  error: {
    icon: XCircle,
    borderClass: 'border-error/30',
    iconClass: 'text-error',
  },
  info: {
    icon: Info,
    borderClass: 'border-primary/30',
    iconClass: 'text-primary',
  },
};

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'top-right': 'top-6 right-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
};

export function ToastContainer({
  toasts,
  onDismiss,
  position = 'bottom-right',
  className,
}: ToastProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn('fixed z-[100] flex flex-col gap-2', positionClasses[position], className)}
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'flex items-start gap-3 bg-surface rounded-xl border shadow-elevated p-4 min-w-[320px] max-w-[420px]',
                config.borderClass
              )}
              role="alert"
            >
              <Icon className={cn('size-5 shrink-0 mt-0.5', config.iconClass)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── Hook ── */

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismiss };
}
