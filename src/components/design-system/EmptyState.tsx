import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
 * EmptyState — Liquid Knowledge Design System
 *
 * Premium empty state with illustration area, headline,
 * description, and optional action button.
 * ═══════════════════════════════════════════════════════════════ */

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'compact';
  className?: string;
}

export function EmptyState({
  icon,
  title = 'No results found',
  message = 'There are no items to display at this time.',
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center text-center',
        variant === 'default' ? 'py-20' : 'py-12',
        className
      )}
    >
      {/* Icon area */}
      <div className="mb-5 flex items-center justify-center">
        {icon ? (
          <div className="text-muted-foreground/50">{icon}</div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted">
            <div className="h-6 w-6 rounded-full bg-border" />
          </div>
        )}
      </div>

      <h3 className="text-h3 text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-small">{message}</p>

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
