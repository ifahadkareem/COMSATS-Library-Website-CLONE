/**
 * useSession — Client-side session hook
 *
 * Fetches the current session on mount.
 * Returns { user, isLoading, error }.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

interface UseSessionReturn {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  /** Refetch the session */
  refresh: () => void;
}

export function useSession(): UseSessionReturn {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.status === 401) {
        setUser(null);
        setError(null);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { user, isLoading, error, refresh: fetchSession };
}
