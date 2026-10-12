'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, User, Calendar, Hash, Building2,
  Globe, FileText, Layers, MapPin, Bookmark, LogIn,
  Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink,
} from 'lucide-react';
import { PageEntrance, FadeIn, Badge, EmptyState } from '@/components/design-system';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Book Detail Page — /books/[id]
 *
 * Full OPAC bibliographic record with:
 *  - Cover, title, authors, description, all metadata
 *  - Copy availability table with status, location
 *  - Borrow / Reserve / Save actions
 *  - Related books (by category, author, subject)
 * ═══════════════════════════════════════════════════════════════ */

// ── Types ──

interface BookDetail {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  isbn?: string;
  subject?: string;
  publicationYear?: number;
  edition?: string;
  language: string;
  pages?: number;
  callNumber?: string;
  coverImage?: string;
  authors: { id: string; name: string }[];
  publisher: { id: string; name: string } | null;
  categories: { id: string; name: string }[];
  availability: {
    total: number;
    available: number;
    borrowed: number;
    reserved: number;
    other: number;
    isAvailable: boolean;
  };
  copies: Array<{
    id: string;
    accessionNumber: string;
    barcode: string;
    status: string;
    condition: string;
    location: {
      shelf: { code: string; section: string };
      floor: { name: string; floorNumber: number };
    } | null;
  }>;
  totalReservations: number;
  totalWishlists: number;
}

interface RelatedBook {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  mainCategory?: string;
  publicationYear?: number;
  callNumber?: string;
  availableCopies: number;
  totalCopies: number;
  status: 'available' | 'checked-out';
}

// ── Component ──

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [related, setRelated] = useState<RelatedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Fetch book data
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/catalog/${id}`).then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      }),
      fetch(`/api/catalog/${id}/related`).then((r) => r.json()),
    ])
      .then(([bookRes, relatedRes]) => {
        if (bookRes.success) {
          setBook(bookRes.data);
        } else {
          setError(bookRes.message);
        }
        if (relatedRes.success) {
          setRelated(relatedRes.data);
        }
      })
      .catch((err) => {
        setError('Failed to load book details.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-muted/60" />
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="aspect-[3/4] animate-pulse rounded-2xl bg-muted/60" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-muted/60" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-muted/60" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          icon={<BookOpen className="size-10" />}
          title={error || 'Book not found'}
          message="The requested book could not be found in our catalog."
          action={
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <ArrowLeft className="size-4" />
              Back to Catalog
            </Link>
          }
        />
      </div>
    );
  }

  const authorStr = book.authors.map((a) => a.name).join(', ');

  // Status config for copies
  const copyStatusConfig: Record<string, { icon: React.ElementType; className: string; label: string }> = {
    AVAILABLE: { icon: CheckCircle2, className: 'text-success', label: 'Available' },
    BORROWED: { icon: Clock, className: 'text-warning', label: 'Checked Out' },
    RESERVED: { icon: AlertCircle, className: 'text-primary', label: 'Reserved' },
    LOST: { icon: XCircle, className: 'text-error', label: 'Lost' },
    DAMAGED: { icon: XCircle, className: 'text-error', label: 'Damaged' },
    MAINTENANCE: { icon: Clock, className: 'text-muted-foreground', label: 'Maintenance' },
  };

  return (
    <PageEntrance>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Catalog
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          {/* ── Left Column: Cover ── */}
          <FadeIn direction="left" delay={0.1}>
            <div className="sticky top-8">
              {/* Cover image */}
              <div className={cn(
                'aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-border/50',
                'bg-surface-muted',
              )}>
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/30">
                    <BookOpen className="size-20" strokeWidth={1} />
                    <span className="text-xs font-medium uppercase tracking-widest">Book Cover</span>
                  </div>
                )}
              </div>

              {/* Quick actions below cover */}
              <div className="mt-4 flex gap-2">
                <ActionBtn
                  variant={book.availability.isAvailable ? 'primary' : 'outline'}
                  disabled={!book.availability.isAvailable}
                  icon={<Bookmark className="size-4" />}
                  label="Borrow"
                />
                <ActionBtn
                  variant="outline"
                  icon={<Clock className="size-4" />}
                  label="Reserve"
                />
                <ActionBtn
                  variant="outline"
                  icon={<Bookmark className="size-4" />}
                  label="Save"
                />
              </div>
            </div>
          </FadeIn>

          {/* ── Right Column: Details ── */}
          <FadeIn direction="right" delay={0.15}>
            <div>
              {/* Categories */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {book.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.id}`}
                    className="rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-1.5 text-lg text-muted-foreground">{book.subtitle}</p>
              )}

              {/* Authors */}
              <div className="mt-3 flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <p className="text-sm text-foreground">{authorStr}</p>
              </div>

              {/* Availability summary bar */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatPill
                  label="Total Copies"
                  value={book.availability.total}
                  className="bg-muted/40"
                />
                <StatPill
                  label="Available"
                  value={book.availability.available}
                  className="bg-success/5 border-success/20"
                  valueClassName="text-success"
                />
                <StatPill
                  label="Checked Out"
                  value={book.availability.borrowed}
                  className="bg-warning/5 border-warning/20"
                  valueClassName="text-warning"
                />
                <StatPill
                  label="Reserved"
                  value={book.availability.reserved}
                  className="bg-primary/5 border-primary/20"
                  valueClassName="text-primary"
                />
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-border/60" />

              {/* Description */}
              {book.description && (
                <div className="mb-8">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Bibliographic details grid */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Bibliographic Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetaRow icon={Hash} label="ISBN" value={book.isbn || 'N/A'} mono />
                  <MetaRow icon={Building2} label="Publisher" value={book.publisher?.name || 'N/A'} />
                  <MetaRow icon={Calendar} label="Published" value={book.publicationYear ? String(book.publicationYear) : 'N/A'} />
                  <MetaRow icon={FileText} label="Edition" value={book.edition || 'N/A'} />
                  <MetaRow icon={Globe} label="Language" value={book.language} />
                  <MetaRow icon={FileText} label="Pages" value={book.pages ? String(book.pages) : 'N/A'} />
                  <MetaRow icon={Hash} label="Call Number" value={book.callNumber || 'N/A'} mono />
                  <MetaRow icon={Layers} label="Subject" value={book.subject || 'N/A'} />
                </div>
              </div>

              {/* ── Physical Copies Table ── */}
              <div className="mb-10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Copy Availability & Location
                </h3>
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/70 bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Accession No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Condition
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Location
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {book.copies.map((copy) => {
                        const cfg = copyStatusConfig[copy.status] || copyStatusConfig.MAINTENANCE;
                        const StatusIcon = cfg.icon;
                        return (
                          <tr
                            key={copy.id}
                            className="border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-foreground">
                              {copy.accessionNumber}
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', cfg.className)}>
                                <StatusIcon className="size-3.5" />
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              <span className={cn(
                                'rounded-md px-1.5 py-0.5',
                                copy.condition === 'NEW' && 'bg-info/10 text-primary',
                                copy.condition === 'GOOD' && 'bg-success/10 text-success',
                                copy.condition === 'FAIR' && 'bg-warning/10 text-warning',
                                (copy.condition === 'POOR' || copy.condition === 'DAMAGED') && 'bg-error/10 text-error',
                              )}>
                                {copy.condition}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {copy.location ? (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="size-3" />
                                  {copy.location.floor.name} · {copy.location.shelf.section}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/50">Not assigned</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {copy.status === 'AVAILABLE' && (
                                <button className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                                  <Bookmark className="size-3" />
                                  Borrow
                                </button>
                              )}
                              {copy.status === 'BORROWED' && (
                                <button className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary/70 transition-colors hover:bg-primary/10">
                                  <Clock className="size-3" />
                                  Reserve
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── Related Books ── */}
        {related.length > 0 && (
          <FadeIn direction="up" delay={0.3} className="mt-12">
            <div>
              <h3 className="mb-6 text-lg font-semibold text-foreground">Related Books</h3>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {related.map((rb) => (
                  <Link key={rb.id} href={`/books/${rb.id}`} className="group block">
                    <div className="rounded-xl border border-border/70 bg-surface overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5">
                      <div className="aspect-[3/4] bg-surface-muted flex items-center justify-center">
                        <BookOpen className="size-8 text-muted-foreground/20" strokeWidth={1} />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {rb.title}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                          {rb.authors.join(', ')}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{rb.publicationYear}</span>
                          <Badge
                            variant="outline"
                            size="sm"
                            className={cn(
                              rb.status === 'available'
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                            )}
                          >
                            {rb.availableCopies}/{rb.totalCopies}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </PageEntrance>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Sub-components
 * ═══════════════════════════════════════════════════════════════ */

function MetaRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={cn('mt-0.5 text-sm text-foreground', mono && 'font-mono')}>{value}</p>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  className,
  valueClassName = 'text-foreground',
}: {
  label: string;
  value: number;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border/50 px-4 py-3', className)}>
      <p className={cn('text-xl font-bold', valueClassName)}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionBtn({
  variant,
  icon,
  label,
  disabled = false,
}: {
  variant: 'primary' | 'outline';
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
          : 'border border-border bg-surface text-foreground hover:bg-muted/60',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
