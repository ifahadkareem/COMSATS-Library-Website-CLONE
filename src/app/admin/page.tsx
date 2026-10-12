import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { StatCard } from '@/components/design-system';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, ArrowRightLeft, Calendar, FileText, Layers, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Admin Panel' };

const adminSections = [
  { title: 'Books Management', description: 'Add, edit, and manage the library book collection', icon: BookOpen, href: '#' },
  { title: 'User Management', description: 'Manage library members, librarians, and admin accounts', icon: Users, href: '#' },
  { title: 'Borrow Records', description: 'Track and manage book borrowings, returns, and fines', icon: ArrowRightLeft, href: '#' },
  { title: 'Space Management', description: 'Configure study spaces and manage bookings', icon: Layers, href: '#' },
  { title: 'Events Management', description: 'Create and publish library events and workshops', icon: Calendar, href: '#' },
  { title: 'Digital Resources', description: 'Manage e-books, journals, and database subscriptions', icon: FileText, href: '#' },
];

export default function AdminPage() {
  return (
    <ProtectedPage roles={['ADMIN']}>
      {({ user }) => (
        <PageContainer>
          <PageHeader
            title="Admin Panel"
            description="Manage the library system — books, users, spaces, and more"
            actions={
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 text-xs">
                  <Settings className="h-3 w-3" />
                  Administrator
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
              Protected by <code className="rounded bg-surface-muted px-1 py-0.5 text-[11px] font-mono">requireRole([ADMIN])</code>.{' '}
              Role: <code className="rounded bg-surface-muted px-1 py-0.5 text-[11px] font-mono">{user.role}</code> verified from DB.
            </p>
          </div>

          {/* Quick stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<BookOpen className="size-5" />} value="—" label="Total Books" />
            <StatCard icon={<Users className="size-5" />} value="—" label="Total Users" />
            <StatCard icon={<ArrowRightLeft className="size-5" />} value="—" label="Active Borrows" />
            <StatCard icon={<Calendar className="size-5" />} value="—" label="Events" />
          </div>

          {/* Management sections */}
          <h2 className="mb-4 text-lg font-semibold">Management Sections</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => (
              <Link key={section.title} href={section.href} className="group">
                <Card className="h-full border-border/60 transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
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