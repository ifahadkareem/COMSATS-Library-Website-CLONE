import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProfileClient } from '@/components/dashboard/ProfileClient';
import { db } from '@/lib/db';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  return (
    <ProtectedPage roles={['STUDENT', 'FACULTY']}>
      {async ({ user }) => {
        const [profile, unreadNotifs] = await Promise.all([
          db.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
              studentProfile: {
                select: {
                  studentId: true,
                  name: true,
                  semester: true,
                  phone: true,
                  avatar: true,
                  department: { select: { name: true, code: true } },
                  program: { select: { name: true, code: true } },
                  membership: { select: {
                    membershipNumber: true,
                    issueDate: true,
                    expiryDate: true,
                    status: true,
                    borrowingLimit: true,
                  } },
                },
              },
              facultyProfile: {
                select: {
                  employeeId: true,
                  designation: true,
                  department: { select: { name: true, code: true } },
                },
              },
            },
          }),
          db.notification.count({ where: { userId: user.id, readAt: null } }),
        ]);

        const activeBorrowCount = await db.borrowTransaction.count({
          where: { userId: user.id, status: { in: ['ACTIVE', 'OVERDUE'] } },
        });

        if (!profile) {
          return (
            <DashboardShell unreadCount={unreadNotifs}>
              <p className="text-muted-foreground">Profile not found.</p>
            </DashboardShell>
          );
        }

        return (
          <DashboardShell unreadCount={unreadNotifs}>
            <ProfileClient
              profile={JSON.parse(JSON.stringify(profile))}
              activeBorrowCount={activeBorrowCount}
            />
          </DashboardShell>
        );
      }}
    </ProtectedPage>
  );
}
