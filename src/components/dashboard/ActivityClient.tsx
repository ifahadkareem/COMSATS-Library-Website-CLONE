'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageEntrance, EmptyState } from '@/components/design-system';
import {
  BookOpen,
  BookmarkCheck,
  Heart,
  DoorOpen,
  RotateCcw,
  AlertTriangle,
  Clock,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface ActivityItem {
  type: string;
  title: string;
  bookId?: string;
  timestamp: string;
  meta: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  BORROW: {
    icon: <BookOpen className="size-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  RETURN: {
    icon: <RotateCcw className="size-4" />,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  OVERDUE: {
    icon: <AlertTriangle className="size-4" />,
    color: 'text-error',
    bg: 'bg-error/10',
  },
  RESERVATION: {
    icon: <BookmarkCheck className="size-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  WISHLIST: {
    icon: <Heart className="size-4" />,
    color: 'text-error',
    bg: 'bg-error/10',
  },
  ROOM_BOOKING: {
    icon: <DoorOpen className="size-4" />,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
};

export function ActivityClient({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="space-y-8">
      <PageEntrance>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your recent library activity and history
          </p>
        </div>
      </PageEntrance>

      {activity.length === 0 ? (
        <EmptyState
          icon={<Clock className="size-10" />}
          title="No activity yet"
          message="Your borrowing, reservation, and wishlist activity will appear here."
        />
      ) : (
        <div className="relative rounded-2xl border border-border/60 bg-surface overflow-hidden">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border/60 hidden sm:block" />

          <div className="divide-y divide-border/50">
            {activity.map((item, index) => {
              const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.BORROW;

              const content = (
                <div className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/40">
                  {/* Timeline dot */}
                  <div className={cn('relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', config.bg, config.color)}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {item.bookId ? (
                      <Link href={`/books/${item.bookId}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                  </div>

                  {/* Timestamp */}
                  <span className="shrink-0 text-xs text-muted-foreground/70 mt-0.5">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              );

              return <React.Fragment key={`${item.type}-${item.timestamp}-${index}`}>{content}</React.Fragment>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}
