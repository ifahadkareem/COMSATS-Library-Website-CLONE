// ═══════════════════════════════════════════════════════════════
// Catalog Filters API — /api/catalog/filters
//
// Returns available filter options: categories, authors,
// publication years, languages, and floors with counts.
// Used to populate the advanced filter panel.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const [categories, authors, yearData, languages, floors] = await Promise.all([
      // Categories with book counts
      db.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
        },
        orderBy: { name: 'asc' },
      }),

      // Authors with book counts (top 50)
      db.author.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { books: true } },
        },
        where: { books: { some: {} } },
        orderBy: { name: 'asc' },
        take: 50,
      }),

      // Publication years range and distribution
      db.book.groupBy({
        by: ['publicationYear'],
        where: { publicationYear: { not: null } },
        _count: { publicationYear: true },
        orderBy: { publicationYear: 'asc' },
      }),

      // Languages with book counts
      db.book.groupBy({
        by: ['language'],
        _count: { language: true },
        orderBy: { language: 'asc' },
      }),

      // Floors with copy counts
      db.floor.findMany({
        select: {
          id: true,
          name: true,
          floorNumber: true,
          _count: { select: { shelves: { where: { copies: { some: { status: 'AVAILABLE' } } } } } },
        },
        orderBy: { floorNumber: 'asc' },
      }),
    ]);

    // Process years into a useful range
    const years = yearData
      .filter((y) => y.publicationYear !== null)
      .map((y) => ({
        year: y.publicationYear as number,
        count: y._count.publicationYear,
      }));
    const minYear = years.length > 0 ? years[0].year : null;
    const maxYear = years.length > 0 ? years[years.length - 1].year : null;

    return NextResponse.json({
      success: true,
      filters: {
        categories: categories.map((c) => ({ id: c.id, name: c.name, count: c._count.books })),
        authors: authors.map((a) => ({ id: a.id, name: a.name, count: a._count.books })),
        years: { min: minYear, max: maxYear, distribution: years },
        languages: languages.map((l) => ({ name: l.language, count: l._count.language })),
        floors: floors.map((f) => ({
          id: f.id,
          name: f.name,
          floorNumber: f.floorNumber,
          availableCopies: f._count.shelves,
        })),
      },
    });
  } catch (error) {
    console.error('Filters error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load filter options.' },
      { status: 500 },
    );
  }
}
