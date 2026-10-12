// ═══════════════════════════════════════════════════════════════
// COMSATS Library — Dashboard Seed Script
//
// Seeds dashboard-related data for the student demo user:
//   - StudentProfile + LibraryMembership
//   - 4 active borrow transactions (1 overdue, 1 due soon, 2 normal)
//   - 3 reservations (pending, fulfilled, pending)
//   - 5 wishlist items
//   - 2 pending fines
//   - 8 notifications (mixed types)
//   - 2 room bookings
//   - Announcements for notification context
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const db = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function seed() {
  console.log('🌱 Seeding dashboard data...\n');

  // ── 1. Ensure student user exists ──
  let student = await db.user.findUnique({ where: { email: 'student@comsats.edu.pk' } });
  if (!student) {
    const pw = await hashPassword('student123');
    student = await db.user.create({
      data: {
        email: 'student@comsats.edu.pk',
        passwordHash: pw,
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });
    console.log('  ✅ Created student user');
  } else {
    console.log('  ✅ Student user exists');
  }

  // ── 2. Ensure department & program exist ──
  const dept = await db.department.upsert({
    where: { code: 'CS' },
    update: {},
    create: { name: 'Computer Science', code: 'CS' },
  });
  console.log('  ✅ Department: Computer Science');

  const program = await db.program.upsert({
    where: { name_departmentId: { name: 'BS Computer Science', departmentId: dept.id } },
    update: {},
    create: { name: 'BS Computer Science', code: 'BSCS', departmentId: dept.id },
  });
  console.log('  ✅ Program: BS Computer Science');

  // ── 3. Student profile ──
  const existingProfile = await db.studentProfile.findUnique({ where: { userId: student.id } });
  if (!existingProfile) {
    await db.studentProfile.create({
      data: {
        userId: student.id,
        studentId: 'SP2024-CS-001',
        name: 'Ahmed Khan',
        departmentId: dept.id,
        programId: program.id,
        semester: 6,
        phone: '+92-300-1234567',
      },
    });
    console.log('  ✅ Created student profile: Ahmed Khan (SP2024-CS-001)');
  }

  // ── 4. Library membership ──
  const existingMembership = await db.libraryMembership.findUnique({ where: { userId: student.id } });
  if (!existingMembership) {
    await db.libraryMembership.create({
      data: {
        userId: student.id,
        membershipNumber: 'LIB-2024-0001',
        issueDate: daysAgo(365),
        expiryDate: daysFromNow(180),
        status: 'ACTIVE',
        borrowingLimit: 5,
      },
    });
    console.log('  ✅ Created library membership');
  }

  // ── 5. Find available book copies to borrow ──
  const availableCopies = await db.bookCopy.findMany({
    where: { status: 'AVAILABLE' },
    take: 10,
  });

  if (availableCopies.length < 4) {
    console.log('  ⚠️  Not enough available copies for seed. Run seed-catalog.ts first.');
    await db.$disconnect();
    return;
  }

  // ── 6. Borrow transactions ──
  const existingLoans = await db.borrowTransaction.count({ where: { userId: student.id } });
  if (existingLoans === 0) {
    const loanData = [
      { copyId: availableCopies[0].id, borrowedAt: daysAgo(25), dueAt: daysAgo(5), status: 'OVERDUE' },
      { copyId: availableCopies[1].id, borrowedAt: daysAgo(10), dueAt: daysFromNow(3), status: 'ACTIVE' },
      { copyId: availableCopies[2].id, borrowedAt: daysAgo(5), dueAt: daysFromNow(19), status: 'ACTIVE' },
      { copyId: availableCopies[3].id, borrowedAt: daysAgo(2), dueAt: daysFromNow(26), status: 'ACTIVE' },
    ];

    for (const loan of loanData) {
      await db.borrowTransaction.create({ data: { userId: student.id, ...loan } });
      await db.bookCopy.update({ where: { id: loan.copyId }, data: { status: 'BORROWED' } });
    }
    console.log('  ✅ Created 4 borrow transactions (1 overdue, 1 due soon, 2 normal)');

    // ── 7. Fines ──
    const overdueTx = await db.borrowTransaction.findFirst({
      where: { userId: student.id, status: 'OVERDUE' },
    });
    if (overdueTx) {
      await db.fine.create({
        data: {
          userId: student.id,
          transactionId: overdueTx.id,
          amount: 150.0,
          reason: 'Overdue fine: 5 days × Rs. 30/day',
          status: 'PENDING',
          createdAt: daysAgo(5),
        },
      });
    }
    const activeTx = await db.borrowTransaction.findFirst({
      where: { userId: student.id, status: 'ACTIVE' },
    });
    if (activeTx) {
      await db.fine.create({
        data: {
          userId: student.id,
          transactionId: activeTx.id,
          amount: 50.0,
          reason: 'Late return processing fee',
          status: 'PENDING',
          createdAt: daysAgo(2),
        },
      });
    }
    console.log('  ✅ Created 2 pending fines');
  }

  // ── 8. Reservations ──
  const existingReservations = await db.reservation.count({ where: { userId: student.id } });
  if (existingReservations === 0) {
    const borrowedBookIds = availableCopies.slice(0, 4).map(c => c.bookId);
    const booksForReservation = await db.book.findMany({
      where: { id: { notIn: borrowedBookIds } },
      take: 3,
    });

    const reservationData = [
      { bookId: booksForReservation[0]?.id, createdAt: daysAgo(7), expiresAt: daysFromNow(7), status: 'PENDING' },
      { bookId: booksForReservation[1]?.id, createdAt: daysAgo(14), expiresAt: daysFromNow(0), status: 'FULFILLED' },
      { bookId: booksForReservation[2]?.id, createdAt: daysAgo(3), expiresAt: daysFromNow(11), status: 'PENDING' },
    ];

    for (const res of reservationData) {
      if (res.bookId) {
        await db.reservation.create({ data: { userId: student.id, ...res } });
      }
    }
    console.log('  ✅ Created 3 reservations (2 pending, 1 fulfilled)');
  }

  // ── 9. Wishlist ──
  const existingWishlist = await db.wishlist.count({ where: { userId: student.id } });
  if (existingWishlist === 0) {
    const borrowedBookIds = availableCopies.slice(0, 4).map(c => c.bookId);
    const wishlistBooks = await db.book.findMany({
      where: { id: { notIn: borrowedBookIds } },
      take: 5,
    });

    for (const book of wishlistBooks) {
      await db.wishlist.create({
        data: { userId: student.id, bookId: book.id, createdAt: daysAgo(Math.floor(Math.random() * 30) + 1) },
      });
    }
    console.log('  ✅ Created 5 wishlist items');
  }

  // ── 10. Notifications ──
  const existingNotifs = await db.notification.count({ where: { userId: student.id } });
  if (existingNotifs === 0) {
    const notifications = [
      { title: 'Book Due Soon', message: 'Your borrowed book is due in 3 days. Please return or renew it.', type: 'OVERDUE', createdAt: daysAgo(1), readAt: null as Date | null },
      { title: 'Overdue Notice', message: 'Your book is 5 days overdue. A fine of Rs. 150.00 has been applied.', type: 'OVERDUE', createdAt: daysAgo(5), readAt: daysAgo(4) as Date | null },
      { title: 'Reservation Ready', message: 'Your reserved book is now available for pickup at the circulation desk.', type: 'RESERVATION', createdAt: daysAgo(2), readAt: null as Date | null },
      { title: 'New Arrival: AI & Machine Learning', message: 'A new book matching your interests has been added to the catalog.', type: 'ANNOUNCEMENT', createdAt: daysAgo(3), readAt: null as Date | null },
      { title: 'Fine Applied', message: 'A fine of Rs. 50.00 has been applied for late return processing.', type: 'FINE', createdAt: daysAgo(2), readAt: daysAgo(1) as Date | null },
      { title: 'Library Hours Update', message: 'The library will remain open until 10 PM during final exam week.', type: 'ANNOUNCEMENT', createdAt: daysAgo(7), readAt: daysAgo(6) as Date | null },
      { title: 'Room Booking Confirmed', message: 'Your study room booking for Group Study Room A has been confirmed.', type: 'SYSTEM', createdAt: daysAgo(1), readAt: null as Date | null },
      { title: 'Semester Book Return Reminder', message: 'All borrowed books must be returned before the semester ends on Aug 30.', type: 'ANNOUNCEMENT', createdAt: daysAgo(10), readAt: daysAgo(9) as Date | null },
    ];

    for (const n of notifications) {
      await db.notification.create({ data: { userId: student.id, ...n } });
    }
    console.log('  ✅ Created 8 notifications (5 unread, 3 read)');
  }

  // ── 11. Room bookings ──
  const existingBookings = await db.roomBooking.count({ where: { userId: student.id } });
  if (existingBookings === 0) {
    // Ensure a study room exists
    const floor = await db.floor.findFirst();
    let room = await db.studyRoom.findFirst();
    if (!room && floor) {
      room = await db.studyRoom.create({
        data: {
          name: 'Group Study Room A',
          type: 'STUDY_ROOM',
          floorId: floor.id,
          capacity: 8,
          description: 'Equipped with whiteboard and projector.',
          status: 'ACTIVE',
        },
      });
    }

    if (room) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      await db.roomBooking.create({
        data: {
          roomId: room.id,
          userId: student.id,
          bookingDate: today,
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Group project meeting for Software Engineering course',
          status: 'CONFIRMED',
        },
      });
      await db.roomBooking.create({
        data: {
          roomId: room.id,
          userId: student.id,
          bookingDate: tomorrow,
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Study session for Data Structures midterm',
          status: 'CONFIRMED',
        },
      });
      console.log('  ✅ Created 2 room bookings');
    }
  }

  // ── 12. Announcements (global) ──
  const existingAnnouncements = await db.announcement.count();
  if (existingAnnouncements === 0) {
    await db.announcement.create({
      data: {
        title: 'Extended Library Hours During Exams',
        summary: 'Library will remain open until 10 PM during final exam period.',
        content: 'To support students during the final exam period, the library will extend its operating hours from August 20 to September 5. The new hours will be 8:00 AM to 10:00 PM, Monday through Saturday.',
        category: 'General',
        publishedAt: daysAgo(7),
        status: 'PUBLISHED',
      },
    });
    await db.announcement.create({
      data: {
        title: 'New HEC Digital Library Resources',
        summary: 'Access to 15 new databases has been activated for COMSATS students.',
        content: 'The HEC National Digital Library has activated 15 new research databases for all COMSATS campuses. Access them through the Digital Resources portal using your university credentials.',
        category: 'Resources',
        publishedAt: daysAgo(3),
        status: 'PUBLISHED',
      },
    });
    console.log('  ✅ Created 2 library announcements');
  }

  console.log('\n✅ Dashboard seed complete.\n');
  await db.$disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
