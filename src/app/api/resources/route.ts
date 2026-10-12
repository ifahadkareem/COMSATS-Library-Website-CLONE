import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const resources = await db.digitalResource.findMany({
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resources' },
      { status: 500 },
    );
  }
}