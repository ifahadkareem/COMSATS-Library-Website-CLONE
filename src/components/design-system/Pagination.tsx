'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Pagination — Liquid Knowledge Design System
 *
 * Clean pagination with page numbers, prev/next, and
 * truncation with ellipsis for large page counts.
 * ═══════════════════════════════════════════════════════════════ */

export interface PaginationProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
 siblingCount?: number;
 showInfo?: boolean;
 className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showInfo = false,
  className,
}: PaginationProps) {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const generatePages = React.useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const siblings = siblingCount;

    // Total page numbers to show
    const totalNumbers = siblings * 2 + 3; // siblings + first + last + current
    const totalBlocks = totalNumbers + 2; // + 2 for ellipses

    if (total <= totalBlocks) {
      return range(1, total);
    }

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, total);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, 3 + 2 * siblings);
      return [...leftRange, 'ellipsis-right', total];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(total - (2 + 2 * siblings), total);
      return [1, 'ellipsis-left', ...rightRange];
    }

    return [1, 'ellipsis-left', ...range(leftSibling, rightSibling), 'ellipsis-right', total];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-between gap-4', className)}
    >
      {/* Info text */}
      {showInfo && (
        <p className="text-small hidden sm:block">
          Page {currentPage} of {totalPages}
        </p>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'flex items-center justify-center size-9 rounded-lg transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            'disabled:opacity-30 disabled:pointer-events-none'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page numbers */}
        {generatePages.map((page, idx) => {
          if (typeof page === 'string') {
            return (
              <span key={page} className="flex items-center justify-center size-9">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'flex items-center justify-center size-9 rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'flex items-center justify-center size-9 rounded-lg transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            'disabled:opacity-30 disabled:pointer-events-none'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
