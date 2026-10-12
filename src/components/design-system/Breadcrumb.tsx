import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Breadcrumb — Liquid Knowledge Design System
 *
 * Clean breadcrumb navigation with home icon, chevron
 * separators, and a current-page indicator.
 * ═══════════════════════════════════════════════════════════════ */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
 showHome?: boolean;
 homeHref?: string;
 className?: string;
}

export function Breadcrumb({
  items,
  showHome = true,
  homeHref = '/',
  className,
}: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: homeHref }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight className="size-3.5 text-muted-foreground/50 mx-1" />
              )}
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {idx === 0 && showHome ? (
                    <Home className="size-3.5" />
                  ) : (
                    item.label
                  )}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
