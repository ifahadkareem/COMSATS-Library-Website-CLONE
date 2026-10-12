'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageEntrance, EmptyState, StaggerContainer, StaggerItem } from '@/components/design-system';
import { Heart, Trash2, BookOpen, CheckCircle2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════ */

interface WishlistBook {
  id: string;
  bookId: string;
  bookTitle: string;
  authors: string;
  coverImage: string | null;
  category: string | null;
  publicationYear: number | null;
  addedAt: string;
  availability: { total: number; available: number };
}

export function WishlistClient({ wishlist: initial }: { wishlist: WishlistBook[] }) {
  const [list, setList] = useState(initial);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch('/api/dashboard/wishlist-remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlistId: id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Removed from wishlist');
        setList((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-8">
      <PageEntrance>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.length} saved book{list.length !== 1 ? 's' : ''} for later reading
          </p>
        </div>
      </PageEntrance>

      {list.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-10" />}
          title="Your wishlist is empty"
          message="Save books from the catalog to build your reading list."
          action={
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              <BookOpen className="size-4" />
              Browse Catalog
            </Link>
          }
        />
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((book) => (
            <StaggerItem key={book.id}>
              <div className="group relative rounded-2xl border border-border/60 bg-surface overflow-hidden transition-all duration-300 hover:shadow-elevated">
                {/* Cover */}
                <Link
                  href={`/books/${book.bookId}`}
                  className="relative block aspect-[3/4] bg-surface-muted overflow-hidden"
                >
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.bookTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="size-10 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Availability badge */}
                  <div className="absolute top-3 left-3">
                    {book.availability.available > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-success/90 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <CheckCircle2 className="size-3" />
                        {book.availability.available}/{book.availability.total} available
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-lg bg-error/90 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(book.id);
                    }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-error hover:text-white"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link
                    href={`/books/${book.bookId}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                  >
                    {book.bookTitle}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{book.authors}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {book.category && <span>{book.category}</span>}
                    {book.publicationYear && <span>· {book.publicationYear}</span>}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
