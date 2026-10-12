import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { StatCard } from '@/components/design-system';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen, Users, ArrowRightLeft, Calendar, Layers, FileText,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Librarian Dashboard' };

const librarianSections = [
  { title: 'Circulation Desk', description: 'Process check-ins, check-outs, and returns', icon: ArrowRightLeft, href: '#' },
  { title: 'Book Management', description: 'Add, edit, and manage the library book catalog', icon: BookOpen, href: '#' },
  { title: 'Space Management', description: 'Configure study spaces and manage bookings', icon: Layers, href: '#' },
  { title: 'Events & Workshops', description: 'Create and publish library events', icon: Calendar, href: '#' },
  { title: 'User Directory', description: 'View library members and their accounts', icon: Users, href: '#' },
  { title: 'Digital Resources', description: 'Manage e-books, journals, and database access', icon: FileText, href: '#' },
];

export default function LibrarianPage() {
  return (
    <ProtectedPage roles={['LIBRARIAN']}>
      {({ user }) => (
        <PageContainer>
          <PageHeader
            title="Librarian Dashboard"
            description="Manage library operations — circulation, catalog, and spaces"
            actions={
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 text-xs">
                  Librarian
                </Badge>
                <LogoutButton variant="outline" />
              </div>
            }
          />

          {/* Auth notice */}
          <div className="mb-6 rounded-xl border border-border/60 bg-surface-muted/30 px-4 py-3 flex items-start gap-3">
            <div className="size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold">🔒</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Server-side authorization active.</span>{' '}
              Protected by <code className="rounded bg-surface-muted px-1 py-0.5 text-[11px] font-mono">requireRole([LIBRARIAN])</code>.{' '}
              Role: <code className="rounded bg-surface-muted px-1 py-0.5 text-[11px] font-mono">{user.role}</code> verified from DB.
            </p>
          </div>

          {/* Quick stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<BookOpen className="size-5" />} value="—" label="Total Books" />
            <StatCard icon={<Users className="size-5" />} value="—" label="Active Members" />
            <StatCard icon={<ArrowRightLeft className="size-5" />} value="—" label="Active Borrows" />
            <StatCard icon={<Calendar className="size-5" />} value="—" label="Upcoming Events" />
          </div>

          {/* Management sections */}
          <h2 className="mb-4 text-lg font-semibold">Management</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {librarianSections.map((section) => (
              <Link key={section.title} href={section.href} className="group">
                <Card className="h-full border-border/60 transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <section.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageContainer>
      )}
    </ProtectedPage>
  );
}