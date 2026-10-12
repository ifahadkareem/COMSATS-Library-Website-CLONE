'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
 * Modal — Liquid Knowledge Design System
 *
 * Enhanced dialog with smooth Framer Motion transitions,
 * size variants, and a polished layout.
 * ═══════════════════════════════════════════════════════════════ */

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[calc(100vw-4rem)] sm:max-h-[calc(100vh-4rem)]',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'rounded-2xl p-0 gap-0 overflow-hidden',
          sizeClasses[size],
          className
        )}
      >
        {/* Header area */}
        {(title || description || showClose) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4">
            <div className="space-y-1">
              {title && (
                <DialogTitle className="text-h3">{title}</DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-small">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showClose && (
              <button
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border/60 px-6 py-4 bg-surface-muted/50">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
