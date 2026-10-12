// ═══════════════════════════════════════════════════════════════
// Catalog Search API — /api/catalog/search
//
// Full-text search across title, author, ISBN, subject, publisher,
// call number, keyword. Supports filtering by availability,
// category, author, publication year, language, floor.
// Sorting by relevance, title, newest, oldest.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ── Parse query params ──
  const query = searchParams.get('q') || '';
  const searchField = searchParams.get('field') || 'keyword';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 16));
  const sort = searchParams.get('sort') || 'relevance';

  // ── Parse filters ──
  const availability = searchParams.get('availability');
  const categories = searchParams.get('categories');
  const authors = searchParams.get('authors');
  const yearFrom = searchParams.get('yearFrom');
  const yearTo = searchParams.get('yearTo');
  const languages = searchParams.get('languages');
  const floors = searchParams.get('floors');

  const skip = (page - 1) * limit;

  // ── Build where clause ──
  const AND: Prisma.BookWhereInput[] = [];

  // Search conditions
  if (query.trim()) {
    const q = query.trim();
    // Note: SQLite contains() is case-insensitive for ASCII by default.
    // For PostgreSQL, add `mode: 'insensitive'` to each contains call.

    switch (searchField) {
      case 'title':
        AND.push({ OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
        ]});
        break;
      case 'author':
        AND.push({
          authors: {
            some: { author: { name: { contains: q } } },
          },
        });
        break;
      case 'isbn':
        AND.push({ isbn: { contains: q } });
        break;
      case 'subject':
        AND.push({ subject: { contains: q } });
        break;
      case 'publisher':
        AND.push({ publisher: { name: { contains: q } } });
        break;
      case 'callNumber':
        AND.push({ callNumber: { contains: q } });
        break;
      case 'keyword':
      default:
        AND.push({ OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
          { subject: { contains: q } },
          { isbn: { contains: q } },
          { callNumber: { contains: q } },
          { description: { contains: q } },
          { authors: { some: { author: { name: { contains: q } } } } },
          { publisher: { name: { contains: q } } },
        ]});
        break;
    }
  }

  // Filter: availability (only show books with at least one AVAILABLE copy)
  if (availability === 'available') {
    AND.push({
      copies: { some: { status: 'AVAILABLE' } },
    });
  }

  // Filter: categories
  if (categories) {
    const catIds = categories.split(',').filter(Boolean);
    if (catIds.length > 0) {
      AND.push({
        categories: {
          some: { categoryId: { in: catIds } },
        },
      });
    }
  }

  // Filter: authors
  if (authors) {
    const authorIdList = authors.split(',').filter(Boolean);
    if (authorIdList.length > 0) {
      AND.push({
        authors: {
          some: { authorId: { in: authorIdList } },
        },
      });
    }
  }

  // Filter: publication year range
  if (yearFrom || yearTo) {
    const yearFilter: Prisma.IntNullableFilter = {};
    if (yearFrom) yearFilter.gte = Number(yearFrom);
    if (yearTo) yearFilter.lte = Number(yearTo);
    AND.push({ publicationYear: yearFilter });
  }

  // Filter: languages
  if (languages) {
    const langList = languages.split(',').filter(Boolean);
    if (langList.length > 0) {
      AND.push({ language: { in: langList } });
    }
  }

  // Filter: floors (books that have copies on specific floors)
  if (floors) {
    const floorNumbers = floors.split(',').filter(Boolean).map(Number);
    if (floorNumbers.length > 0) {
      AND.push({
        copies: {
          some: {
            shelf: { floor: { floorNumber: { in: floorNumbers } } },
          },
        },
      });
    }
  }

  // ── Build order by ──
  let orderBy: Prisma.BookOrderByWithRelationInput;
  switch (sort) {
    case 'title':
      orderBy = { title: 'asc' };
      break;
    case 'newest':
      orderBy = { publicationYear: 'desc' };
      break;
    case 'oldest':
      orderBy = { publicationYear: 'asc' };
      break;
    case 'relevance':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // ── Query ──
  const where = AND.length > 0 ? { AND } : {};

  try {
    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          publisher: { select: { id: true, name: true } },
          authors: {
            include: { author: { select: { id: true, name: true } } },
            orderBy: { author: { name: 'asc' } },
          },
          categories: {
            include: { category: { select: { id: true, name: true } } },
          },
          copies: {
            select: {
              id: true,
              status: true,
              shelf: {
                select: {
                  id: true,
                  code: true,
                  section: true,
                  floor: { select: { id: true, name: true, floorNumber: true } },
                },
              },
            },
          },
          _count: { select: { copies: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ]);

    // ── Transform response ──
    const data = books.map((book) => {
      const availableCopies = book.copies.filter((c) => c.status === 'AVAILABLE').length;
      const borrowedCopies = book.copies.filter((c) => c.status === 'BORROWED').length;
      const reservedCopies = book.copies.filter((c) => c.status === 'RESERVED').length;
      const mainCategory = book.categories[0]?.category.name;

      // Get floor numbers from copies
      const floorNumbers = [...new Set(
        book.copies
          .filter((c) => c.shelf?.floor)
          .map((c) => c.shelf!.floor.floorNumber)
          .sort()
      )];

      return {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        description: book.description,
        isbn: book.isbn,
        subject: book.subject,
        publicationYear: book.publicationYear,
        edition: book.edition,
        language: book.language,
        pages: book.pages,
        callNumber: book.callNumber,
        coverImage: book.coverImage,
        authors: book.authors.map((ba) => ({ id: ba.author.id, name: ba.author.name })),
        publisher: book.publisher ? { id: book.publisher.id, name: book.publisher.name } : null,
        categories: book.categories.map((bc) => ({ id: bc.category.id, name: bc.category.name })),
        mainCategory,
        copies: {
          total: book._count.copies,
          available: availableCopies,
          borrowed: borrowedCopies,
          reserved: reservedCopies,
        },
        floorNumbers,
        availabilityStatus: availableCopies > 0 ? 'available' : borrowedCopies > 0 ? 'checked-out' : reservedCopies > 0 ? 'reserved' : 'unavailable',
      };
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Catalog search error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search the catalog. Please try again.' },
      { status: 500 },
    );
  }
}
