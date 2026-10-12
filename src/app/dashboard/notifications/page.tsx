import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { NotificationsClient } from '@/components/dashboard/NotificationsClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Notifications' };

export default async function NotificationsPage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [notifications, unreadNotifs] = await Promise.all([
          db.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 30,
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        const mapped = notifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          read: !!n.readAt,
          createdAt: n.createdAt.toISOString(),
        }));

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <NotificationsClient notifications={mapped} unreadCount={unreadNotifs} />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
