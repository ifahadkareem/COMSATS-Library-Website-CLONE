import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const auth = await requireRole(['STUDENT', 'FACULTY']);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const loans = await db.borrowTransaction.findMany({
    where: { userId: auth.user.id, status: { in: ['ACTIVE', 'OVERDUE'] } },
    include: {
      copy: {
        include: {
          book: {
            include: {
              authors: { include: { author: true } },
              categories: { include: { category: true } },
            },
          },
          shelf: { include: { floor: true } },
        },
      },
    },
    orderBy: { dueAt: 'asc' },
  });

  const mapped = loans.map((l) => {
    const book = l.copy.book;
    const authors = book.authors.map((ba) => ba.author.name).join(', ');
    const category = book.categories[0]?.category.name ?? null;
    const dueDate = new Date(l.dueAt);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: l.id,
      copyId: l.copy.id,
      accessionNumber: l.copy.accessionNumber,
      bookTitle: book.title,
      bookId: book.id,
      authors,
      category,
      coverImage: book.coverImage,
      borrowedAt: l.borrowedAt.toISOString(),
      dueAt: l.dueAt.toISOString(),
      status: l.status,
      daysUntilDue,
      shelf: l.copy.shelf ? {
        code: l.copy.shelf.code,
        section: l.copy.shelf.section,
        floor: l.copy.shelf.floor.name,
      } : null,
    };
  });

  return NextResponse.json({ loans: mapped });
}
