import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/* ═══════════════════════════════════════════════════════════════
 * LoadingSkeleton — Liquid Knowledge Design System
 *
 * Themed skeleton loaders that match the design system's
 * card and layout patterns. These replace generic pulse
 * animations with contextual, visually coherent placeholders.
 * ═══════════════════════════════════════════════════════════════ */

export interface LoadingSkeletonProps {
  variant?: 'card' | 'book-card' | 'table' | 'text' | 'stat' | 'page';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'card',
  count = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'page') {
    return (
      <div className={cn('space-y-8', className)}>
        {/* Page header */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-80" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'book-card') {
    return (
      <div className={cn('grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-border/40 p-5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Search row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        {/* Table header */}
        <Skeleton className="h-11 w-full rounded-xl" />
        {/* Table rows */}
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-2xl border border-border/40 p-5">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
