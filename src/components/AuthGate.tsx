'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import authService from '../services/authService';

const { hasStoredAuthSession } = authService;

const AuthGate = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (hasStoredAuthSession(window.sessionStorage)) {
        setIsAuthorized(true);
        return;
      }

      router.replace('/login');
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGate;
