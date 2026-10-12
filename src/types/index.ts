import { type Prisma } from "@prisma/client";

// ═══════════════════════════════════════════════════════════════════════════
// Database model types — re-exports for convenience
// ═══════════════════════════════════════════════════════════════════════════

// ── Users & profiles ──
export type User = Prisma.UserGetPayload<object>;
export type StudentProfile = Prisma.StudentProfileGetPayload<{
  include: { user: true; department: true; program: true; membership: true };
}>;
export type FacultyProfile = Prisma.FacultyProfileGetPayload<{
  include: { user: true; department: true };
}>;
export type LibraryStaff = Prisma.LibraryStaffGetPayload<{
  include: { user: true };
}>;
export type LibraryMembership = Prisma.LibraryMembershipGetPayload<{
  include: { user: true };
}>;

// ── Organization ──
export type Department = Prisma.DepartmentGetPayload<object>;
export type Program = Prisma.ProgramGetPayload<{
  include: { department: true };
}>;

// ── Catalog ──
export type Book = Prisma.BookGetPayload<{
  include: { publisher: true; authors: { include: { author: true } }; categories: { include: { category: true } } };
}>;
export type BookCopy = Prisma.BookCopyGetPayload<{
  include: { book: true; shelf: { include: { floor: true } } };
}>;
export type Author = Prisma.AuthorGetPayload<object>;
export type Publisher = Prisma.PublisherGetPayload<object>;
export type Category = Prisma.CategoryGetPayload<object>;

// ── Circulation ──
export type BorrowTransaction = Prisma.BorrowTransactionGetPayload<{
  include: { user: true; copy: { include: { book: true; shelf: true } }; fines: true };
}>;
export type Reservation = Prisma.ReservationGetPayload<{
  include: { user: true; book: true };
}>;
export type Wishlist = Prisma.WishlistGetPayload<{
  include: { book: true };
}>;
export type Fine = Prisma.FineGetPayload<{
  include: { user: true; transaction: true };
}>;

// ── Spaces ──
export type Floor = Prisma.FloorGetPayload<object>;
export type Shelf = Prisma.ShelfGetPayload<{
  include: { floor: true };
}>;
export type StudyRoom = Prisma.StudyRoomGetPayload<{
  include: { floor: true };
}>;
export type RoomBooking = Prisma.RoomBookingGetPayload<{
  include: { room: { include: { floor: true } }; user: true };
}>;

// ── Content ──
export type Announcement = Prisma.AnnouncementGetPayload<object>;
export type Event = Prisma.EventGetPayload<object>;
export type EventRegistration = Prisma.EventRegistrationGetPayload<{
  include: { user: true; event: true };
}>;
export type DigitalResource = Prisma.DigitalResourceGetPayload<object>;
export type Thesis = Prisma.ThesisGetPayload<{
  include: { department: true; program: true };
}>;

// ── System ──
export type Notification = Prisma.NotificationGetPayload<object>;
export type AuditLog = Prisma.AuditLogGetPayload<{
  include: { user: true };
}>;

// ═══════════════════════════════════════════════════════════════════════════
// Enums (String union types matching schema comments)
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = 'STUDENT' | 'FACULTY' | 'LIBRARIAN' | 'ADMIN';
export type GeneralStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED';
export type CopyStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED' | 'MAINTENANCE';
export type BorrowStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'LOST';
export type FineStatus = 'PENDING' | 'PAID' | 'WAIVED';
export type RoomType = 'READING_ROOM' | 'STUDY_ROOM' | 'COMPUTER_LAB' | 'SEMINAR_ROOM';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AccessType = 'FREE' | 'INSTITUTIONAL' | 'RESTRICTED';
export type NotificationType = 'BORROW' | 'RETURN' | 'OVERDUE' | 'RESERVATION' | 'FINE' | 'ANNOUNCEMENT' | 'SYSTEM';
export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
export type MembershipStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
export type ReservationStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type CopyCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';

// ═══════════════════════════════════════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════════════════════════════════════

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// API response wrappers
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// UI state types
// ═══════════════════════════════════════════════════════════════════════════

export interface ToastMessage {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  value: string | string[];
  operator?: 'eq' | 'contains' | 'gte' | 'lte' | 'in';
}

// ═══════════════════════════════════════════════════════════════════════════
// Auth
// ═══════════════════════════════════════════════════════════════════════════

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  expiresAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Library-specific
// ═══════════════════════════════════════════════════════════════════════════

export interface BookSearchFilters {
  query?: string;
  category?: string;
  author?: string;
  availability?: 'available' | 'all';
  sortBy?: 'title' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface SpaceAvailability {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}
