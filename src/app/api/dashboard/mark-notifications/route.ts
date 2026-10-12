import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { notificationIds } = await request.json();
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return NextResponse.json({ error: 'notificationIds required' }, { status: 400 });
  }

  await db.notification.updateMany({
    where: { id: { in: notificationIds }, userId: auth.user.id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
