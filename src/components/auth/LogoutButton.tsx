/**
 * LogoutButton — Client Component
 *
 * Calls the logout API route and redirects to home.
 */

'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export function LogoutButton({ variant = 'ghost', size = 'sm' }: { variant?: 'ghost' | 'outline'; size?: 'sm' | 'default' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore — the cookie clearing is the important part
    }
    router.push('/');
    router.refresh();
  }, [router]);

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
      Sign Out
    </Button>
  );
}