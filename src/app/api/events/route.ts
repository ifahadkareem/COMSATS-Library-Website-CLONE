import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: { status: 'PUBLISHED' },
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}