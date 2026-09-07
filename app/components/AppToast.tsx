'use client';

import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type AppToastProps = {
  title: string;
  message: string;
  onDismiss: () => void;
};

const AppToast = ({ title, message, onDismiss }: AppToastProps) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = () => {
    setIsLeaving(true);
    window.setTimeout(() => {
      onDismiss();
    }, 160);
  };

  useEffect(() => {
    let exitTimer: number | undefined;
    const timer = window.setTimeout(() => {
      setIsLeaving(true);
      exitTimer = window.setTimeout(() => {
        onDismiss();
      }, 160);
    }, 3500);

    return () => {
      window.clearTimeout(timer);
      if (exitTimer) {
        window.clearTimeout(exitTimer);
      }
    };
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex min-h-[68px] w-[min(360px,calc(100vw-32px))] max-w-[360px] items-center gap-3 rounded-[10px] border border-[#6ee7b7] bg-[#ecfdf5] px-4 py-3 text-[#172033] shadow-[0_8px_20px_rgba(15,118,76,0.10)] sm:w-[360px] ${isLeaving ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#059669] text-white shadow-[0_6px_14px_rgba(5,150,105,0.18)]">
        <CheckCircle2 size={17} strokeWidth={2.7} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-5 text-[#172033]">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] font-normal leading-[17px] text-[#64748b]">{message}</p>
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={handleDismiss}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border-0 bg-transparent text-[#64748b] transition-colors hover:bg-white/70 hover:text-[#172033] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#059669]/20"
      >
        <X size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
};

export default AppToast;
