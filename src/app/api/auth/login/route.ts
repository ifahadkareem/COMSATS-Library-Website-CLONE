import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession, ROLES, ROLE_DASHBOARD } from '@/lib/auth';
import { z } from 'zod/v4';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await verifyCredentials(email, password);
    if (!user) {
      // Intentionally vague to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const session = await createSession(user);
    const dashboardPath = ROLE_DASHBOARD[user.role as keyof typeof ROLE_DASHBOARD] || '/dashboard';

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
      redirectTo: dashboardPath,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
