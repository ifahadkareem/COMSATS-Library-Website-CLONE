'use client';

import React, { useState } from 'react';
import {
  BookOpen, Users, Newspaper, Clock, Building2, GraduationCap,
  Search, FileText, Settings, LogOut, Download, Share2, Star,
  Plus, Filter, MoreVertical, ExternalLink,
} from 'lucide-react';

import {
  DSCard, DSCardHeader, DSCardContent, DSCardFooter,
  BookCard,
  StatCard,
  SearchBar,
  Badge,
  Avatar,
  Modal,
  Dropdown,
  Tabs,
  DSTable,
  Pagination,
  Breadcrumb,
  EmptyState,
  LoadingSkeleton,
  PageEntrance,
  StaggerContainer,
  StaggerItem,
  CardHover,
  FadeIn,
} from '@/components/design-system';
import { Button } from '@/components/ui/button';

/* ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
 * Design System Showcase
 *
 * Interactive preview of all Liquid Knowledge components.
 * ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ */

const sampleSuggestions = [
  { id: '1', label: 'Introduction to Algorithms', description: 'Thomas H. Cormen, 2009', icon: <BookOpen className="size-4" /> },
  { id: '2', label: 'Data Structures & Algorithms', description: 'Computer Science · CS-201', icon: <FileText className="size-4" /> },
  { id: '3', label: 'Digital Signal Processing', description: 'Electrical Engineering · EE-301', icon: <FileText className="size-4" /> },
];

const sampleTableData = [
  { id: '1', title: 'Introduction to Algorithms', author: 'Cormen, T.H.', year: 2009, status: 'available' as const, callNumber: 'QA76.6 .C66' },
  { id: '2', title: 'Machine Learning: A Probabilistic Perspective', author: 'Murphy, K.P.', year: 2012, status: 'checked-out' as const, callNumber: 'Q325.5 .M87' },
  { id: '3', title: 'The Art of Computer Programming', author: 'Knuth, D.E.', year: 1997, status: 'available' as const, callNumber: 'QA76.6 .K63' },
  { id: '4', title: 'Design Patterns', author: 'Gamma, E.', year: 1994, status: 'reserved' as const, callNumber: 'QA76.64 .D47' },
  { id: '5', title: 'Clean Code', author: 'Martin, R.C.', year: 2008, status: 'available' as const, callNumber: 'QA76.73 .M37' },
];

const columns = [
  { id: 'title', header: 'Title', accessor: (row: typeof sampleTableData[0]) => <span className="font-medium">{row.title}</span> },
  { id: 'author', header: 'Author', accessor: (row: typeof sampleTableData[0]) => row.author },
  { id: 'year', header: 'Year', accessor: (row: typeof sampleTableData[0]) => row.year, align: 'center' as const },
  { id: 'status', header: 'Status', accessor: (row: typeof sampleTableData[0]) => (
    <Badge variant={row.status === 'available' ? 'success' : row.status === 'checked-out' ? 'warning' : 'info'} size="sm">
      {row.status.replace('-', ' ')}
    </Badge>
  )},
  { id: 'callNumber', header: 'Call No.', accessor: (row: typeof sampleTableData[0]) => <span className="font-mono text-xs text-muted-foreground">{row.callNumber}</span> },
];

const dropdownItems = [
  { id: '1', label: 'Export as CSV', icon: <Download className="size-4" /> },
  { id: '2', label: 'Share', icon: <Share2 className="size-4" /> },
  { id: '3', label: 'Add to Favorites', icon: <Star className="size-4" /> },
  { id: '4', label: 'Delete', icon: <MoreVertical className="size-4" />, destructive: true },
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  return (
    <PageEntrance>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="section-padding bg-gradient-subtle">
          <div className="max-w-6xl mx-auto px-6">
            <Breadcrumb
              items={[{ label: 'Design System' }]}
              className="mb-8"
            />
            <h1 className="text-display text-primary">Liquid Knowledge</h1>
            <p className="mt-4 text-body text-muted-foreground max-w-2xl">
              The complete design system for COMSATS University Islamabad Library.
              Premium, modern, academic — built for clarity and delight.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

          {/* ​ Typography ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Typography</h2>
              <div className="space-y-6 bg-surface rounded-2xl border border-border/70 p-8">
                <div><p className="text-display">Display Heading</p><p className="text-caption mt-1">text-display · 700 · clamp(2.5rem, 5vw+1rem, 4.5rem)</p></div>
                <div><p className="text-h1">H1 — Page Title</p><p className="text-caption mt-1">text-h1 · 600 · clamp(1.875rem, 3vw+0.5rem, 2.75rem)</p></div>
                <div><p className="text-h2">H2 — Section Heading</p><p className="text-caption mt-1">text-h2 · 600 · clamp(1.375rem, 2vw+0.25rem, 1.875rem)</p></div>
                <div><p className="text-h3">H3 — Subsection</p><p className="text-caption mt-1">text-h3 · 600 · 1.25rem</p></div>
                <div><p className="text-body">Body text — The quick brown fox jumps over the lazy dog. Used for paragraphs, descriptions, and content throughout the interface.</p><p className="text-caption mt-1">text-body · 400 · 1rem · line-height 1.65</p></div>
                <div><p className="text-small">Small text — Secondary information, labels, and supporting content that needs to be readable but not prominent.</p><p className="text-caption mt-1">text-small · 400 · 0.875rem · line-height 1.5</p></div>
                <div><p className="text-caption">Caption Text — Metadata, timestamps, and micro-labels.</p><p className="text-caption mt-1">text-caption · 500 · 0.75rem · letter-spacing 0.02em</p></div>
              </div>
            </section>
          </FadeIn>

          {/* ​ Colors ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Color System</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                  { name: 'Primary', class: 'bg-primary', text: 'text-primary-foreground' },
                  { name: 'Primary Dark', class: 'bg-primary-dark', text: 'text-primary-foreground' },
                  { name: 'Primary Light', class: 'bg-primary-light', text: 'text-primary-foreground' },
                  { name: 'Navy', class: 'bg-navy', text: 'text-navy-foreground' },
                  { name: 'Secondary', class: 'bg-secondary', text: 'text-secondary-foreground' },
                  { name: 'Gold', class: 'bg-gold', text: 'text-gold-foreground' },
                  { name: 'Success', class: 'bg-success', text: 'text-white' },
                  { name: 'Warning', class: 'bg-warning', text: 'text-white' },
                  { name: 'Error', class: 'bg-error', text: 'text-white' },
                  { name: 'Surface', class: 'bg-surface border border-border', text: 'text-foreground' },
                ].map((color) => (
                  <div key={color.name} className="space-y-2">
                    <div className={`${color.class} ${color.text} rounded-xl h-20 flex items-end p-3`}>
                      <span className="text-xs font-medium">{color.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* ​ Search Bar ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Search Bar</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <p className="text-small mb-3">Default</p>
                  <SearchBar
                    value={searchValue}
                    onValueChange={setSearchValue}
                    suggestions={sampleSuggestions}
                    placeholder="Search books, journals, resources..."
                  />
                </div>
                <div>
                  <p className="text-small mb-3">Elevated Variant</p>
                  <SearchBar variant="elevated" placeholder="Quick search..." />
                </div>
                <div>
                  <p className="text-small mb-3">Navy Variant</p>
                  <SearchBar variant="navy" placeholder="Search the library catalog..." />
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ​ Cards ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Cards</h2>

              <h3 className="text-h3 mb-4">Design System Cards</h3>
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StaggerItem>
                  <CardHover>
                    <DSCard hoverable padding="lg">
                      <DSCardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 rounded-xl bg-primary/8 text-primary">
                            <BookOpen className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold">Book Collection</h4>
                            <p className="text-caption">Academic & reference</p>
                          </div>
                        </div>
                      </DSCardHeader>
                      <DSCardContent>
                        <p className="text-small">
                          Access our comprehensive collection of textbooks, reference materials, and research publications across all disciplines.
                        </p>
                      </DSCardContent>
                      <DSCardFooter>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          Browse <ExternalLink className="size-3.5 ml-1" />
                        </Button>
                      </DSCardFooter>
                    </DSCard>
                  </CardHover>
                </StaggerItem>

                <StaggerItem>
                  <CardHover>
                    <DSCard variant="glass" hoverable padding="lg">
                      <DSCardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 rounded-xl bg-secondary/10 text-secondary">
                            <Newspaper className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold">Digital Journals</h4>
                            <p className="text-caption">HEC & international</p>
                          </div>
                        </div>
                      </DSCardHeader>
                      <DSCardContent>
                        <p className="text-small">
                          Full-text access to thousands of peer-reviewed journals through HEC Digital Library and direct subscriptions.
                        </p>
                      </DSCardContent>
                    </DSCard>
                  </CardHover>
                </StaggerItem>

                <StaggerItem>
                  <CardHover>
                    <DSCard variant="outlined" hoverable padding="lg">
                      <DSCardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 rounded-xl bg-gold/15 text-gold">
                            <GraduationCap className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold">Research Support</h4>
                            <p className="text-caption">Theses & publications</p>
                          </div>
                        </div>
                      </DSCardHeader>
                      <DSCardContent>
                        <p className="text-small">
                          Browse COMSATS theses, research papers, and access tools for literature review and citation management.
                        </p>
                      </DSCardContent>
                    </DSCard>
                  </CardHover>
                </StaggerItem>
              </StaggerContainer>

              {/* Navy card */}
              <div className="mt-6 max-w-lg">
                <DSCard variant="navy" padding="lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-white/10">
                      <Building2 className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-body font-semibold text-navy-foreground">OPAC</h4>
                      <p className="text-small text-navy-foreground/60">
                        Online Public Access Catalog — search the full library holdings
                      </p>
                    </div>
                  </div>
                </DSCard>
              </div>
            </section>
          </FadeIn>

          {/* ​ Stat Cards ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Stat Cards</h2>
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StaggerItem>
                  <StatCard
                    icon={<BookOpen className="size-5" />}
                    value="52,000+"
                    label="Books"
                    trend={{ value: 12, isPositive: true }}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    icon={<Newspaper className="size-5" />}
                    value="8,400+"
                    label="Journals"
                    trend={{ value: 5, isPositive: true }}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    icon={<Users className="size-5" />}
                    value="3,200+"
                    label="Members"
                    variant="accent"
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    icon={<Clock className="size-5" />}
                    value="24/7"
                    label="Digital Access"
                    variant="navy"
                  />
                </StaggerItem>
              </StaggerContainer>
            </section>
          </FadeIn>

          {/* ​ Book Cards ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Book Cards</h2>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <BookCard
                  title="Introduction to Algorithms"
                  author="Thomas H. Cormen"
                  callNumber="QA76.6 .C66"
                  year={2009}
                  status="available"
                  category="Computer Science"
                  size="detailed"
                />
                <BookCard
                  title="Machine Learning"
                  author="Christopher M. Bishop"
                  callNumber="Q325.5 .B57"
                  year={2006}
                  status="checked-out"
                  size="detailed"
                />
                <BookCard
                  title="Design Patterns"
                  author="Erich Gamma et al."
                  callNumber="QA76.64 .D47"
                  year={1994}
                  status="available"
                  size="detailed"
                />
                <BookCard
                  title="Clean Code"
                  author="Robert C. Martin"
                  status="available"
                />
                <BookCard
                  title="Artificial Intelligence"
                  author="Stuart Russell"
                  status="reserved"
                />
              </div>
            </section>
          </FadeIn>

          {/* ​ Badges ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Badges</h2>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Available</Badge>
                <Badge variant="warning">Checked Out</Badge>
                <Badge variant="error">Overdue</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="success" soft>Soft Success</Badge>
                <Badge variant="warning" soft>Soft Warning</Badge>
                <Badge variant="error" soft>Soft Error</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
              </div>
            </section>
          </FadeIn>

          {/* ​ Avatars ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Avatars</h2>
              <div className="flex items-end gap-4">
                <Avatar initials="JZ" size="xs" />
                <Avatar initials="AK" size="sm" status="online" />
                <Avatar initials="SM" size="md" status="away" />
                <Avatar initials="RH" size="lg" status="busy" />
                <Avatar initials="LF" size="xl" status="offline" />
              </div>
            </section>
          </FadeIn>

          {/* ​ Tabs ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Tabs</h2>
              <div className="space-y-8">
                <div>
                  <p className="text-small mb-3">Pill Variant</p>
                  <Tabs
                    variant="pill"
                    tabs={[
                      { id: 'books', label: 'Books', content: <p className="text-body">Browse the physical book collection across all floors.</p> },
                      { id: 'journals', label: 'Journals', content: <p className="text-body">Access digital and print journal subscriptions.</p> },
                      { id: 'theses', label: 'Theses', content: <p className="text-body">Search COMSATS student theses and dissertations.</p> },
                    ]}
                  />
                </div>
                <div>
                  <p className="text-small mb-3">Underline Variant</p>
                  <Tabs
                    variant="underline"
                    tabs={[
                      { id: 'all', label: 'All Resources', content: <p className="text-body">Complete catalog of all library holdings and digital resources.</p> },
                      { id: 'digital', label: 'Digital', content: <p className="text-body">E-books, e-journals, databases, and online references.</p> },
                      { id: 'physical', label: 'Physical', content: <p className="text-body">Print books, journals, newspapers, and special collections.</p> },
                      { id: 'special', label: 'Special', content: <p className="text-body">Rare books, archives, and special collections.</p> },
                    ]}
                  />
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ​ Table ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Table</h2>
              <DSTable
                columns={columns}
                data={sampleTableData}
                keyExtractor={(row) => row.id}
                onRowClick={(row) => console.log(row)}
              />
            </section>
          </FadeIn>

          {/* ​ Pagination ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Pagination</h2>
              <Pagination
                currentPage={currentPage}
                totalPages={24}
                onPageChange={setCurrentPage}
                showInfo
              />
            </section>
          </FadeIn>

          {/* ​ Modal ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Modal</h2>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Book Reservation"
                description="Reserve this item for pickup at the circulation desk."
                size="md"
                footer={
                  <>
                    <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => setModalOpen(false)}>Confirm Reservation</Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-muted">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-primary/8 text-primary">
                      <BookOpen className="size-6" />
                    </div>
                    <div>
                      <p className="font-medium">Introduction to Algorithms</p>
                      <p className="text-sm text-muted-foreground">Thomas H. Cormen · QA76.6 .C66</p>
                    </div>
                  </div>
                  <p className="text-small">
                    This book will be held at the circulation desk for 48 hours. You will receive a notification when it is ready for pickup.
                  </p>
                </div>
              </Modal>
            </section>
          </FadeIn>

          {/* ​ Dropdown ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Dropdown</h2>
              <Dropdown
                items={dropdownItems}
                trigger={
                  <Button variant="outline" className="rounded-lg">
                    <Settings className="size-4 mr-2" /> Actions
                  </Button>
                }
              />
            </section>
          </FadeIn>

          {/* ​ Empty State & Loading ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">States</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl border border-border/70 bg-surface p-6">
                  <p className="text-small mb-4 font-medium">Empty State</p>
                  <EmptyState
                    icon={<BookOpen className="size-10" />}
                    title="No books found"
                    message="Try adjusting your search or filter criteria."
                    action={<Button variant="outline" size="sm" className="rounded-lg"><Plus className="size-3.5 mr-1.5" />Add Book</Button>}
                    variant="compact"
                  />
                </div>
                <div className="rounded-2xl border border-border/70 bg-surface p-6">
                  <p className="text-small mb-4 font-medium">Loading Skeletons</p>
                  <LoadingSkeleton variant="card" count={2} />
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ​ Breadcrumb ​ */}
          <FadeIn>
            <section>
              <h2 className="text-h2 mb-8">Breadcrumb</h2>
              <div className="space-y-4">
                <Breadcrumb items={[{ label: 'Catalog' }, { label: 'Computer Science' }, { label: 'Algorithms' }]} />
                <Breadcrumb items={[{ label: 'Resources' }, { label: 'HEC Digital Library' }]} showHome={false} />
              </div>
            </section>
          </FadeIn>

        </div>
      </div>
    </PageEntrance>
  );
}
