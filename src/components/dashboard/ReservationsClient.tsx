'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageEntrance, EmptyState } from '@/components/design-system';
import { BookmarkCheck, X, Calendar, Clock } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  authors: string;
  coverImage: string | null;
  category: string | null;
  createdAt: string;
  expiresAt: string;
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Waiting', className: 'bg-warning/10 text-warning' },
  FULFILLED: { label: 'Ready', className: 'bg-success/10 text-success' },
  CANCELLED: { label: 'Cancelled', className: 'bg-surface-muted text-muted-foreground' },
  EXPIRED: { label: 'Expired', className: 'bg-surface-muted text-muted-foreground' },
};

export function ReservationsClient({ reservations: initial }: { reservations: Reservation[] }) {
  const [list, setList] = useState(initial);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch('/api/dashboard/reserve-cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Reservation cancelled');
        setList((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r)));
      } else {
        toast.error(data.error || 'Failed to cancel');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setCancellingId(null);
    }
  };

  const pending = list.filter((r) => r.status === 'PENDING');
  const others = list.filter((r) => r.status !== 'PENDING');

  return (
    <div className="space-y-8">
      <PageEntrance>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reservations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} active reservation{pending.length !== 1 ? 's' : ''} · {list.length} total
          </p>
        </div>
      </PageEntrance>

      {list.length === 0 ? (
        <EmptyState
          icon={<BookmarkCheck className="size-10" />}
          title="No reservations"
          message="You haven't reserved any books. Browse the catalog to find books you'd like to reserve."
          action={
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              <BookmarkCheck className="size-4" />
              Browse Catalog
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Pending reservations */}
          {pending.length > 0 && (
            <div className="rounded-2xl border border-warning/20 bg-warning/[0.02] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-warning/15">
                <Clock className="size-4 text-warning" />
                <h2 className="text-sm font-semibold text-foreground">Waiting ({pending.length})</h2>
              </div>
              <div className="divide-y divide-border/50">
                {pending.map((res) => (
                  <ReservationRow
                    key={res.id}
                    reservation={res}
                    onCancel={handleCancel}
                    cancellingId={cancellingId}
                    showCancel
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past/other reservations */}
          {others.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/60">
                <BookmarkCheck className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">History ({others.length})</h2>
              </div>
              <div className="divide-y divide-border/50">
                {others.map((res) => (
                  <ReservationRow key={res.id} reservation={res} onCancel={handleCancel} cancellingId={cancellingId} showCancel={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReservationRow({
  reservation,
  onCancel,
  cancellingId,
  showCancel,
}: {
  reservation: Reservation;
  onCancel: (id: string) => void;
  cancellingId: string | null;
  showCancel: boolean;
}) {
  const cfg = STATUS_CONFIG[reservation.status] ?? STATUS_CONFIG.PENDING;
  const isCancelling = cancellingId === reservation.id;
  const isExpired = new Date(reservation.expiresAt) < new Date() && reservation.status === 'PENDING';
  const displayStatus = isExpired ? STATUS_CONFIG.EXPIRED : cfg;

  return (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/40">
      <Link
        href={`/books/${reservation.bookId}`}
        className="relative h-16 w-12 shrink-0 rounded-lg bg-surface-muted overflow-hidden"
      >
        {reservation.coverImage ? (
          <Image src={reservation.coverImage} alt={reservation.bookTitle} fill className="object-cover" sizes="48px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookmarkCheck className="size-5 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/books/${reservation.bookId}`}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
        >
          {reservation.bookTitle}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{reservation.authors}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" /> Reserved: {formatDate(reservation.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> Expires: {formatDate(reservation.expiresAt)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium', displayStatus.className)}>
          {displayStatus.label}
        </span>
        {showCancel && (
          <button
            onClick={() => onCancel(reservation.id)}
            disabled={isCancelling}
            className="flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-error/8 hover:text-error hover:border-error/30 transition-all disabled:opacity-50"
          >
            {isCancelling ? 'Cancelling...' : <><X className="size-3.5" /> Cancel</>}
          </button>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}
