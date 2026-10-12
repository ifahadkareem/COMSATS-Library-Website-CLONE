'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Card — Liquid Knowledge Design System
 *
 * Premium card with subtle elevation, hover lift, optional
 * glass effect, and layered section support.
 * ═══════════════════════════════════════════════════════════════ */

export interface DSCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'outlined' | 'navy';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  as?: React.ElementType;
}

export function DSCard({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  as: Component = 'div',
  className,
  children,
  ...props
}: DSCardProps) {
  const variantClasses = {
    default: 'bg-surface border border-border/80 shadow-soft',
    elevated: 'bg-surface border-0 shadow-elevated',
    glass: 'glass shadow-soft',
    outlined: 'bg-transparent border border-border/60',
    navy: 'bg-gradient-navy border border-navy/20 text-navy-foreground shadow-elevated',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <Component
      className={cn(
        'rounded-2xl transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        hoverable && 'hover:-translate-y-0.5 hover:shadow-elevated cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ── Card Header ── */

export interface DSCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

export function DSCardHeader({
  separator = false,
  className,
  children,
  ...props
}: DSCardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        separator && 'pb-4 mb-4 border-b border-border/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card Media ── */

export interface DSCardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'video' | 'square' | 'wide' | 'ultrawide';
  gradient?: boolean;
  overlay?: boolean;
}

export function DSCardMedia({
  aspectRatio = 'video',
  gradient = false,
  overlay = false,
  className,
  children,
  ...props
}: DSCardMediaProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
    ultrawide: 'aspect-[21/9]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-t-2xl',
        aspectClasses[aspectRatio],
        gradient && 'bg-gradient-subtle',
        className
      )}
      {...props}
    >
      {children}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      )}
    </div>
  );
}

/* ── Card Content ── */

export interface DSCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DSCardContent({ className, children, ...props }: DSCardContentProps) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  );
}

/* ── Card Footer ── */

export interface DSCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DSCardFooter({ className, children, ...props }: DSCardFooterProps) {
  return (
    <div
      className={cn('flex items-center gap-3 pt-4 mt-4 border-t border-border/40', className)}
      {...props}
    >
      {children}
    </div>
  );
}
