import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { loanId } = await request.json();
  if (!loanId) return NextResponse.json({ error: 'loanId required' }, { status: 400 });

  const loan = await db.borrowTransaction.findFirst({
    where: { id: loanId, userId: auth.user.id, status: 'ACTIVE' },
  });

  if (!loan) {
    return NextResponse.json({ error: 'Loan not found or not eligible for renewal' }, { status: 404 });
  }

  // Extend due date by 14 days
  const newDueAt = new Date(loan.dueAt);
  newDueAt.setDate(newDueAt.getDate() + 14);

  await db.borrowTransaction.update({
    where: { id: loanId },
    data: { dueAt: newDueAt },
  });

  return NextResponse.json({ success: true, newDueAt: newDueAt.toISOString() });
}
