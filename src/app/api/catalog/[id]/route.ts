// ═══════════════════════════════════════════════════════════════
// Book Detail API — /api/catalog/[id]
//
// Returns full book details with all physical copies,
// their locations (floor/shelf/section), and availability.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Book ID is required.' },
      { status: 400 },
    );
  }

  try {
    const book = await db.book.findUnique({
      where: { id },
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
          include: {
            shelf: {
              include: {
                floor: { select: { id: true, name: true, floorNumber: true } },
              },
            },
          },
          orderBy: { accessionNumber: 'asc' },
        },
        _count: {
          select: {
            copies: true,
            reservations: true,
            wishlists: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Book not found.' },
        { status: 404 },
      );
    }

    // Compute copy statistics
    const availableCopies = book.copies.filter((c) => c.status === 'AVAILABLE');
    const borrowedCopies = book.copies.filter((c) => c.status === 'BORROWED');
    const reservedCopies = book.copies.filter((c) => c.status === 'RESERVED');
    const otherCopies = book.copies.filter((c) => !['AVAILABLE', 'BORROWED', 'RESERVED'].includes(c.status));

    const data = {
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

      // Availability summary
      availability: {
        total: book._count.copies,
        available: availableCopies.length,
        borrowed: borrowedCopies.length,
        reserved: reservedCopies.length,
        other: otherCopies.length,
        isAvailable: availableCopies.length > 0,
      },

      // Physical copies with locations
      copies: book.copies.map((copy) => ({
        id: copy.id,
        accessionNumber: copy.accessionNumber,
        barcode: copy.barcode,
        status: copy.status,
        condition: copy.condition,
        location: copy.shelf ? {
          shelf: { code: copy.shelf.code, section: copy.shelf.section },
          floor: { name: copy.shelf.floor.name, floorNumber: copy.shelf.floor.floorNumber },
        } : null,
      })),

      // Aggregate stats
      totalReservations: book._count.reservations,
      totalWishlists: book._count.wishlists,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Book detail error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load book details.' },
      { status: 500 },
    );
  }
}
