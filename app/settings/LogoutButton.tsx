'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AppToast from '../components/AppToast';

const authStorageKeys = [
  'v-tasker-authenticated',
  'v-tasker-admin-session',
  'authToken',
  'accessToken',
  'refreshToken',
  'token',
];

const LogoutButton = () => {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    authStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionStorage.clear();

    setToastMessage('You have been successfully logged out.');

    window.setTimeout(() => {
      router.replace('/login');
    }, 650);
  };

  return (
    <>
      {toastMessage ? <AppToast title="Signed out" message={toastMessage} onDismiss={() => setToastMessage('')} /> : null}

      <button
        type="button"
        disabled={isLoggingOut}
        onClick={handleLogout}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[7px] border border-[#f1b8b8] bg-[#fff7f7] text-[13px] font-bold text-[#b91c1c] transition-colors hover:border-[#dc2626] hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOut size={15} strokeWidth={2.2} />
        Logout
      </button>
    </>
  );
};

export default LogoutButton;
