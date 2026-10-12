/**
 * ProtectedPage — Server Component wrapper
 *
 * Must be used in every protected route's page.tsx.
 * Performs server-side session validation and role checks.
 * Redirects to /login if not authenticated, or to the
 * user's own dashboard if they lack the required role.
 */

import { requireRole, type UserRole, type AuthResult } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface ProtectedPageProps {
  roles: UserRole[];
  children: (auth: AuthResult) => React.ReactNode;
}

export async function ProtectedPage({ roles, children }: ProtectedPageProps) {
  const auth = await requireRole(roles);

  if (!auth) {
    redirect('/login');
  }

  return <>{children(auth)}</>;
}
