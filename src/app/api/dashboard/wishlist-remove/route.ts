import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { wishlistId } = await request.json();
  if (!wishlistId) return NextResponse.json({ error: 'wishlistId required' }, { status: 400 });

  await db.wishlist.deleteMany({
    where: { id: wishlistId, userId: auth.user.id },
  });

  return NextResponse.json({ success: true });
}
