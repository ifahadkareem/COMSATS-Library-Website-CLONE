/**
 * Authentication & Authorization — COMSATS Library
 *
 * Server-side auth utilities using iron-session (encrypted cookies)
 * and bcryptjs (password hashing). Works with any Prisma-supported
 * database (currently SQLite, migration target: PostgreSQL).
 *
 * All authorization checks are server-side. Never trust client state.
 */

import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

/* ── Session data shape ── */
export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  isLoggedIn: true;
}

export type UserRole = 'STUDENT' | 'FACULTY' | 'LIBRARIAN' | 'ADMIN';

export const ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  LIBRARIAN: 'LIBRARIAN',
  ADMIN: 'ADMIN',
} as const;

/* ── Role → dashboard route mapping ── */
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  STUDENT: '/dashboard',
  FACULTY: '/dashboard',
  LIBRARIAN: '/librarian',
  ADMIN: '/admin',
};

/* ── Roles that can access a given route ── */
export const ROUTE_ALLOWED_ROLES: Record<string, UserRole[]> = {
  '/dashboard': ['STUDENT', 'FACULTY'],
  '/librarian': ['LIBRARIAN'],
  '/admin': ['ADMIN'],
};

/* ── iron-session config ── */
const SESSION_OPTIONS = {
  cookieName: 'comsats_library_session',
  password: process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production-min-32-chars',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};

/* ═══════════════════════════════════════════════════════════════
 * Session helpers (server-side only)
 * ═══════════════════════════════════════════════════════════════ */

/** Get the current session from the request cookies. */
export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
  return session;
}

/** Create a session after successful login. */
export async function createSession(user: {
  id: string;
  email: string;
  role: string;
}): Promise<SessionData> {
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role as UserRole;
  session.isLoggedIn = true;
  await session.save();
  return session;
}

/** Destroy the current session (logout). */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/* ═══════════════════════════════════════════════════════════════
 * Password utilities
 * ═══════════════════════════════════════════════════════════════ */

const SALT_ROUNDS = 12;

/** Hash a plaintext password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare a plaintext password against a stored hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ═══════════════════════════════════════════════════════════════
 * Server-side authorization guards
 * These must be called from Server Components or Route Handlers.
 * ═══════════════════════════════════════════════════════════════ */

export interface AuthResult {
  session: SessionData;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

/**
 * Require an authenticated user. Returns session + DB user.
 * Throws an error-like object that the caller can use for redirect.
 */
export async function requireAuth(): Promise<AuthResult | null> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!user || user.status !== 'ACTIVE') {
    // Session exists but user is gone or suspended — destroy it
    await destroySession();
    return null;
  }

  // Re-sync role from DB in case it changed
  session.role = user.role as UserRole;
  await session.save();

  return { session, user };
}

/**
 * Require a specific role. Returns auth data or null.
 */
export async function requireRole(roles: UserRole[]): Promise<AuthResult | null> {
  const auth = await requireAuth();
  if (!auth) return null;
  if (!roles.includes(auth.user.role as UserRole)) return null;
  return auth;
}

/**
 * Verify credentials and return user (or null if invalid).
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string; role: string; status: string } | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, email: true, role: true, status: true, passwordHash: true },
  });

  if (!user) return null;
  if (user.status !== 'ACTIVE') return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Generate a password reset token (demo: simple random string, not sent via email).
 */
export async function generateResetToken(email: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, status: true },
  });

  if (!user || user.status !== 'ACTIVE') return null;

  // In production, this would email the token. For this demo, we return it.
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  // Store token hash in passwordHash temporarily (demo only — real apps use a separate table)
  // For this demo, we just return the token and the user can use it directly.
  return token;
}

/**
 * Reset password using a token (demo: any valid email can reset).
 */
export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, status: true },
  });

  if (!user || user.status !== 'ACTIVE') return false;

  const hash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: hash },
  });

  return true;
}

/**
 * Create a user (for seeding / admin use).
 */
export async function createUser(data: {
  email: string;
  password: string;
  role: UserRole;
}) {
  const passwordHash = await hashPassword(data.password);
  return db.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role,
    },
  });
}

/** Check if any users exist in the database. */
export async function hasUsers(): Promise<boolean> {
  const count = await db.user.count();
  return count > 0;
}

/** Get the session config (for middleware). */
export { SESSION_OPTIONS };
