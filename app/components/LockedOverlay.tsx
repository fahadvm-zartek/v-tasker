import React from 'react';
import { LockKeyhole } from 'lucide-react';

const LockedOverlay = () => {
  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="locked-page-title"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/[0.10] backdrop-blur-[2px]" />

      <div className="animate-dashboard-entry relative z-10 w-full max-w-[460px] rounded-[18px] border border-[#dbe3ef] bg-white px-10 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E68A2E]/15 ring-1 ring-[#E68A2E]/20">
          <LockKeyhole
            size={30}
            strokeWidth={2.2}
            className="text-[#1B3061]"
          />
        </div>

        <h2
          id="locked-page-title"
          className="mt-6 text-[28px] font-bold leading-9 text-[#1B3061]"
        >
          Page Locked
        </h2>

        <p className="mt-2 text-[15px] font-medium leading-6 text-[#1B3061]/60">
          Coming soon...
        </p>

        <div className="mx-auto mt-6 h-1 w-10 rounded-full bg-[#E68A2E]" />
      </div>
    </div>
  );
};

export default LockedOverlay;
