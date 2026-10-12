'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageEntrance, EmptyState } from '@/components/design-system';
import { BookOpen, RefreshCw, AlertTriangle, MapPin, Calendar } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface Loan {
  id: string;
  copyId: string;
  accessionNumber: string;
  bookTitle: string;
  bookId: string;
  authors: string;
  category: string | null;
  coverImage: string | null;
  borrowedAt: string;
  dueAt: string;
  status: string;
  daysUntilDue: number;
  shelf: { code: string; section: string | null; floor: string } | null;
}

export function LoansClient({ loans }: { loans: Loan[] }) {
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [loanList, setLoanList] = useState(loans);

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
        setLoanList((prev) =>
          prev.map((l) =>
            l.id === loanId
              ? { ...l, dueAt: data.newDueAt, daysUntilDue: Math.ceil((new Date(data.newDueAt).getTime() - Date.now()) / 86400000) }
              : l
          )
        );
      } else {
        toast.error(data.error || 'Failed to renew');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setRenewingId(null);
    }
  };

  const activeLoans = loanList.filter((l) => l.status === 'ACTIVE');
  const overdueLoans = loanList.filter((l) => l.status === 'OVERDUE');

  return (
    <div className="space-y-8">
      <PageEntrance>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Loans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loanList.length} book{loanList.length !== 1 ? 's' : ''} currently borrowed
            {overdueLoans.length > 0 && (
              <span className="text-error font-medium"> · {overdueLoans.length} overdue</span>
            )}
          </p>
        </div>
      </PageEntrance>

      {loanList.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-10" />}
          title="No borrowed books"
          message="You haven't borrowed any books yet."
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
      ) : (
        <div className="space-y-4">
          {/* Overdue section */}
          {overdueLoans.length > 0 && (
            <div className="rounded-2xl border border-error/20 bg-error/[0.03] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-error/15">
                <AlertTriangle className="size-4 text-error" />
                <h2 className="text-sm font-semibold text-error">Overdue ({overdueLoans.length})</h2>
              </div>
              <div className="divide-y divide-error/10">
                {overdueLoans.map((loan) => (
                  <FullLoanRow key={loan.id} loan={loan} onRenew={handleRenew} renewingId={renewingId} />
                ))}
              </div>
            </div>
          )}

          {/* Active section */}
          {activeLoans.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/60">
                <BookOpen className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Active Loans ({activeLoans.length})</h2>
              </div>
              <div className="divide-y divide-border/50">
                {activeLoans.map((loan) => (
                  <FullLoanRow key={loan.id} loan={loan} onRenew={handleRenew} renewingId={renewingId} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FullLoanRow({ loan, onRenew, renewingId }: { loan: Loan; onRenew: (id: string) => void; renewingId: string | null }) {
  const isOverdue = loan.status === 'OVERDUE';
  const isDueSoon = loan.daysUntilDue >= 0 && loan.daysUntilDue <= 3;
  const isRenewing = renewingId === loan.id;

  const statusColor = isOverdue ? 'text-error' : isDueSoon ? 'text-warning' : 'text-muted-foreground';
  const statusBg = isOverdue ? 'bg-error/10' : isDueSoon ? 'bg-warning/10' : 'bg-surface-muted';
  const statusLabel = isOverdue
    ? `${Math.abs(loan.daysUntilDue)}d overdue`
    : loan.daysUntilDue === 0
      ? 'Due today'
      : `${loan.daysUntilDue}d left`;

  return (
    <div className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/40">
      {/* Cover */}
      <Link href={`/books/${loan.bookId}`} className="relative h-24 w-[68px] shrink-0 rounded-xl bg-surface-muted overflow-hidden">
        {loan.coverImage ? (
          <Image src={loan.coverImage} alt={loan.bookTitle} fill className="object-cover" sizes="68px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="size-6 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/books/${loan.bookId}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
          {loan.bookTitle}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{loan.authors}</p>

        {/* Meta row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            Borrowed: {formatDate(loan.borrowedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            Due: {formatDate(loan.dueAt)}
          </span>
          {loan.shelf && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {loan.shelf.floor} · {loan.shelf.code}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            Acc: {loan.accessionNumber}
          </span>
        </div>
      </div>

      {/* Status + Action */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium', statusBg, statusColor)}>
          {statusLabel}
        </span>
        {!isOverdue && (
          <button
            onClick={() => onRenew(loan.id)}
            disabled={isRenewing}
            className="flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-all disabled:opacity-50"
          >
            {isRenewing ? <RefreshCw className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            {isRenewing ? 'Renewing...' : 'Renew'}
          </button>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}
