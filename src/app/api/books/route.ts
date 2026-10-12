import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Number(searchParams.get('limit') ?? '12');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { subtitle: { contains: query } },
      { isbn: { contains: query } },
      { callNumber: { contains: query } },
    ];
  }

  try {
    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          publisher: true,
          authors: { include: { author: true } },
          categories: { include: { category: true } },
          _count: { select: { copies: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: books,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch books' },
      { status: 500 },
    );
  }
}
