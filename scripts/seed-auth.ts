/**
 * Seed Demo Auth Users
 *
 * Creates one user per role for testing.
 * Run: npx tsx scripts/seed-auth.ts
 *
 * ⚠️  Only run this on a dev/prototype database.
 */

import { hashPassword, hasUsers, createUser, type UserRole } from '../src/lib/auth';
import { db } from '../src/lib/db';

const DEMO_USERS: Array<{ email: string; password: string; role: UserRole }> = [
  { email: 'student@comsats.edu.pk', password: 'student123', role: 'STUDENT' },
  { email: 'faculty@comsats.edu.pk', password: 'faculty123', role: 'FACULTY' },
  { email: 'librarian@comsats.edu.pk', password: 'librarian123', role: 'LIBRARIAN' },
  { email: 'admin@comsats.edu.pk', password: 'admin123', role: 'ADMIN' },
];

async function seed() {
  console.log('🌱 Seeding demo auth users...\n');

  const existing = await hasUsers();
  if (existing) {
    console.log('✅ Users already exist. Skipping seed to avoid duplicates.');
    console.log('   Delete all User records first if you want to re-seed.\n');
    return;
  }

  for (const demo of DEMO_USERS) {
    try {
      const user = await createUser({
        email: demo.email,
        password: demo.password,
        role: demo.role,
      });
      console.log(`  ✅ Created ${demo.role.padEnd(10)} → ${demo.email}`);
    } catch (err: any) {
      if (err.code === 'P2002') {
        console.log(`  ⏭️  Already exists: ${demo.email}`);
      } else {
        console.error(`  ❌ Failed ${demo.email}:`, err.message);
      }
    }
  }

  console.log('\n✅ Seed complete.\n');
  console.log('Demo Credentials:');
  console.log('─────────────────────────────────────────────');
  for (const demo of DEMO_USERS) {
    console.log(`  ${demo.role.padEnd(10)} ${demo.email.padEnd(28)} ${demo.password}`);
  }
  console.log('─────────────────────────────────────────────\n');

  await db.$disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
