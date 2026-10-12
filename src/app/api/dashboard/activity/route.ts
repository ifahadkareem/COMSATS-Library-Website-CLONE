import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Gather recent activity from multiple sources
  const [loans, reservations, wishlistItems, roomBookings] = await Promise.all([
    // Borrow/return activity (include returned for history)
    db.borrowTransaction.findMany({
      where: { userId: auth.user.id },
      include: {
        copy: { include: { book: { select: { title: true, id: true } } } },
      },
      orderBy: { borrowedAt: 'desc' },
      take: 5,
    }),
    db.reservation.findMany({
      where: { userId: auth.user.id },
      include: { book: { select: { title: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.wishlist.findMany({
      where: { userId: auth.user.id },
      include: { book: { select: { title: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.roomBooking.findMany({
      where: { userId: auth.user.id },
      include: { room: { select: { name: true } } },
      orderBy: { bookingDate: 'desc' },
      take: 3,
    }),
  ]);

  // Merge into a unified timeline
  type ActivityItem = {
    type: string;
    title: string;
    bookId?: string;
    timestamp: string;
    meta?: string;
  };

  const timeline: ActivityItem[] = [];

  for (const l of loans) {
    timeline.push({
      type: l.status === 'RETURNED' ? 'RETURN' : 'BORROW',
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

  // Sort by timestamp descending
  timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ activity: timeline.slice(0, 15) });
}
