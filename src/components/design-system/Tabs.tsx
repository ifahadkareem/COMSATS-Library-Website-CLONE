'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
 * Tabs — Liquid Knowledge Design System
 *
 * Enhanced tabs with an animated underline indicator.
 * Supports default (pill) and underline variants.
 * ═══════════════════════════════════════════════════════════════ */

export interface DSTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: DSTab[];
 defaultTab?: string;
 variant?: 'pill' | 'underline';
 size?: 'sm' | 'md' | 'lg';
 fullWidth?: boolean;
 onChange?: (tabId: string) => void;
 className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'pill',
  size = 'md',
  fullWidth = false,
  onChange,
  className,
}: TabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = React.useState(defaultTab || tabs[0]?.id || '');
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const activeTab = tabs.find((t) => t.id === activeId);

  const updateIndicator = React.useCallback(() => {
    const el = tabRefs.current.get(activeId);
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        setIndicator({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    }
  }, [activeId]);

  React.useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  React.useEffect(() => {
    const observer = new ResizeObserver(updateIndicator);
    const parent = tabRefs.current.get(activeId)?.parentElement;
    if (parent) observer.observe(parent);
    return () => observer.disconnect();
  }, [activeId, updateIndicator]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  if (variant === 'underline') {
    return (
      <div className={cn('w-full', className)}>
        {/* Tab list */}
        <div className="relative flex border-b border-border/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              onClick={() => handleSelect(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center justify-center gap-2 px-4 font-medium transition-colors whitespace-nowrap',
                sizeClasses[size],
                activeId === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/70',
                tab.disabled && 'opacity-40 pointer-events-none',
                fullWidth && 'flex-1'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          {/* Animated underline */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute bottom-0 h-0.5 bg-primary rounded-full"
              initial={false}
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {shouldReduceMotion && (
            <div
              className="absolute bottom-0 h-0.5 bg-primary rounded-full"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
        </div>

        {/* Tab panels */}
        <div className="mt-6">
          {activeTab?.content}
        </div>
      </div>
    );
  }

  // Pill variant (default)
  return (
    <div className={cn('w-full', className)}>
      <div className="inline-flex items-center gap-1 rounded-xl bg-surface-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all whitespace-nowrap',
              sizeClasses[size],
              activeId === tab.id
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground/70',
              tab.disabled && 'opacity-40 pointer-events-none',
              fullWidth && 'flex-1'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab?.content}
      </div>
    </div>
  );
}
