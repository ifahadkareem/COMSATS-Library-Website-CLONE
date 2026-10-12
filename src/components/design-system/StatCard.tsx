'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
 * StatCard — Liquid Knowledge Design System
 *
 * Premium stat display with icon, value, label, trend indicator,
 * and subtle entrance animation.
 * ═══════════════════════════════════════════════════════════════ */

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'navy' | 'accent';
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const variantClasses = {
    default: 'bg-surface border border-border/70 shadow-soft',
    navy: 'bg-gradient-navy border border-navy/20 text-navy-foreground shadow-elevated',
    accent: 'bg-primary/[0.04] border border-primary/10 shadow-soft',
  };

  const iconWrapperClasses = {
    default: 'bg-primary/8 text-primary',
    navy: 'bg-white/10 text-navy-foreground',
    accent: 'bg-primary/10 text-primary',
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex items-center justify-center rounded-xl p-2.5', iconWrapperClasses[variant])}>
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend.isPositive
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className={cn(
          'text-3xl font-bold tracking-tight',
          variant === 'navy' ? 'text-navy-foreground' : 'text-foreground'
        )}>
          {value}
        </div>
        <p className={cn(
          'mt-1 text-sm',
          variant === 'navy' ? 'text-navy-foreground/60' : 'text-muted-foreground'
        )}>
          {label}
        </p>
      </div>
    </motion.div>
  );
}
