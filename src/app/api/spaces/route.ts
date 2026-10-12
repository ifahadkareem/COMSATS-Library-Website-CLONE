import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const rooms = await db.studyRoom.findMany({
      where: { status: 'ACTIVE' },
      include: { floor: true },
      orderBy: [{ floor: { floorNumber: 'asc' } }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch study rooms' },
      { status: 500 },
    );
  }
}
