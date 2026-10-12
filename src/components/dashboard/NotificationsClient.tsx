'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageEntrance, EmptyState } from '@/components/design-system';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  BookmarkCheck,
  Info,
  DollarSign,
  Megaphone,
  Settings,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  OVERDUE: <AlertTriangle className="size-4" />,
  RESERVATION: <BookmarkCheck className="size-4" />,
  FINE: <DollarSign className="size-4" />,
  ANNOUNCEMENT: <Megaphone className="size-4" />,
  SYSTEM: <Settings className="size-4" />,
  BORROW: <Info className="size-4" />,
  RETURN: <Info className="size-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  OVERDUE: 'bg-error/10 text-error',
  RESERVATION: 'bg-primary/10 text-primary',
  FINE: 'bg-warning/10 text-warning',
  ANNOUNCEMENT: 'bg-success/10 text-success',
  SYSTEM: 'bg-surface-muted text-muted-foreground',
  BORROW: 'bg-primary/10 text-primary',
  RETURN: 'bg-success/10 text-success',
};

export function NotificationsClient({
  notifications: initial,
  unreadCount,
}: {
  notifications: Notification[];
  unreadCount: number;
}) {
  const [list, setList] = useState(initial);

  const handleMarkAllRead = async () => {
    const unreadIds = list.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    try {
      const res = await fetch('/api/dashboard/mark-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${unreadIds.length} notifications marked as read`);
        setList((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-8">
      <PageEntrance>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-all"
            >
              <CheckCheck className="size-4" />
              Mark all as read
            </button>
          )}
        </div>
      </PageEntrance>

      {list.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-10" />}
          title="No notifications"
          message="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden divide-y divide-border/50">
          {list.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-muted/40',
                !notif.read && 'bg-primary/[0.02]'
              )}
            >
              {/* Type icon */}
              <div
                className={cn(
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  TYPE_COLORS[notif.type] ?? 'bg-surface-muted text-muted-foreground'
                )}
              >
                {TYPE_ICONS[notif.type] ?? <Bell className="size-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className={cn('text-sm font-medium leading-snug', notif.read ? 'text-foreground' : 'text-foreground font-semibold')}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{formatRelativeTime(notif.createdAt)}</p>
              </div>
            </div>
          ))}
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
