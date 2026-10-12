'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  BookmarkCheck,
  Heart,
  Bell,
  Clock,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Library,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
 * DashboardShell — Student/Faculty Dashboard Layout
 *
 * Desktop: fixed sidebar + scrollable main content
 * Mobile: slide-out drawer + stacked content
 *
 * This wraps all /dashboard/* pages. It is a client component
 * because it needs useState and pathname.
 * ═══════════════════════════════════════════════════════════════ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="size-5" /> },
  { href: '/dashboard/loans', label: 'My Loans', icon: <BookOpen className="size-5" /> },
  { href: '/dashboard/reservations', label: 'Reservations', icon: <BookmarkCheck className="size-5" /> },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: <Heart className="size-5" /> },
  { href: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="size-5" /> },
  { href: '/dashboard/activity', label: 'Activity', icon: <Clock className="size-5" /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <UserCircle className="size-5" /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  unreadCount,
  onClose,
}: {
  pathname: string;
  unreadCount: number;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Library className="size-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">JZ Library</p>
          <p className="text-[11px] text-muted-foreground">COMSATS Islamabad</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const badge = item.href === '/dashboard/notifications' && unreadCount > 0
            ? String(unreadCount)
            : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary/8 text-primary'
                  : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              )}
            >
              <span className={cn(
                'transition-colors',
                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
              {active && (
                <ChevronRight className="size-3.5 text-primary/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="border-t border-border/60 px-3 py-4 space-y-1">
        <Link
          href="/catalog"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <Library className="size-5" />
          <span>Browse Catalog</span>
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-error/8 hover:text-error"
        >
          <LogOut className="size-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  unreadCount = 0,
  userName,
}: {
  children: React.ReactNode;
  unreadCount?: number;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-[64px] lg:border-r border-border/60 bg-surface/80 backdrop-blur-sm">
        <SidebarContent pathname={pathname} unreadCount={unreadCount} />
      </aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            {!shouldReduceMotion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={closeMobile}
              />
            ) : (
              <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMobile} />
            )}

            {/* Drawer panel */}
            <motion.aside
              initial={shouldReduceMotion ? { x: 0 } : { x: -280 }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { x: 0 } : { x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-surface border-r border-border/60 shadow-elevated lg:hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</span>
                <button
                  onClick={closeMobile}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <SidebarContent pathname={pathname} unreadCount={unreadCount} onClose={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:pl-64">
        {/* Mobile header bar */}
        <div className="sticky top-[64px] z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-sm px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            <Menu className="size-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {NAV_ITEMS.find(i => isActive(pathname, i.href))?.label ?? 'Dashboard'}
            </p>
            {userName && <p className="text-xs text-muted-foreground truncate">{userName}</p>}
          </div>
          {unreadCount > 0 && (
            <Link href="/dashboard/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="size-4.5" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            </Link>
          )}
        </div>

        {/* Page content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
