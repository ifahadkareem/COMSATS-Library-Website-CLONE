import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { phone } = body;

  if (auth.user.role === 'STUDENT') {
    if (phone !== undefined) {
      await db.studentProfile.update({
        where: { userId: auth.user.id },
        data: { phone },
      });
    }
  }

  return NextResponse.json({ success: true });
}
