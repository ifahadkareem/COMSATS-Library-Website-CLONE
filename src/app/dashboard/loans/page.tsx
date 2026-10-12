import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { LoansClient } from '@/components/dashboard/LoansClient';
import { db } from '@/lib/db';

export const metadata = { title: 'My Loans' };

export default async function LoansPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [loans, unreadNotifs] = await Promise.all([
          db.borrowTransaction.findMany({
            where: { userId: user.id, status: { in: ['ACTIVE', 'OVERDUE'] } },
            include: {
              copy: {
                include: {
                  book: { include: { authors: { include: { author: true } }, categories: { include: { category: true } } } },
                  shelf: { include: { floor: true } },
                },
              },
            },
            orderBy: { dueAt: 'asc' },
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        const mapped = loans.map((l) => {
          const book = l.copy.book;
          const dueDate = new Date(l.dueAt);
          const now = new Date();
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return {
            id: l.id,
            copyId: l.copy.id,
            accessionNumber: l.copy.accessionNumber,
            bookTitle: book.title,
            bookId: book.id,
            authors: book.authors.map((ba) => ba.author.name).join(', '),
            category: book.categories[0]?.category.name ?? null,
            coverImage: book.coverImage,
            borrowedAt: l.borrowedAt.toISOString(),
            dueAt: l.dueAt.toISOString(),
            status: l.status,
            daysUntilDue,
            shelf: l.copy.shelf
              ? { code: l.copy.shelf.code, section: l.copy.shelf.section, floor: l.copy.shelf.floor.name }
              : null,
          };
        });

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <LoansClient loans={mapped} />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
