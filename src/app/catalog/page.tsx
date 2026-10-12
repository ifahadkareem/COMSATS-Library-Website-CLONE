'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Search, SlidersHorizontal, X, ChevronDown, Library, User, Hash, Building2, Layers, Globe, MapPin, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { SearchBar, Pagination, LoadingSkeleton, EmptyState, PageEntrance, StaggerContainer, StaggerItem, Badge } from '@/components/design-system';
import type { SearchSuggestion } from '@/components/design-system';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * OPAC Catalog Page — COMSATS Library
 *
 * Full-featured online public access catalog with:
 *  - Multi-field search (title, author, ISBN, subject, publisher, call number, keyword)
 *  - Advanced filters (availability, category, author, year, language, floor)
 *  - Sorting (relevance, title, newest, oldest)
 *  - Debounced search with suggestions
 *  - Loading, empty, and error states
 *  - Pagination
 * ═══════════════════════════════════════════════════════════════ */

// ── Types ──

interface BookResult {
  id: string;
  title: string;
  subtitle?: string;
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
  mainCategory?: string;
  copies: { total: number; available: number; borrowed: number; reserved: number };
  floorNumbers: number[];
  availabilityStatus: string;
}

interface FilterOption {
  id?: string;
  name: string;
  count?: number;
 floorNumber?: number;
 year?: number;
  [key: string]: unknown;
}

interface FiltersData {
  categories: FilterOption[];
  authors: FilterOption[];
  years: { min: number | null; max: number | null; distribution: { year: number; count: number }[] };
  languages: { name: string; count: number }[];
  floors: FilterOption[];
}

// ── Constants ──

const SEARCH_FIELDS = [
  { value: 'keyword', label: 'All Fields' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'isbn', label: 'ISBN' },
  { value: 'subject', label: 'Subject' },
  { value: 'publisher', label: 'Publisher' },
  { value: 'callNumber', label: 'Call Number' },
] as const;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
] as const;

const RESULTS_PER_PAGE = 16;

// ── Component ──

export default function CatalogPage() {
  // Search state
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('keyword');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);

  // Data state
  const [books, setBooks] = useState<BookResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<FiltersData | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refs
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchFieldRef = useRef<HTMLSelectElement>(null);

  // ── Fetch filters on mount ──
  useEffect(() => {
    fetch('/api/catalog/filters')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setFilters(res.filters);
      })
      .catch(() => {});
  }, []);

  // ── Search suggestions (debounced) ──
  const fetchSuggestions = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/catalog/suggestions?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(
            data.suggestions.map((s: { id: string; type: string; label: string; description?: string }) => ({
              id: s.id,
              label: s.label,
              description: s.description,
              icon: s.type === 'author' ? <User className="size-4" /> : s.type === 'subject' ? <Layers className="size-4" /> : <BookOpen className="size-4" />,
            }))
          );
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const handleSearchValueChange = useCallback(
    (value: string) => {
      setQuery(value);
      fetchSuggestions(value);
    },
    [fetchSuggestions],
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setQuery(suggestion.label);
      setSuggestions([]);
      // If it's an author suggestion, switch to author search
      if (suggestion.id.startsWith('a-')) {
        setSearchField('author');
      } else if (suggestion.id.startsWith('s-')) {
        setSearchField('subject');
      } else {
        setSearchField('title');
      }
      // Trigger search
      handleSearch(suggestion.label);
    },
    [],
  );

  // ── Main search ──
  const handleSearch = useCallback(
    (searchValue?: string) => {
      const q = searchValue ?? query;
      setSubmittedQuery(q);
      setPage(1);
      setSuggestions([]);
      setIsInitialLoad(false);
    },
    [query],
  );

  // ── Fetch search results ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (submittedQuery) params.set('q', submittedQuery);
    params.set('field', searchField);
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('limit', String(RESULTS_PER_PAGE));

    if (availability === 'available') params.set('availability', 'available');
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedAuthors.length > 0) params.set('authors', selectedAuthors.join(','));
    if (yearFrom) params.set('yearFrom', yearFrom);
    if (yearTo) params.set('yearTo', yearTo);
    if (selectedLanguages.length > 0) params.set('languages', selectedLanguages.join(','));
    if (selectedFloors.length > 0) params.set('floors', selectedFloors.join(','));

    setIsLoading(true);
    setError(null);

    fetch(`/api/catalog/search?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error('Search failed');
        return r.json();
      })
      .then((res) => {
        if (res.success) {
          setBooks(res.data);
          setTotalResults(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        } else {
          setError(res.message || 'Search failed');
        }
      })
      .catch((err) => {
        setError('Failed to connect to the catalog. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, [submittedQuery, searchField, sort, page, availability, selectedCategories, selectedAuthors, yearFrom, yearTo, selectedLanguages, selectedFloors]);

  // ── Reset filters ──
  const clearFilters = useCallback(() => {
    setAvailability('all');
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setYearFrom('');
    setYearTo('');
    setSelectedLanguages([]);
    setSelectedFloors([]);
    setPage(1);
  }, []);

  const activeFilterCount = [
    availability !== 'all',
    selectedCategories.length > 0,
    selectedAuthors.length > 0,
    yearFrom || yearTo,
    selectedLanguages.length > 0,
    selectedFloors.length > 0,
  ].filter(Boolean).length;

  // ── Render ──
  return (
    <PageEntrance>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Library Catalog
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-muted-foreground">
            Search and browse our collection of books, journals, and academic materials
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-6 space-y-4">
          {/* Search field selector + search bar */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              ref={searchFieldRef}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="h-11 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring/40 focus:ring-2 focus:ring-ring/20 sm:w-44"
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <div className="flex-1">
              <SearchBar
                value={query}
                onValueChange={handleSearchValueChange}
                onSubmit={handleSearch}
                suggestions={suggestions}
                onSuggestionSelect={handleSuggestionSelect}
                isLoading={isLoading}
                placeholder="Search by title, author, ISBN, subject, keyword..."
                size="lg"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'relative flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all',
                showFilters
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-surface text-foreground hover:bg-muted/60'
              )}
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className={cn(
                  'flex size-5 items-center justify-center rounded-full text-[11px] font-bold',
                  showFilters ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                )}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active search summary */}          {submittedQuery && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="size-3.5" />
              <span>
                {totalResults > 0
                  ? `Showing ${totalResults.toLocaleString()} result${totalResults !== 1 ? 's' : ''} for "${submittedQuery}"`
                  : `No results for "${submittedQuery}"`}
              </span>
              {submittedQuery && (
                <button
                  onClick={() => { setQuery(''); setSubmittedQuery(''); setPage(1); }}
                  className="ml-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs hover:bg-muted/60"
                >
                  <X className="size-3" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Advanced Filters Panel ── */}
        {showFilters && (
          <div className="mb-8 rounded-2xl border border-border/70 bg-surface p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Availability */}
              <FilterSection label="Availability">
                <FilterChip
                  active={availability === 'all'}
                  onClick={() => { setAvailability('all'); setPage(1); }}
                >
                  All Items
                </FilterChip>
                <FilterChip
                  active={availability === 'available'}
                  onClick={() => { setAvailability('available'); setPage(1); }}
                >
                  Available Only
                </FilterChip>
              </FilterSection>

              {/* Categories */}
              <FilterSection label="Category">
                <div className="flex flex-wrap gap-1.5">
                  {filters?.categories.map((cat) => (
                    <FilterChip
                      key={cat.id}
                      active={selectedCategories.includes(cat.id!)}
                      onClick={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(cat.id!) ? prev.filter((c) => c !== cat.id!) : [...prev, cat.id!]
                        );
                        setPage(1);
                      }}
                    >
                      {cat.name} <span className="text-[10px] opacity-60">({cat.count})</span>
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>

              {/* Publication Year */}
              <FilterSection label="Publication Year">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={yearFrom}
                    onChange={(e) => { setYearFrom(e.target.value); setPage(1); }}
                    placeholder={filters?.years.min?.toString() || 'From'}
                    className="h-8 w-full rounded-lg border border-border bg-surface-muted px-2.5 text-sm outline-none focus:border-ring/40 focus:ring-1 focus:ring-ring/20"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="number"
                    value={yearTo}
                    onChange={(e) => { setYearTo(e.target.value); setPage(1); }}
                    placeholder={filters?.years.max?.toString() || 'To'}
                    className="h-8 w-full rounded-lg border border-border bg-surface-muted px-2.5 text-sm outline-none focus:border-ring/40 focus:ring-1 focus:ring-ring/20"
                  />
                </div>
              </FilterSection>

              {/* Language */}
              <FilterSection label="Language">
                <div className="flex flex-wrap gap-1.5">
                  {filters?.languages.map((lang) => (
                    <FilterChip
                      key={lang.name}
                      active={selectedLanguages.includes(lang.name)}
                      onClick={() => {
                        setSelectedLanguages((prev) =>
                          prev.includes(lang.name) ? prev.filter((l) => l !== lang.name) : [...prev, lang.name]
                        );
                        setPage(1);
                      }}
                    >
                      {lang.name} <span className="text-[10px] opacity-60">({lang.count})</span>
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>

              {/* Floor / Location */}
              <FilterSection label="Floor / Location">
                <div className="flex flex-wrap gap-1.5">
                  {filters?.floors.map((floor) => (
                    <FilterChip
                      key={floor.id}
                      active={selectedFloors.includes(floor.floorNumber!)}
                      onClick={() => {
                        setSelectedFloors((prev) =>
                          prev.includes(floor.floorNumber!) ? prev.filter((f) => f !== floor.floorNumber!) : [...prev, floor.floorNumber!]
                        );
                        setPage(1);
                      }}
                    >
                      {floor.name}
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>

              {/* Authors (scrollable) */}
              <FilterSection label="Author">
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {filters?.authors.slice(0, 12).map((author) => (
                    <FilterChip
                      key={author.id}
                      active={selectedAuthors.includes(author.id!)}
                      onClick={() => {
                        setSelectedAuthors((prev) =>
                          prev.includes(author.id!) ? prev.filter((a) => a !== author.id!) : [...prev, author.id!]
                        );
                        setPage(1);
                      }}
                    >
                      {author.name}
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>
            </div>
          </div>
        )}

        {/* ── Results Header (Sort + View) ── */}
        {!isInitialLoad && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {totalResults > 0 && (
                <>
                  Page {page} of {totalPages}
                  <span className="mx-2 text-border">|</span>
                  {totalResults.toLocaleString()} results
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Sort by</label>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="h-8 rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring/40"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── Content Area ── */}
        {isInitialLoad ? (
          // Initial load state: prompt to search
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
              <Library className="size-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Search the Catalog</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Enter a title, author name, ISBN, subject, or keyword to find books in our collection.
              Use the filters to narrow down your search.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Algorithms', 'Machine Learning', 'Physics', 'Calculus', 'Economics'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); handleSearch(term); }}
                  className="rounded-full border border-border/70 bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton variant="book-card" count={8} />
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => handleSearch()}
              className="mt-6 flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="size-10" />}
            title="No results found"
            message={submittedQuery
              ? `We couldn't find any books matching "${submittedQuery}". Try adjusting your search terms or filters.`
              : 'Start a search to find books in our catalog.'}
          />
        ) : (
          <>
            {/* Book grid */}
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <StaggerItem key={book.id}>
                  <CatalogBookCard book={book} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  showInfo
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageEntrance>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * CatalogBookCard — OPAC-specific book card
 *
 * Designed to look like a library catalog entry, not an
 * e-commerce product. Emphasizes call number, availability,
 * and location information.
 * ═══════════════════════════════════════════════════════════════ */

function CatalogBookCard({ book }: { book: BookResult }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    available: { label: 'Available', className: 'bg-success/10 text-success border-success/20' },
    'checked-out': { label: 'Checked Out', className: 'bg-warning/10 text-warning border-warning/20' },
    reserved: { label: 'Reserved', className: 'bg-primary/10 text-primary border-primary/20' },
    unavailable: { label: 'Unavailable', className: 'bg-error/10 text-error border-error/20' },
  };

  const status = statusConfig[book.availabilityStatus] || statusConfig.unavailable;
  const authorStr = book.authors.map((a) => a.name).join(', ');

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className={cn(
        'h-full rounded-2xl border border-border/70 bg-surface overflow-hidden',
        'transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5',
      )}>
        {/* Cover area */}
        <div className="relative aspect-[3/4] bg-surface-muted overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                <BookOpen className="size-12" strokeWidth={1} />
                <span className="text-[10px] font-medium uppercase tracking-wider">No Cover</span>
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="outline" size="sm" className={cn('backdrop-blur-sm', status.className)}>
              {book.copies.available > 0 ? `${book.copies.available} Available` : status.label}
            </Badge>
          </div>

          {/* Floor badge */}
          {book.floorNumbers.length > 0 && (
            <div className="absolute bottom-2.5 right-2.5">
              <Badge variant="secondary" size="sm" className="backdrop-blur-sm">
                Floor {book.floorNumbers[0]}
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Call number */}
          {book.callNumber && (
            <p className="mb-1.5 font-mono text-[11px] text-muted-foreground tracking-tight">
              {book.callNumber}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {authorStr}
          </p>

          {/* Metadata row */}
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {book.publicationYear && <span>{book.publicationYear}</span>}
            {book.publicationYear && book.language && <span className="text-border">·</span>}
            <span>{book.language}</span>
          </div>

          {/* Category */}
          {book.mainCategory && (
            <div className="mt-2">
              <span className="inline-flex rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {book.mainCategory}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Filter UI Components
 * ═══════════════════════════════════════════════════════════════ */

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-all',
        active
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-border/70 bg-surface-muted/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}
