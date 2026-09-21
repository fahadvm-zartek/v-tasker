'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import authService from '../services/authService';

const { hasStoredAuthSession } = authService;

const AuthRedirect = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (hasStoredAuthSession(window.sessionStorage)) {
        router.replace('/dashboard');
        return;
      }

      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRedirect;
