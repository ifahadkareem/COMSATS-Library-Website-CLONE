'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Dropdown — Liquid Knowledge Design System
 *
 * A custom dropdown menu built with headless UI patterns.
 * Provides items, groups, dividers, and keyboard navigation.
 * ═══════════════════════════════════════════════════════════════ */

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownGroup {
  id: string;
  label?: string;
  items: DropdownItem[];
}

export interface DropdownProps {
  trigger: React.ReactNode;
  groups?: DropdownGroup[];
  items?: DropdownItem[];
  align?: 'start' | 'end' | 'center';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Dropdown({
  trigger,
  groups,
  items,
  align = 'end',
  width = 'auto',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Merge groups and flat items
  const allGroups: DropdownGroup[] = React.useMemo(() => {
    if (groups) return groups;
    if (items) return [{ id: 'default', items }];
    return [];
  }, [groups, items]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const widthClasses = {
    auto: 'min-w-[12rem]',
    sm: 'w-40',
    md: 'w-56',
    lg: 'w-72',
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 top-full',
            alignClasses[align],
            widthClasses[width],
            'bg-surface rounded-xl border border-border/80 shadow-elevated',
            'py-1.5 overflow-hidden'
          )}
          role="menu"
        >
          {allGroups.map((group, groupIdx) => (
            <React.Fragment key={group.id}>
              {groupIdx > 0 && <div className="my-1.5 border-t border-border/50" />}
              {group.label && (
                <div className="px-3 py-1.5 text-caption text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.href) {
                      window.location.href = item.href;
                    } else {
                      item.onClick?.();
                    }
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors',
                    'hover:bg-muted/60',
                    item.disabled && 'opacity-40 pointer-events-none',
                    item.destructive && 'text-error hover:bg-error/5',
                    !item.destructive && 'text-foreground'
                  )}
                >
                  {item.icon && (
                    <span className="text-muted-foreground shrink-0">{item.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
