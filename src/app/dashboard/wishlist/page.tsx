import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { WishlistClient } from '@/components/dashboard/WishlistClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Wishlist' };

export default async function WishlistPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [wishlist, unreadNotifs] = await Promise.all([
          db.wishlist.findMany({
            where: { userId: user.id },
            include: {
              book: {
                include: {
                  authors: { include: { author: true } },
                  categories: { include: { category: true } },
                  copies: { select: { status: true } },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        const mapped = wishlist.map((w) => {
          const total = w.book.copies.length;
          const available = w.book.copies.filter((c) => c.status === 'AVAILABLE').length;
          return {
            id: w.id,
            bookId: w.book.id,
            bookTitle: w.book.title,
            authors: w.book.authors.map((ba) => ba.author.name).join(', '),
            coverImage: w.book.coverImage,
            category: w.book.categories[0]?.category.name ?? null,
            publicationYear: w.book.publicationYear,
            addedAt: w.createdAt.toISOString(),
            availability: { total, available },
          };
        });

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <WishlistClient wishlist={mapped} />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
