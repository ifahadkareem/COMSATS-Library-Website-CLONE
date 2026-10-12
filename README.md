# COMSATS University Islamabad — Junaid Zaidi Library

Modern library web application built with Next.js 16, Prisma, and the Liquid Knowledge Design System.

## Getting Started (VS Code on Windows)

### Requirements

- Node.js 20.9 or later (Node.js 22 LTS is suitable)
- npm (included with Node.js)
- Visual Studio Code

### First-time setup

1. Open the `my-project` folder in VS Code.
2. In the project root, copy `.env.example` to `.env` if `.env` does not already exist.
3. Install the dependencies with npm.
4. Generate the Prisma client and create the local SQLite database using the database setup commands for this project.
5. Start the development server.

The application uses a local `dev.db` SQLite database in the project root. The database file is created locally and is not committed to source control.

### Demo data

The `scripts` folder contains seed scripts for authentication users, catalog books, and dashboard data. They can be run with `npx tsx` after the database schema has been pushed. Run `seed-auth.ts` before `seed-dashboard.ts`; seed catalog data before dashboard data so dashboard demo records can reference books.

## Demo Credentials

| Role      | Email                      | Password      |
|-----------|----------------------------|---------------|
| Student   | student@comsats.edu.pk    | student123    |
| Faculty   | faculty@comsats.edu.pk    | faculty123    |
| Librarian | librarian@comsats.edu.pk  | librarian123  |
| Admin     | admin@comsats.edu.pk      | admin123      |

## Authentication

### How It Works

- **Password hashing**: bcryptjs (12 salt rounds)
- **Sessions**: iron-session (encrypted HTTP-only cookies, 7-day expiry)
- **Route protection**: Next.js middleware + server-side `requireRole()` guards
- **Authorization**: Enforced server-side on every protected page and API route

### Protected Routes

| Route        | Allowed Roles            | Redirect if unauthorized |
|--------------|---------------------------|--------------------------|
| `/dashboard` | STUDENT, FACULTY         | `/login`                 |
| `/librarian` | LIBRARIAN                | `/login`                 |
| `/admin`     | ADMIN                    | `/login`                 |

If a user is authenticated but lacks the required role, they are redirected to their own dashboard instead.

### Defense in Depth

1. **Middleware** (Edge): Checks session cookie existence and decrypts role. Redirects unauthenticated users to `/login` and wrong-role users to their dashboard.
2. **Server Component guards**: Every protected page calls `requireRole()` which re-validates the session against the database and checks the user's current role and status (ACTIVE/SUSPENDED/INACTIVE).
3. **API routes**: Protected endpoints call `requireAuth()` or `requireRole()` server-side.

### Password Reset (Demo)

No real email is sent. The forgot-password flow returns the reset token directly in the API response for testing.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + Liquid Knowledge Design System
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL migration planned)
- **Auth**: bcryptjs + iron-session
- **Animations**: Framer Motion (with reduced-motion support)
