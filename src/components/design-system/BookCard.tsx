'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/* ═══════════════════════════════════════════════════════════════
 * BookCard — Liquid Knowledge Design System
 *
 * Specialized card for displaying library books with cover art,
 * metadata, availability status, and action buttons.
 * ═══════════════════════════════════════════════════════════════ */

export interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  coverAlt?: string;
  callNumber?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  status?: 'available' | 'checked-out' | 'reserved' | 'on-hold';
  category?: string;
  location?: string;
  href?: string;
  onAction?: () => void;
  actionLabel?: string;
  size?: 'compact' | 'default' | 'detailed';
  className?: string;
}

const statusConfig = {
  available: { label: 'Available', className: 'bg-success/10 text-success border-success/20' },
  'checked-out': { label: 'Checked Out', className: 'bg-warning/10 text-warning border-warning/20' },
  reserved: { label: 'Reserved', className: 'bg-primary/10 text-primary border-primary/20' },
  'on-hold': { label: 'On Hold', className: 'bg-error/10 text-error border-error/20' },
};

export function BookCard({
  title,
  author,
  coverUrl,
  coverAlt,
  callNumber,
  publisher,
  year,
  status,
  category,
  location,
  href,
  onAction,
  actionLabel = 'View Details',
  size = 'default',
  className,
}: BookCardProps) {
  const content = (
    <div
      className={cn(
        'group bg-surface rounded-2xl border border-border/70 overflow-hidden',
        'transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5',
        href && 'cursor-pointer',
        className
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-surface-muted overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <BookOpen className="size-12" strokeWidth={1} />
              <span className="text-xs font-medium">No Cover</span>
            </div>
          </div>
        )}

        {/* Status badge overlay */}
        {status && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className={cn('text-[11px] font-medium backdrop-blur-sm', statusConfig[status].className)}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
        )}

        {/* Category overlay */}
        {category && size === 'detailed' && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-[11px] font-medium backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn('p-4', size === 'compact' ? 'p-3' : 'p-4')}>
        <h3
          className={cn(
            'font-semibold text-foreground leading-snug line-clamp-2',
            size === 'compact' ? 'text-sm' : 'text-base'
          )}
        >
          {title}
        </h3>
        <p className={cn('mt-1 text-muted-foreground line-clamp-1', size === 'compact' ? 'text-xs' : 'text-sm')}>
          {author}
        </p>

        {/* Extended metadata for detailed size */}
        {size === 'detailed' && (
          <div className="mt-3 space-y-1.5">
            {publisher && (
              <p className="text-xs text-muted-foreground">
                {publisher}{year ? ` · ${year}` : ''}
              </p>
            )}
            {callNumber && (
              <p className="text-xs text-muted-foreground font-mono">
                {callNumber}
              </p>
            )}
            {location && (
              <p className="text-xs text-muted-foreground">📍 {location}</p>
            )}
          </div>
        )}

        {/* Action */}
        {(onAction || href) && (
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary-dark">
            {actionLabel}
            <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
