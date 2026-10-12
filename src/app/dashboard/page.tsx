import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Dashboard' };

async function getDashboardStats(userId: string) {
  const [borrowedCount, dueSoonCount, overdueCount, reservationCount, wishlistCount, totalFines, unreadNotifs] =
    await Promise.all([
      db.borrowTransaction.count({ where: { userId, status: { in: ['ACTIVE', 'OVERDUE'] } } }),
      db.borrowTransaction.count({
        where: {
          userId,
          status: 'ACTIVE',
          dueAt: { lte: new Date(Date.now() + 7 * 86400000), gte: new Date() },
        },
      }),
      db.borrowTransaction.count({ where: { userId, status: 'OVERDUE' } }),
      db.reservation.count({ where: { userId, status: 'PENDING' } }),
      db.wishlist.count({ where: { userId } }),
      db.fine.aggregate({ where: { userId, status: 'PENDING' }, _sum: { amount: true } }),
      db.notification.count({ where: { userId, readAt: null } }),
    ]);

  return {
    borrowedCount,
    dueSoonCount,
    overdueCount,
    reservationCount,
    wishlistCount,
    totalFines: totalFines._sum.amount ?? 0,
    unreadNotifs,
  };
}

async function getRecentLoans(userId: string) {
  const loans = await db.borrowTransaction.findMany({
    where: { userId, status: { in: ['ACTIVE', 'OVERDUE'] } },
    include: {
      copy: {
        include: {
          book: { include: { authors: { include: { author: true } } } },
        },
      },
    },
    orderBy: { dueAt: 'asc' },
    take: 3,
  });

  return loans.map((l) => {
    const book = l.copy.book;
    const dueDate = new Date(l.dueAt);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: l.id,
      bookTitle: book.title,
      bookId: book.id,
      authors: book.authors.map((ba) => ba.author.name).join(', '),
      coverImage: book.coverImage,
      borrowedAt: l.borrowedAt.toISOString(),
      dueAt: l.dueAt.toISOString(),
      status: l.status,
      daysUntilDue,
    };
  });
}

async function getStudentName(userId: string): Promise<string> {
  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { name: true },
  });
  return profile?.name ?? '';
}

export default async function DashboardPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [stats, recentLoans, name] = await Promise.all([
          getDashboardStats(user.id),
          getRecentLoans(user.id),
          getStudentName(user.id),
        ]);

        return (
          <DashboardShell unreadCount={stats.unreadNotifs} userName={name}>
            <DashboardClient
              stats={stats}
              recentLoans={recentLoans}
              userName={name}
              userEmail={user.email}
              userRole={user.role}
            />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
