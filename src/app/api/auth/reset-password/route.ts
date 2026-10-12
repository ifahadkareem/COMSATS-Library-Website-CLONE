import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth';
import { z } from 'zod/v4';

const resetSchema = z.object({
  email: z.email('Please enter a valid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, newPassword } = parsed.data;
    const success = await resetPassword(email, newPassword);

    if (!success) {
      return NextResponse.json(
        { error: 'Unable to reset password. Check the email address.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
