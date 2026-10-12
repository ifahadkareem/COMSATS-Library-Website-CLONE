import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Badge — Liquid Knowledge Design System
 *
 * Enhanced badge with semantic variants (success, warning, error,
 * info) and soft/outlined style options.
 * ═══════════════════════════════════════════════════════════════ */

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info';
  soft?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-secondary/20',
  outline: 'bg-transparent text-foreground border-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-primary/10 text-primary border-primary/20',
};

const softClasses = {
  default: 'bg-primary/8 text-primary border-transparent',
  secondary: 'bg-secondary/8 text-secondary-foreground border-transparent',
  outline: 'bg-transparent text-muted-foreground border-transparent',
  success: 'bg-success/8 text-success border-transparent',
  warning: 'bg-warning/8 text-warning border-transparent',
  error: 'bg-error/8 text-error border-transparent',
  info: 'bg-primary/8 text-primary border-transparent',
};

export function Badge({
  children,
  variant = 'default',
  soft = false,
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs',
        soft ? softClasses[variant] : variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
