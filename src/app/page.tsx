'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, BookOpen, Monitor, GraduationCap, MapPin, Calendar,
  ArrowRight, ExternalLink, Users, Database, FileText,
  Megaphone, Clock, ChevronRight, Library, Building2,
  Video, Presentation, Laptop, BookMarked, Palette, Coffee,
  Newspaper, MonitorPlay, Globe, Wrench, Lightbulb, Phone,
  BookCheck, Wifi, Headphones, Shield,
} from 'lucide-react';

import {
  libraryInfo, officialServices, officialSpaces,
  researcherCornerResources, hecCornerResources,
  getImagesByCategory, getImage,
} from '@/lib/content';
import {
  SearchBar, DSCard, DSCardHeader, DSCardContent, DSCardFooter,
  BookCard, StatCard, Badge, Breadcrumb,
  PageEntrance, StaggerContainer, StaggerItem, CardHover, FadeIn,
} from '@/components/design-system';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
 * Homepage — COMSATS Junaid Zaidi Library
 * Built with the Liquid Knowledge Design System
 *
 * Sections:
 *  1. Hero (full-bleed with official image, stats strip)
 *  2. Search (large central with category tabs)
 *  3. Quick Actions (4 primary access points)
 *  4. Popular Books (top 5, horizontal scroll on mobile)
 *  5. New Arrivals (latest 5 additions)
 *  6. Library Spaces (official 9 spaces with icons)
 *  7. Research Resources (Researcher Corner + HEC Corner)
 *  8. Upcoming Events + Announcements (side-by-side)
 *  9. Library Services (7 official services)
 * 10. Photo Strip (official library photographs)
 * 11. CTA (visit official website)
 * ═══════════════════════════════════════════════════════════════ */

// ── Icon map for content modules ──
const iconMap: Record<string, React.ElementType> = {
  Search, Monitor, GraduationCap, Calendar, MapPin, Database, Globe,
  Lightbulb, BookOpen, FileText, Users, Video, Presentation,
  Laptop, BookMarked, Palette, Coffee, Library, Building2,
  Newspaper, MonitorPlay, Wrench,
};

// ── Search suggestions ──
const searchSuggestions = [
  { id: '1', label: 'Introduction to Algorithms', description: 'Thomas H. Cormen \u00b7 Computer Science', icon: <BookOpen className="size-4" /> },
  { id: '2', label: 'Machine Learning: A Probabilistic Perspective', description: 'Kevin P. Murphy \u00b7 Artificial Intelligence', icon: <BookOpen className="size-4" /> },
  { id: '3', label: 'Digital Signal Processing', description: 'Subject search \u00b7 EE-301', icon: <FileText className="size-4" /> },
  { id: '4', label: 'Data Structures and Algorithms in Java', description: 'Adam Drozdek \u00b7 Computer Science', icon: <BookOpen className="size-4" /> },
  { id: '5', label: 'Research Methods in Education', description: 'Louis Cohen \u00b7 Education', icon: <GraduationCap className="size-4" /> },
  { id: '6', label: 'Thesis \u2014 Machine Learning Approaches', description: 'CUI Thesis Catalog \u00b7 2024', icon: <FileText className="size-4" /> },
];

// ── Search category tabs ──
const searchTabs = ['All', 'Books', 'Journals', 'Theses', 'Digital'] as const;

// ── Quick actions ──
const quickActions = [
  { title: 'Search Catalog', description: 'Find books, journals, and theses in our OPAC', icon: Search, href: '/catalog', color: 'bg-primary/8 text-primary' },
  { title: 'Digital Resources', description: 'HEC Digital Library, e-books, and databases', icon: Database, href: '/resources', color: 'bg-secondary/10 text-secondary' },
  { title: 'Thesis Catalog', description: 'Browse CUI theses and dissertations', icon: FileText, href: '/resources', color: 'bg-gold/10 text-gold' },
  { title: 'Study Spaces', description: 'Book rooms, cubicles, and reading areas', icon: MapPin, href: '/spaces', color: 'bg-success/10 text-success' },
];

// ── Demo books (clearly marked as demo data) ──
const demoPopularBooks = [
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', callNumber: 'QA76.6 .C66', year: 2009, status: 'available' as const, category: 'Computer Science' },
  { title: 'Machine Learning', author: 'Christopher M. Bishop', callNumber: 'Q325.5 .B57', year: 2006, status: 'checked-out' as const, category: 'AI & ML' },
  { title: 'Clean Code', author: 'Robert C. Martin', callNumber: 'QA76.73 .M37', year: 2008, status: 'available' as const, category: 'Software Engineering' },
  { title: 'Design Patterns', author: 'Erich Gamma et al.', callNumber: 'QA76.64 .D47', year: 1994, status: 'available' as const, category: 'Software Engineering' },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', callNumber: 'Q335 .R86', year: 2020, status: 'reserved' as const, category: 'AI & ML' },
];

const demoNewArrivals = [
  { title: 'Deep Learning', author: 'Ian Goodfellow', callNumber: 'Q325.5 .G66', year: 2016, status: 'available' as const, category: 'AI & ML' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', callNumber: 'QA76.6 .T46', year: 2019, status: 'available' as const, category: 'Software Engineering' },
  { title: 'Computer Networking', author: 'James Kurose', callNumber: 'TK5105.5 .K88', year: 2021, status: 'available' as const, category: 'Networking' },
  { title: 'Operating Systems', author: 'Abraham Silberschatz', callNumber: 'QA76.76 .O63', year: 2018, status: 'checked-out' as const, category: 'Systems' },
  { title: 'Database System Concepts', author: 'Avi Silberschatz', callNumber: 'QA76.9 .D3', year: 2019, status: 'available' as const, category: 'Databases' },
];

// ── Demo events ──
const demoEvents = [
  { title: 'Research Methods Workshop', date: 'Sep 15, 2026', time: '10:00 AM', location: 'Conference Room', type: 'Workshop' as const },
  { title: 'Information Literacy Session', date: 'Sep 22, 2026', time: '2:00 PM', location: 'Video Conference Room', type: 'Training' as const },
  { title: 'Book Club: September Read', date: 'Sep 28, 2026', time: '3:00 PM', location: 'Reading Corner', type: 'Event' as const },
  { title: 'Turnitin Workshop for Researchers', date: 'Oct 3, 2026', time: '11:00 AM', location: 'PhD Research Lab', type: 'Workshop' as const },
];

// ── Demo announcements ──
const demoAnnouncements = [
  { title: 'Extended Hours During Finals', message: 'Library will remain open until midnight during the fall 2026 final examination period to accommodate students.', date: 'Aug 20, 2026', priority: 'high' as const },
  { title: 'New HEC Database Subscriptions', message: 'Access to 12 new research databases is now available through the HEC Digital Library portal.', date: 'Aug 15, 2026', priority: 'normal' as const },
  { title: 'Self-Service Kiosk Now Available', message: 'A new self-service check-in and check-out kiosk has been installed at the main entrance for quick transactions.', date: 'Aug 10, 2026', priority: 'normal' as const },
  { title: 'Library Orientation for New Students', message: 'Orientation sessions for Fall 2026 new students will be held during the first week of September.', date: 'Aug 5, 2026', priority: 'normal' as const },
];

// ── Space icon map ──
const spaceIconMap: Record<string, React.ElementType> = {
  Video, Presentation, Users, Laptop, BookOpen, GraduationCap, BookMarked, Palette, Coffee,
};

// ── Event type badge config ──
const eventTypeConfig: Record<string, string> = {
  Workshop: 'bg-primary/8 text-primary',
  Training: 'bg-secondary/10 text-secondary',
  Event: 'bg-gold/10 text-gold',
};

// ── Library stats (demo data) ──
const libraryStats = [
  { icon: <BookOpen className="size-5" />, value: '125,000+', label: 'Books & Volumes' },
  { icon: <Database className="size-5" />, value: '40,000+', label: 'E-Resources' },
  { icon: <GraduationCap className="size-5" />, value: '8,500+', label: 'Theses & Dissertations' },
  { icon: <FileText className="size-5" />, value: '200+', label: 'Journal Subscriptions' },
];

// ── Additional services for the services section ──
const additionalServices = [
  { name: 'Circulation & Lending', description: 'Borrow, return, and renew library materials with your valid CUI ID card.', icon: BookCheck },
  { name: 'Wi-Fi & Computer Lab', description: 'High-speed Wi-Fi and computer workstations available throughout the library.', icon: Wifi },
  { name: 'Research Consultation', description: 'One-on-one research support from qualified librarians and subject specialists.', icon: Headphones },
  { name: 'Information Security', description: 'Secure environment with surveillance, gate control, and digital access management.', icon: Shield },
];

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState<typeof searchTabs[number]>('All');
  const heroImage = getImage('main-reading-hall');
  const buildingImage = getImage('library-building-front');

  const handleSearch = useCallback((value: string) => {
    console.log('Search:', value, 'Category:', activeSearchTab);
  }, [activeSearchTab]);

  return (
    <PageEntrance>
      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION
          Full-bleed with official library image, headline, CTAs,
          and a translucent stats strip at the bottom.
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[540px] sm:min-h-[600px] lg:min-h-[680px]">
        {/* Background image */}
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage.srcWebp}
              alt={heroImage.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
            />
            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-navy/40" />
          </div>
        )}

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 sm:pt-32 sm:pb-36 lg:px-8 lg:pt-40 lg:pb-44">
          <div className="max-w-2xl">
            <FadeIn>
              <p className="text-caption text-navy-foreground/60 uppercase tracking-widest">
                {libraryInfo.university}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-4 text-display text-navy-foreground">
                Discover. Research. Learn.
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-5 text-lg leading-relaxed text-navy-foreground/70 sm:text-xl">
                Explore thousands of books, journals, and digital resources.
                Your gateway to knowledge at the {libraryInfo.name}.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  <a href="#homepage-search">
                    <Search className="size-4" />
                    Search Library
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl border-white/25 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/resources">
                    Explore Resources
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Stats strip — floats at the bottom of hero */}
        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 -mb-px">
              {libraryStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  variant="navy"
                  className="rounded-none border-navy/20 lg:rounded-t-xl first:lg:rounded-l-xl last:lg:rounded-r-xl lg:rounded-b-none"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. SEARCH SECTION
          Large central search bar with category filter tabs.
          ═══════════════════════════════════════════════════════ */}
      <section id="homepage-search" className="relative z-20 -mt-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeIn>
            <div className="rounded-2xl bg-surface border border-border/70 shadow-elevated p-4 sm:p-6">
              {/* Category tabs */}
              <div className="mb-4 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {searchTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSearchTab(tab)}
                    className={cn(
                      'shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                      activeSearchTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Search bar */}
              <SearchBar
                value={searchValue}
                onValueChange={setSearchValue}
                onSubmit={handleSearch}
                suggestions={searchSuggestions}
                placeholder={activeSearchTab === 'All'
                  ? 'Search books, authors, subjects, ISBN...'
                  : `Search ${activeSearchTab.toLowerCase()}...`
                }
                size="lg"
                variant="default"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. QUICK ACTIONS
          4 primary access points with icon, title, description, and link.
          ═══════════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-10">
              <h2 className="text-h2">Quick Access</h2>
              <p className="mt-2 text-body text-muted-foreground">
                Start exploring the library&apos;s core services and resources
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <StaggerItem key={action.title}>
                  <Link href={action.href} className="block h-full group">
                    <CardHover>
                      <DSCard hoverable padding="lg" className="h-full">
                        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110', action.color)}>
                          <Icon className="size-5" />
                        </div>
                        <h3 className="text-body font-semibold text-foreground">{action.title}</h3>
                        <p className="mt-1.5 text-small line-clamp-2">{action.description}</p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                          <span>Go</span>
                          <ChevronRight className="size-3.5" />
                        </div>
                      </DSCard>
                    </CardHover>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. POPULAR BOOKS
          Top 5 frequently accessed titles. Horizontal scroll on mobile.
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-caption text-primary uppercase tracking-wider">Collection</p>
                <h2 className="mt-1 text-h2">Popular Books</h2>
                <p className="mt-1 text-small">Frequently accessed titles across all departments</p>
              </div>
              <Link
                href="/catalog"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark sm:flex"
              >
                View Catalog <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <StaggerContainer className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
              {demoPopularBooks.map((book) => (
                <StaggerItem key={book.title} className="shrink-0 w-56 sm:w-auto snap-start">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    callNumber={book.callNumber}
                    year={book.year}
                    status={book.status}
                    category={book.category}
                    size="detailed"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <Link
            href="/catalog"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary sm:hidden"
          >
            View Catalog <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. NEW ARRIVALS
          Latest 5 additions to the collection.
          ═══════════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-caption text-secondary uppercase tracking-wider">Recently Added</p>
                  <Badge variant="info" size="sm">New</Badge>
                </div>
                <h2 className="mt-1 text-h2">New Arrivals</h2>
                <p className="mt-1 text-small">Latest additions to our collection</p>
              </div>
              <Link
                href="/catalog"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark sm:flex"
              >
                Browse All <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <StaggerContainer className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
              {demoNewArrivals.map((book) => (
                <StaggerItem key={book.title} className="shrink-0 w-56 sm:w-auto snap-start">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    callNumber={book.callNumber}
                    year={book.year}
                    status={book.status}
                    category={book.category}
                    size="detailed"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <Link
            href="/catalog"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary sm:hidden"
          >
            Browse All <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. LIBRARY SPACES
          All 9 official spaces from the website with icons.
          Featured image card on the left for desktop.
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-subtle py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-caption text-primary uppercase tracking-wider">Facilities</p>
                <h2 className="mt-1 text-h2">Library Spaces</h2>
                <p className="mt-1 text-small">Modern spaces designed for study, collaboration, and research</p>
              </div>
              <Link
                href="/spaces"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark sm:flex"
              >
                All Spaces <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Desktop: Featured image + grid; Mobile: grid only */}
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Featured image card — desktop only */}
            <FadeIn direction="right" className="hidden lg:block lg:col-span-4">
              <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl">
                {buildingImage && (
                  <Image
                    src={buildingImage.srcWebp}
                    alt={buildingImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 0vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-h3 text-white">Explore Our Spaces</h3>
                  <p className="mt-1.5 text-sm text-white/70">
                    {officialSpaces.length} unique spaces for every need
                  </p>
                  <Link
                    href="/spaces"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/90 transition-colors"
                  >
                    View All <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Space cards grid */}
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              {officialSpaces.slice(0, 6).map((space) => {
                const Icon = spaceIconMap[space.icon] || Building2;
                return (
                  <StaggerItem key={space.name}>
                    <Link href="/spaces" className="block h-full group">
                      <CardHover>
                        <DSCard hoverable padding="lg" className="h-full">
                          <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform group-hover:scale-110">
                              <Icon className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-body font-semibold text-foreground">{space.name}</h3>
                                {space.bookable && (
                                  <Badge variant="info" size="sm">Bookable</Badge>
                                )}
                              </div>
                              <p className="mt-1.5 text-small line-clamp-2">{space.description}</p>
                            </div>
                          </div>
                        </DSCard>
                      </CardHover>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Mobile: show remaining spaces link */}
          <Link
            href="/spaces"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary sm:hidden"
          >
            All {officialSpaces.length} Spaces <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. RESEARCH RESOURCES
          Split panel: Researcher Corner + HEC Corner side-by-side.
          ═══════════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8">
              <p className="text-caption text-primary uppercase tracking-wider">Scholarly Support</p>
              <h2 className="mt-1 text-h2">Research Resources</h2>
              <p className="mt-1 text-small max-w-2xl">
                A comprehensive suite of tools and databases to support every stage of your academic research journey, from literature review to publication.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Researcher Corner */}
            <FadeIn direction="right">
              <div className="rounded-2xl border border-border/70 bg-surface p-6 lg:p-8 h-full">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <GraduationCap className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-h3">Researcher Corner</h3>
                    <p className="text-caption">Essential tools for researchers</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {researcherCornerResources.map((resource) => (
                    <div
                      key={resource.name}
                      className="group flex items-start gap-3 rounded-xl p-3 -mx-1 transition-colors hover:bg-surface-muted cursor-pointer"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/8 group-hover:text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{resource.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/research"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                  View All Research Resources <ArrowRight className="size-4" />
                </Link>
              </div>
            </FadeIn>

            {/* HEC Corner */}
            <FadeIn direction="left">
              <div className="rounded-2xl border border-border/70 bg-surface p-6 lg:p-8 h-full">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Library className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-h3">HEC Corner</h3>
                    <p className="text-caption">Higher Education Commission resources</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {hecCornerResources.slice(0, 5).map((resource) => (
                    <div
                      key={resource.name}
                      className="group flex items-start gap-3 rounded-xl p-3 -mx-1 transition-colors hover:bg-surface-muted cursor-pointer"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-secondary/10 group-hover:text-secondary">
                        <ExternalLink className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        {resource.externalUrl ? (
                          <a
                            href={resource.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {resource.name}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{resource.name}</p>
                        )}
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/research"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                  All HEC Resources <ArrowRight className="size-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. UPCOMING EVENTS + ANNOUNCEMENTS
          Side-by-side: Events (3 cols) + Announcements (2 cols).
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Upcoming Events — 3 cols */}
            <div className="lg:col-span-3">
              <FadeIn>
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-caption text-primary uppercase tracking-wider">What&apos;s Happening</p>
                    <h2 className="mt-1 text-h2">Upcoming Events</h2>
                    <p className="mt-1 text-small">Workshops, training sessions, and library activities</p>
                  </div>
                  <Link
                    href="/events"
                    className="hidden items-center gap-1.5 text-sm font-medium text-primary sm:flex"
                  >
                    All Events <ArrowRight className="size-4" />
                  </Link>
                </div>
              </FadeIn>

              <div className="space-y-4">
                {demoEvents.map((event, i) => (
                  <FadeIn key={event.title} delay={i * 0.08}>
                    <DSCard padding="lg" variant="outlined" className="transition-colors hover:bg-surface-muted/50 cursor-pointer">
                      <div className="flex items-start gap-4">
                        {/* Date block */}
                        <div className="flex flex-col items-center rounded-xl bg-surface-muted px-3.5 py-2.5 text-center shrink-0">
                          <span className="text-2xl font-bold text-primary leading-none">
                            {event.date.split(' ')[1].replace(',', '')}
                          </span>
                          <span className="text-caption mt-0.5">
                            {event.date.split(' ')[0]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-body font-semibold text-foreground">{event.title}</h3>
                            <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', eventTypeConfig[event.type])}>
                              {event.type}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" /> {event.time}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3" /> {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DSCard>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Announcements — 2 cols */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="mb-8">
                  <p className="text-caption text-gold uppercase tracking-wider">Stay Updated</p>
                  <h2 className="mt-1 text-h2">Announcements</h2>
                  <p className="mt-1 text-small">Latest news and updates from the library</p>
                </div>
              </FadeIn>

              <div className="space-y-4">
                {demoAnnouncements.map((item, i) => (
                  <FadeIn key={item.title} delay={i * 0.08} direction="left">
                    <div className="rounded-xl border border-border/60 p-5 transition-colors hover:bg-surface-muted/50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          item.priority === 'high'
                            ? 'bg-gold/10 text-gold'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          <Megaphone className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                            {item.priority === 'high' && (
                              <Badge variant="warning" size="sm">Important</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                          <p className="mt-2 text-caption">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. LIBRARY SERVICES
          Official services from the COMSATS Library website +
          additional core services.
          ═══════════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8">
              <p className="text-caption text-primary uppercase tracking-wider">What We Offer</p>
              <h2 className="mt-1 text-h2">Library Services</h2>
              <p className="mt-1 text-small max-w-2xl">
                Official services of the {libraryInfo.name} — from catalog search to digital resource access and research support.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {officialServices.slice(0, 7).map((service) => {
              const Icon = iconMap[service.icon] || BookOpen;
              const content = (
                <CardHover>
                  <DSCard hoverable padding="lg" className="h-full">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-body font-semibold text-foreground">{service.name}</h3>
                    <p className="mt-1.5 text-small line-clamp-3">{service.description}</p>
                    {service.externalUrl && (
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <span>Visit</span>
                        <ExternalLink className="size-3" />
                      </div>
                    )}
                  </DSCard>
                </CardHover>
              );

              return (
                <StaggerItem key={service.name}>
                  {service.externalUrl ? (
                    <a
                      href={service.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="h-full">{content}</div>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Additional core services row */}
          <FadeIn delay={0.2}>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {additionalServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.name}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface-muted/30 p-4 transition-colors hover:bg-surface-muted/60"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{service.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10. PHOTO STRIP — Official library photographs
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-8">
              <p className="text-caption text-muted-foreground uppercase tracking-wider">Our Spaces</p>
              <h2 className="mt-1 text-h2">Inside the Library</h2>
              <p className="mt-1 text-small">A glimpse into the {libraryInfo.name} facilities</p>
            </div>
          </FadeIn>

          {/* Photo grid — 2 rows on desktop, single row on mobile */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {/* First row: 4 interior images */}
            {getImagesByCategory('interior').slice(0, 4).map((img, i) => (
              <FadeIn key={img.key} delay={i * 0.06}>
                <div className="relative overflow-hidden rounded-2xl aspect-video group cursor-pointer">
                  <Image
                    src={img.srcWebp}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/20" />
                </div>
              </FadeIn>
            ))}
            {/* Second row: 2 facility + 2 more interior images */}
            {getImagesByCategory('facilities').slice(0, 2).map((img, i) => (
              <FadeIn key={img.key} delay={(i + 4) * 0.06}>
                <div className="relative overflow-hidden rounded-2xl aspect-video group cursor-pointer">
                  <Image
                    src={img.srcWebp}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/20" />
                </div>
              </FadeIn>
            ))}
            {getImagesByCategory('interior').slice(4, 6).map((img, i) => (
              <FadeIn key={img.key} delay={(i + 6) * 0.06}>
                <div className="relative overflow-hidden rounded-2xl aspect-video group cursor-pointer">
                  <Image
                    src={img.srcWebp}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/20" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          11. CTA — Visit Official Website
          Navy gradient block with links to official site and OPAC.
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-navy py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-caption text-navy-foreground/50 uppercase tracking-widest">Official Portal</p>
              <h2 className="mt-3 text-h2 text-navy-foreground">Visit the Official Library Website</h2>
              <p className="mt-3 text-body text-navy-foreground/60">
                Access the live OPAC catalog, real-time availability, and all current services
                on the official COMSATS University Islamabad Library website.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://library.comsats.edu.pk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-primary shadow-lg transition-colors hover:bg-white/90"
                >
                  Official Website
                  <ExternalLink className="size-4" />
                </a>
                <a
                  href="https://lib.comsats.edu.pk:82"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-medium text-navy-foreground transition-colors hover:bg-white/10"
                >
                  OPAC Catalog
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageEntrance>
  );
}
