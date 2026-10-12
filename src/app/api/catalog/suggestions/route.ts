// ═══════════════════════════════════════════════════════════════
// Catalog Suggestions API — /api/catalog/suggestions
//
// Lightweight endpoint for search-as-you-type suggestions.
// Returns top 8 matches across titles, authors, and subjects.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ success: true, suggestions: [] });
  }

  const term = q.trim();
  const take = 8;

  try {
    // Run all three queries in parallel
    const [titles, authorResults, subjects] = await Promise.all([
      // Title matches
      db.book.findMany({
        where: { OR: [
          { title: { contains: term } },
          { subtitle: { contains: term } },
        ]},
        select: {
          id: true,
          title: true,
          authors: {
            take: 1,
            select: { author: { select: { name: true } } },
            orderBy: { author: { name: 'asc' } },
          },
        },
        take,
        orderBy: { title: 'asc' },
      }),

      // Author matches
      db.author.findMany({
        where: { name: { contains: term } },
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
        },
        take: 4,
        orderBy: { name: 'asc' },
      }),

      // Subject matches
      db.book.groupBy({
        by: ['subject'],
        where: { subject: { contains: term }, NOT: { subject: null } },
        _count: { subject: true },
        take: 4,
        orderBy: { _count: { subject: 'desc' } },
      }),
    ]);

    // Build suggestions list
    const suggestions: Array<{
      id: string;
      type: 'title' | 'author' | 'subject';
      label: string;
      description?: string;
    }> = [];

    // Title suggestions
    for (const book of titles) {
      suggestions.push({
        id: `t-${book.id}`,
        type: 'title',
        label: book.title,
        description: book.authors[0]?.author.name,
      });
    }

    // Author suggestions
    for (const author of authorResults) {
      suggestions.push({
        id: `a-${author.id}`,
        type: 'author',
        label: author.name,
        description: `${author._count.books} book${author._count.books !== 1 ? 's' : ''} in catalog`,
      });
    }

    // Subject suggestions
    for (const sub of subjects) {
      if (sub.subject) {
        suggestions.push({
          id: `s-${sub.subject.replace(/\s+/g, '-').toLowerCase()}`,
          type: 'subject',
          label: sub.subject,
          description: `${sub._count.subject} book${sub._count.subject !== 1 ? 's' : ''}`,
        });
      }
    }

    return NextResponse.json({ success: true, suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ success: true, suggestions: [] });
  }
}
