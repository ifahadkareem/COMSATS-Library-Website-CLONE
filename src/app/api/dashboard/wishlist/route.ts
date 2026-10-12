import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const wishlist = await db.wishlist.findMany({
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

  const mapped = wishlist.map((w) => {
    const totalCopies = w.book.copies.length;
    const availableCopies = w.book.copies.filter((c) => c.status === 'AVAILABLE').length;
    return {
      id: w.id,
      bookId: w.book.id,
      bookTitle: w.book.title,
      authors: w.book.authors.map((ba) => ba.author.name).join(', '),
      coverImage: w.book.coverImage,
      category: w.book.categories[0]?.category.name ?? null,
      publicationYear: w.book.publicationYear,
      addedAt: w.createdAt.toISOString(),
      availability: { total: totalCopies, available: availableCopies },
    };
  });

  return NextResponse.json({ wishlist: mapped });
}
