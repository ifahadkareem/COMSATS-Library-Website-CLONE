import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      studentProfile: {
        select: {
          studentId: true,
          name: true,
          semester: true,
          phone: true,
          avatar: true,
          department: { select: { name: true, code: true } },
          program: { select: { name: true, code: true } },
          membership: { select: {
            membershipNumber: true,
            issueDate: true,
            expiryDate: true,
            status: true,
            borrowingLimit: true,
          } },
        },
      },
      facultyProfile: {
        select: {
          employeeId: true,
          designation: true,
          department: { select: { name: true, code: true } },
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const activeBorrowCount = await db.borrowTransaction.count({
    where: { userId: auth.user.id, status: { in: ['ACTIVE', 'OVERDUE'] } },
  });

  return NextResponse.json({
    profile: user,
    activeBorrowCount,
  });
}
