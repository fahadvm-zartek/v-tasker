'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex h-[62px] w-full items-center justify-between border-b border-[#e2e7ef] bg-white px-8 max-sm:px-4">
      <div className="relative w-full max-w-[384px]">
        <Search
          size={16}
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7f8494]"
        />
        <input
          type="text"
          placeholder="Search dashboard..."
          className="h-[40px] w-full rounded-[7px] border border-[#cad5e4] bg-[#fbfcfe] pl-[41px] pr-3 text-[14px] font-normal text-[#111827] outline-hidden transition-all placeholder:text-[#6f7482] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1B3061] transition-colors hover:bg-[#f4f6ff]"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={2.2} />
          <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-[#e72961] ring-2 ring-white" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B3061] text-[11px] font-bold text-white">
          AU
        </div>
      </div>
    </div>
  );
};

export default Header;
