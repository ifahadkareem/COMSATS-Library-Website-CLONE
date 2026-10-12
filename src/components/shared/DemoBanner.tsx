'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

/**
 * A dismissible banner indicating the application is a prototype/demo.
 * Should appear on content-heavy pages that display institutional information.
 */
export function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Prototype / Demo Application</p>
        <p className="mt-0.5 text-xs opacity-80">
          This is a modern redesign prototype. Library information is sourced from the official{' '}
          <a
            href="https://library.comsats.edu.pk/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            COMSATS Library website
          </a>
          . Statistics, member data, and transaction records shown are simulated.
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-amber-200/50 dark:hover:bg-amber-900/30"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
