'use server';

import { db } from '@/lib/db';
import type {
  BookSearchFilters,
  PaginatedResponse,
  ApiError,
  ApiResponse,
} from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// Books
// ═══════════════════════════════════════════════════════════════════════════

export async function searchBooks(filters: BookSearchFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query } },
      { subtitle: { contains: filters.query } },
      { isbn: { contains: filters.query } },
      { callNumber: { contains: filters.query } },
    ];
  }

  if (filters.category) {
    where.categories = {
      some: { categoryId: filters.category },
    };
  }

  if (filters.author) {
    where.authors = {
      some: {
        author: { name: { contains: filters.author } },
      },
    };
  }

  if (filters.availability === 'available') {
    where.copies = {
      some: { status: 'AVAILABLE' },
    };
  }

  const orderBy: Record<string, string> = {};
  switch (filters.sortBy) {
    case 'title':
      orderBy.title = 'asc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const [books, total] = await Promise.all([
    db.book.findMany({
      where,
      include: {
        publisher: true,
        authors: { include: { author: true } },
        categories: { include: { category: true } },
        _count: { select: { copies: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.book.count({ where }),
  ]);

  return {
    data: books,
    success: true,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  } satisfies PaginatedResponse<(typeof books)[number]>;
}

export async function getBookById(id: string) {
  const book = await db.book.findUnique({
    where: { id },
    include: {
      publisher: true,
      authors: { include: { author: true } },
      categories: { include: { category: true } },
      copies: {
        include: { shelf: { include: { floor: true } } },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { wishlists: true, reservations: true } },
    },
  });

  if (!book) {
    return { success: false, message: 'Book not found' } satisfies ApiError;
  }

  return { data: book, success: true } satisfies ApiResponse<typeof book>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Categories, Authors, Publishers
// ═══════════════════════════════════════════════════════════════════════════

export async function getCategories() {
  const categories = await db.category.findMany({
    include: {
      _count: { select: { books: true } },
    },
    orderBy: { name: 'asc' },
  });

  return {
    data: categories,
    success: true,
  } satisfies ApiResponse<typeof categories>;
}

export async function getAuthors() {
  const authors = await db.author.findMany({
    include: { _count: { select: { books: true } } },
    orderBy: { name: 'asc' },
  });

  return {
    data: authors,
    success: true,
  } satisfies ApiResponse<typeof authors>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Spaces (Study Rooms)
// ═══════════════════════════════════════════════════════════════════════════

export async function getStudyRooms() {
  const rooms = await db.studyRoom.findMany({
    where: { status: 'ACTIVE' },
    include: { floor: true },
    orderBy: [{ floor: { floorNumber: 'asc' } }, { name: 'asc' }],
  });

  return {
    data: rooms,
    success: true,
  } satisfies ApiResponse<typeof rooms>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Events
// ═══════════════════════════════════════════════════════════════════════════

export async function getEvents() {
  const events = await db.event.findMany({
    where: { status: 'PUBLISHED' },
    include: { _count: { select: { registrations: true } } },
    orderBy: { date: 'desc' },
    take: 20,
  });

  return {
    data: events,
    success: true,
  } satisfies ApiResponse<typeof events>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Digital Resources & Theses
// ═══════════════════════════════════════════════════════════════════════════

export async function getDigitalResources() {
  const resources = await db.digitalResource.findMany({
    orderBy: { title: 'asc' },
  });

  return {
    data: resources,
    success: true,
  } satisfies ApiResponse<typeof resources>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard stats
// ═══════════════════════════════════════════════════════════════════════════

export async function getDashboardStats() {
  const [
    totalBooks,
    totalCopies,
    availableCopies,
    totalUsers,
    activeBorrows,
    overdueBorrows,
    publishedEvents,
    totalStudyRooms,
  ] = await Promise.all([
    db.book.count(),
    db.bookCopy.count(),
    db.bookCopy.count({ where: { status: 'AVAILABLE' } }),
    db.user.count(),
    db.borrowTransaction.count({ where: { status: 'ACTIVE' } }),
    db.borrowTransaction.count({ where: { status: 'OVERDUE' } }),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.studyRoom.count({ where: { status: 'ACTIVE' } }),
  ]);

  return {
    data: {
      totalBooks,
      totalCopies,
      availableCopies,
      totalUsers,
      activeBorrows,
      overdueBorrows,
      publishedEvents,
      totalStudyRooms,
    },
    success: true,
  } satisfies ApiResponse<{
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    totalUsers: number;
    activeBorrows: number;
    overdueBorrows: number;
    publishedEvents: number;
    totalStudyRooms: number;
  }>;
}
