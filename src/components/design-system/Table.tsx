import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Table — Liquid Knowledge Design System
 *
 * Enhanced table with clean rows, hover states, and
 * sticky header support. Wraps shadcn/ui primitives.
 * ═══════════════════════════════════════════════════════════════ */

export interface DSTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DSTableProps<T> {
  columns: DSTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DSTable<T>({
  columns,
  data,
  keyExtractor,
  stickyHeader = false,
  onRowClick,
  emptyMessage = 'No data available.',
  className,
}: DSTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-border/70 bg-surface', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className={cn(
            'border-b border-border/70 bg-surface-muted/60 text-left',
            stickyHeader && 'sticky top-0 z-10'
          )}>
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-caption font-semibold uppercase tracking-wider text-muted-foreground',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-16 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border/40 last:border-b-0 transition-colors',
                  'hover:bg-primary/[0.02]',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      'px-4 py-3.5',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
