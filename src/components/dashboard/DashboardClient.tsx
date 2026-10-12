'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StatCard, PageEntrance, StaggerContainer, StaggerItem, EmptyState } from '@/components/design-system';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  BookmarkCheck,
  Heart,
  Bell,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Clock,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
 * DashboardClient — Student Dashboard Overview
 *
 * Displays: Welcome, stats grid, recent loans, quick links,
 * and actionable widgets. Fetched data is passed as props
 * from the server component to avoid client fetching on load.
 * ═══════════════════════════════════════════════════════════════ */

interface DashboardStats {
  borrowedCount: number;
  dueSoonCount: number;
  overdueCount: number;
  reservationCount: number;
  wishlistCount: number;
  totalFines: number;
  unreadNotifs: number;
}

interface RecentLoan {
  id: string;
  bookTitle: string;
  bookId: string;
  authors: string;
  coverImage: string | null;
  borrowedAt: string;
  dueAt: string;
  status: string;
  daysUntilDue: number;
}

export function DashboardClient({
  stats,
  recentLoans,
  userName,
  userEmail,
  userRole,
}: {
  stats: DashboardStats;
  recentLoans: RecentLoan[];
  userName: string;
  userEmail: string;
  userRole: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenew = async (loanId: string) => {
    setRenewingId(loanId);
    try {
      const res = await fetch('/api/dashboard/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Loan renewed for 14 more days');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to renew');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setRenewingId(null);
    }
  };

  const firstName = userName.split(' ')[0] || 'Student';
  const greeting = getGreeting();
  const roleLabel = userRole === 'FACULTY' ? 'Faculty' : 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <PageEntrance>
        <div className="rounded-2xl bg-gradient-navy p-6 sm:p-8 text-navy-foreground relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/[0.02] translate-y-1/2" />

          <div className="relative z-10">
            <p className="text-sm font-medium text-navy-foreground/60">{greeting}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
              {firstName}{userName ? ',' : ''} welcome back
            </h1>
            <p className="mt-2 text-sm text-navy-foreground/60 max-w-lg">
              {roleLabel} dashboard · {userEmail}
            </p>

            {/* Quick action pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-navy-foreground backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <BookOpen className="size-4" />
                Search Catalog
              </Link>
              {stats.unreadNotifs > 0 && (
                <Link
                  href="/dashboard/notifications"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-navy-foreground backdrop-blur-sm transition-all hover:bg-white/15"
                >
                  <Bell className="size-4" />
                  {stats.unreadNotifs} Unread
                </Link>
              )}
            </div>
          </div>
        </div>
      </PageEntrance>

      {/* Stats Grid */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            icon={<BookOpen className="size-5" />}
            value={stats.borrowedCount}
            label="Currently Borrowed"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Clock className="size-5" />}
            value={stats.dueSoonCount}
            label="Due This Week"
            variant={stats.dueSoonCount > 0 ? 'accent' : 'default'}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<BookmarkCheck className="size-5" />}
            value={stats.reservationCount}
            label="Reservations"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<AlertCircle className="size-5" />}
            value={`Rs. ${stats.totalFines.toLocaleString()}`}
            label="Outstanding Fines"
            variant={stats.totalFines > 0 ? 'accent' : 'default'}
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Content Grid: Recent Loans + Quick Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Loans — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Currently Borrowed</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stats.overdueCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-error">
                      <AlertTriangle className="size-3" />
                      {stats.overdueCount} overdue
                    </span>
                  )}
                </p>
              </div>
              <Link
                href="/dashboard/loans"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View all
                <ChevronRight className="size-4" />
              </Link>
            </div>

            {recentLoans.length === 0 ? (
              <div className="px-5 py-12">
                <EmptyState
                  icon={<BookOpen className="size-10" />}
                  title="No borrowed books"
                  message="You haven't borrowed any books yet. Browse the catalog to find something." 
                  variant="compact"
                  action={
                    <Link
                      href="/catalog"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors"
                    >
                      <BookOpen className="size-4" />
                      Browse Catalog
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentLoans.map((loan) => (
                  <LoanRow key={loan.id} loan={loan} onRenew={handleRenew} renewingId={renewingId} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Panels */}
        <div className="space-y-6">
          {/* Wishlist Quick View */}
          <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Wishlist</h2>
              <Link
                href="/dashboard/wishlist"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {stats.wishlistCount} items
                <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="px-5 py-4">
              {stats.wishlistCount === 0 ? (
                <p className="text-sm text-muted-foreground">No saved books yet.</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You have <span className="font-medium text-foreground">{stats.wishlistCount}</span> books
                  in your reading wishlist.
                </p>
              )}
              <Link
                href="/dashboard/wishlist"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <Heart className="size-3.5" />
                View wishlist
              </Link>
            </div>
          </div>

          {/* Reservations Quick View */}
          <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Reservations</h2>
              <Link
                href="/dashboard/reservations"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {stats.reservationCount} active
                <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="px-5 py-4">
              {stats.reservationCount === 0 ? (
                <p className="text-sm text-muted-foreground">No active reservations.</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{stats.reservationCount}</span> book{stats.reservationCount !== 1 ? 's' : ''}
                  reserved and waiting.
                </p>
              )}
              <Link
                href="/dashboard/reservations"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <BookmarkCheck className="size-3.5" />
                View reservations
              </Link>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] border border-primary/10 p-5">
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <Link
                href="/catalog"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-all"
              >
                <BookOpen className="size-4" />
                Search Catalog
                <ExternalLink className="size-3 ml-auto" />
              </Link>
              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-all"
              >
                <Bell className="size-4" />
                Notifications
                {stats.unreadNotifs > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-white">
                    {stats.unreadNotifs}
                  </span>
                )}
              </Link>
              <Link
                href="/dashboard/activity"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-all"
              >
                <Clock className="size-4" />
                Activity Log
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Loan Row Sub-component ── */

function LoanRow({ loan, onRenew, renewingId }: { loan: RecentLoan; onRenew: (id: string) => void; renewingId: string | null }) {
  const isOverdue = loan.status === 'OVERDUE';
  const isDueSoon = loan.daysUntilDue >= 0 && loan.daysUntilDue <= 3;
  const isRenewing = renewingId === loan.id;

  const statusColor = isOverdue
    ? 'text-error'
    : isDueSoon
      ? 'text-warning'
      : 'text-muted-foreground';

  const statusLabel = isOverdue
    ? `${Math.abs(loan.daysUntilDue)} days overdue`
    : loan.daysUntilDue === 0
      ? 'Due today'
      : `${loan.daysUntilDue} days left`;

  return (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/50">
      {/* Book Cover Thumbnail */}
      <div className="relative h-16 w-12 shrink-0 rounded-lg bg-surface-muted overflow-hidden">
        {loan.coverImage ? (
          <Image src={loan.coverImage} alt={loan.bookTitle} fill className="object-cover" sizes="48px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="size-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/books/${loan.bookId}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
          {loan.bookTitle}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{loan.authors}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            Due: {formatDate(loan.dueAt)}
          </span>
          <span className={cn('font-medium', statusColor)}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Renew Action */}
      {!isOverdue && (
        <button
          onClick={() => onRenew(loan.id)}
          disabled={isRenewing}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-all disabled:opacity-50"
        >
          {isRenewing ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Renew
        </button>
      )}
    </div>
  );
}

/* ── Helpers ── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
