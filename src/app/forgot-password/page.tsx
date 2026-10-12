'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/design-system';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Request failed');
          return;
        }

        setSent(true);
        if (data.demoToken) {
          setDemoToken(data.demoToken);
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>

        <div className="rounded-2xl border border-border/70 bg-surface shadow-elevated overflow-hidden">
          <div className="bg-gradient-navy px-8 py-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
              <Mail className="size-6 text-navy-foreground" />
            </div>
            <h1 className="text-h3 text-navy-foreground">Forgot Password</h1>
            <p className="mt-1 text-sm text-navy-foreground/60">
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="p-8">
            {sent ? (
              /* Success state */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="size-6 text-success" />
                </div>
                <h2 className="text-body font-semibold text-foreground">Check your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists for{' '}
                  <span className="font-medium text-foreground">{email}</span>,
                  you&apos;ll receive instructions to reset your password.
                </p>

                {/* Demo token display */}
                {demoToken && (
                  <div className="mt-6 rounded-xl border border-warning/20 bg-warning/5 p-4 text-left">
                    <p className="text-xs font-medium text-warning mb-2">
                      Demo Mode — No email is sent
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Use this token to proceed to reset:
                    </p>
                    <code className="block rounded-lg bg-surface-muted px-3 py-2 text-sm font-mono text-foreground break-all">
                      {demoToken}
                    </code>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-1.5"
                    >
                      <Link href="/reset-password">
                        Reset Password <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="mt-6"
                >
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@comsats.edu.pk"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl border-border/70 bg-surface-muted/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prototype / Demo
        </p>
      </FadeIn>
    </div>
  );
}
