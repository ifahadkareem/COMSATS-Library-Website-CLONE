import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fines = await db.fine.findMany({
    where: { userId: auth.user.id, status: 'PENDING' },
    include: {
      transaction: {
        include: {
          copy: {
            include: {
              book: { select: { title: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

  const mapped = fines.map((f) => ({
    id: f.id,
    amount: f.amount,
    reason: f.reason,
    bookTitle: f.transaction.copy.book.title,
    createdAt: f.createdAt.toISOString(),
    status: f.status,
  }));

  return NextResponse.json({ fines: mapped, totalAmount });
}
