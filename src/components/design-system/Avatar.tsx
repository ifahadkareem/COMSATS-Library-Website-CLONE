'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Avatar — Liquid Knowledge Design System
 *
 * Enhanced avatar with size variants, status indicator,
 * and text fallback with initials.
 * ═══════════════════════════════════════════════════════════════ */

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
}

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

const statusColors = {
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-error',
  offline: 'bg-muted-foreground/40',
};

const statusSizes = {
  xs: 'size-1.5 border',
  sm: 'size-2 border',
  md: 'size-2.5 border-2',
  lg: 'size-3 border-2',
  xl: 'size-3.5 border-2',
};

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'overflow-hidden rounded-full bg-surface-muted flex items-center justify-center',
          'ring-2 ring-surface ring-offset-1 ring-offset-background',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
          />
        ) : initials ? (
          <span className="font-semibold text-muted-foreground select-none">
            {initials.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <span className="font-semibold text-muted-foreground/50 select-none">
            ?
          </span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-surface',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
