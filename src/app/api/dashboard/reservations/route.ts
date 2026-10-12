import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reservations = await db.reservation.findMany({
    where: { userId: auth.user.id },
    include: {
      book: {
        include: {
          authors: { include: { author: true } },
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const mapped = reservations.map((r) => ({
    id: r.id,
    bookId: r.book.id,
    bookTitle: r.book.title,
    authors: r.book.authors.map((ba) => ba.author.name).join(', '),
    coverImage: r.book.coverImage,
    category: r.book.categories[0]?.category.name ?? null,
    createdAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt.toISOString(),
    status: r.status,
  }));

  return NextResponse.json({ reservations: mapped });
}
