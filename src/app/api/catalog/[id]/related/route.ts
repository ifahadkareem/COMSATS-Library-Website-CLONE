// ═══════════════════════════════════════════════════════════════
// Related Books API — /api/catalog/[id]/related
//
// Returns up to 6 related books based on shared categories,
// authors, and subjects. Excludes the current book.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    // Get the source book's categories, author IDs, and subject
    const sourceBook = await db.book.findUnique({
      where: { id },
      select: {
        id: true,
        categories: { select: { categoryId: true } },
        authors: { select: { authorId: true } },
        subject: true,
      },
    });

    if (!sourceBook) {
      return NextResponse.json({ success: true, data: [] });
    }

    const categoryIds = sourceBook.categories.map((c) => c.categoryId);
    const authorIds = sourceBook.authors.map((a) => a.authorId);
    const subject = sourceBook.subject;

    // Find related books via category, author, or subject
    const OR: import('@prisma/client').Prisma.BookWhereInput[] = [];

    if (categoryIds.length > 0) {
      OR.push({
        categories: { some: { categoryId: { in: categoryIds } } },
      });
    }

    if (authorIds.length > 0) {
      OR.push({
        authors: { some: { authorId: { in: authorIds } } },
      });
    }

    if (subject) {
      OR.push({ subject });
    }

    if (OR.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const relatedBooks = await db.book.findMany({
      where: {
        AND: [
          { id: { not: id } }, // Exclude current book
          { OR },
        ],
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        isbn: true,
        publicationYear: true,
        language: true,
        callNumber: true,
        coverImage: true,
        authors: {
          take: 2,
          select: { author: { select: { name: true } } },
          orderBy: { author: { name: 'asc' } },
        },
        categories: {
          take: 1,
          select: { category: { select: { name: true } } },
        },
        copies: {
          select: { status: true },
        },
      },
      take: 6,
    });

    const data = relatedBooks.map((book) => {
      const available = book.copies.filter((c) => c.status === 'AVAILABLE').length;
      return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        language: book.language,
        callNumber: book.callNumber,
        coverImage: book.coverImage,
        authors: book.authors.map((ba) => ba.author.name),
        mainCategory: book.categories[0]?.category.name,
        availableCopies: available,
        totalCopies: book.copies.length,
        status: available > 0 ? 'available' as const : 'checked-out' as const,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Related books error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}
