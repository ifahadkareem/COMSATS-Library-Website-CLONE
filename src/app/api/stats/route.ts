import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalBooks,
      totalCopies,
      availableCopies,
      totalUsers,
      activeBorrows,
      overdueBorrows,
      publishedEvents,
      totalStudyRooms,
    ] = await Promise.all([
      db.book.count(),
      db.bookCopy.count(),
      db.bookCopy.count({ where: { status: 'AVAILABLE' } }),
      db.user.count(),
      db.borrowTransaction.count({ where: { status: 'ACTIVE' } }),
      db.borrowTransaction.count({ where: { status: 'OVERDUE' } }),
      db.event.count({ where: { status: 'PUBLISHED' } }),
      db.studyRoom.count({ where: { status: 'ACTIVE' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBooks,
        totalCopies,
        availableCopies,
        totalUsers,
        activeBorrows,
        overdueBorrows,
        publishedEvents,
        totalStudyRooms,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 },
    );
  }
}
