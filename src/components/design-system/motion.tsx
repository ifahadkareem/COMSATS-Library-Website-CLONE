'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Motion Primitives — Liquid Knowledge Design System
 *
 * Reusable Framer Motion animation wrappers that respect
 * prefers-reduced-motion. Use these for page entrances,
 * card hovers, staggered lists, and navigation transitions.
 * ═══════════════════════════════════════════════════════════════ */

// Shared spring transition
const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

// ── Page Entrance ──

export function PageEntrance({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Container ──

export function StaggerContainer({
  children,
  staggerDelay = 0.06,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={className}
        initial={shouldReduceMotion ? false : undefined}
        whileInView={shouldReduceMotion ? undefined : undefined}
        variants={
          shouldReduceMotion
            ? undefined
            : {
                show: {
                  transition: {
                    staggerChildren: staggerDelay,
                  },
                },
              }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── Stagger Item ──

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return shouldReduceMotion ? (
    <div className={className}>{children}</div>
  ) : (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

// ── Card Hover ──

export function CardHover({
  children,
  className,
  lift = 2,
}: {
  children: React.ReactNode;
  className?: string;
  lift?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -lift }}
      transition={gentleSpring}
      className={cn('transition-shadow duration-300 hover:shadow-elevated', className)}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In (viewport-triggered) ──

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const offsets = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Scale In (for modals, dialogs) ──

export function ScaleIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Search Suggestions Transition ──

export function SearchSuggestions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Navigation Transition (for page-to-page) ──

export function NavTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── useReducedMotion hook (re-exported for convenience) ──
export { useReducedMotion };
