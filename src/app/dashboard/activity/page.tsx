import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ActivityClient } from '@/components/dashboard/ActivityClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Activity' };

export default async function ActivityPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [loans, reservations, wishlistItems, roomBookings, unreadNotifs] = await Promise.all([
          db.borrowTransaction.findMany({
            where: { userId: user.id },
            include: { copy: { include: { book: { select: { title: true, id: true } } } } },
            orderBy: { borrowedAt: 'desc' },
            take: 10,
          }),
          db.reservation.findMany({
            where: { userId: user.id },
            include: { book: { select: { title: true, id: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
          }),
          db.wishlist.findMany({
            where: { userId: user.id },
            include: { book: { select: { title: true, id: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
          }),
          db.roomBooking.findMany({
            where: { userId: user.id },
            include: { room: { select: { name: true } } },
            orderBy: { bookingDate: 'desc' },
            take: 5,
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        type ActivityItem = {
          type: string;
          title: string;
          bookId?: string;
          timestamp: string;
          meta: string;
        };

        const timeline: ActivityItem[] = [];

        for (const l of loans) {
          timeline.push({
            type: l.status === 'RETURNED' ? 'RETURN' : l.status === 'OVERDUE' ? 'OVERDUE' : 'BORROW',
            title: l.copy.book.title,
            bookId: l.copy.book.id,
            timestamp: l.borrowedAt.toISOString(),
            meta: l.status === 'RETURNED' ? 'Returned' : l.status === 'OVERDUE' ? 'Overdue' : 'Borrowed',
          });
        }
        for (const r of reservations) {
          timeline.push({
            type: 'RESERVATION',
            title: r.book.title,
            bookId: r.book.id,
            timestamp: r.createdAt.toISOString(),
            meta: r.status === 'CANCELLED' ? 'Cancelled' : r.status === 'FULFILLED' ? 'Fulfilled' : 'Reserved',
          });
        }
        for (const w of wishlistItems) {
          timeline.push({
            type: 'WISHLIST',
            title: w.book.title,
            bookId: w.book.id,
            timestamp: w.createdAt.toISOString(),
            meta: 'Added to wishlist',
          });
        }
        for (const rb of roomBookings) {
          timeline.push({
            type: 'ROOM_BOOKING',
            title: rb.room.name,
            timestamp: `${rb.bookingDate}T${rb.startTime}:00.000Z`,
            meta: `${rb.startTime} – ${rb.endTime} · ${rb.status === 'CANCELLED' ? 'Cancelled' : 'Confirmed'}`,
          });
        }

        timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <ActivityClient activity={timeline.slice(0, 20)} />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
