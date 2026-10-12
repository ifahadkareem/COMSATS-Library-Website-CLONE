import { NextRequest, NextResponse } from 'next/server';
import { generateResetToken } from '@/lib/auth';
import { z } from 'zod/v4';

const forgotSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const token = await generateResetToken(email);

    // In production, this token would be emailed. For this demo, we return it
    // so the user can copy it and use it on the reset-password page.
    if (token) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a reset token has been generated.',
        // Demo only: return the token directly
        demoToken: token,
      });
    }

    // Always return success to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset token has been generated.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
