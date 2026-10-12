import { Suspense } from 'react';
import LoginPageInner from './LoginPageInner';

export const metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
