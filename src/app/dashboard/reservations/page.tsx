import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ReservationsClient } from '@/components/dashboard/ReservationsClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Reservations' };

export default async function ReservationsPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [reservations, unreadNotifs] = await Promise.all([
          db.reservation.findMany({
            where: { userId: user.id },
            include: {
              book: { include: { authors: { include: { author: true } }, categories: { include: { category: true } } } },
            },
            orderBy: { createdAt: 'desc' },
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        const mapped = reservations.map((r) => ({
          id: r.id,
          bookId: r.book.id,
          bookTitle: r.book.title,
          authors: r.book.authors.map((ba) => ba.author.name).join(', '),
          coverImage: r.book.coverImage,
          category: r.book.categories[0]?.category.name ?? null,
          createdAt: r.createdAt.toISOString(),
          expiresAt: r.expiresAt.toISOString(),
          status: r.status,
        }));

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <ReservationsClient reservations={mapped} />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
