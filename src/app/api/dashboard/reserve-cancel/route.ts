import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { reservationId } = await request.json();
  if (!reservationId) return NextResponse.json({ error: 'reservationId required' }, { status: 400 });

  const reservation = await db.reservation.findFirst({
    where: { id: reservationId, userId: auth.user.id, status: 'PENDING' },
  });

  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found or not cancellable' }, { status: 404 });
  }

  await db.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  });

  return NextResponse.json({ success: true });
}
