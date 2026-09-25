'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Bell, CircleHelp } from 'lucide-react';

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard', tasks: 'Tasks', users: 'Users', payment: 'Payments',
  'rewards-platform': 'Rewards', disputes: 'Disputes', cancellations: 'Cancellations',
  reports: 'Reports', locations: 'Locations', 'service-categories': 'Service Categories',
  settings: 'Settings', admin: 'Admin', 'chat-moderation': 'Chat Moderation',
};

const Header = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const pageName = segments[0] === 'chat-moderation'
    ? ({ overview: 'Chat Moderation', logs: 'Moderation Logs', rules: 'Moderation Rules' }[segments[1]] || 'Chat Moderation')
    : pageNames[segments[0]] || 'Dashboard';
  return (
    <div className="flex h-[62px] w-full items-center justify-between border-b border-[#e2e7ef] bg-white px-8 max-sm:px-4">
      <p className="truncate text-[18px] font-semibold text-[#1B3061]">{pageName}</p>

      <div className="flex items-center gap-3">
        <details className="relative">
          <summary aria-label="Help" title="Help" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-[#1B3061] hover:bg-[#f4f6ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3061]/20 [&::-webkit-details-marker]:hidden">
            <CircleHelp aria-hidden="true" size={20} strokeWidth={2.2} />
          </summary>
          <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-[#e2e7ef] bg-white p-4 text-sm text-[#475569] shadow-lg max-sm:-right-20">
            <p className="mb-2 font-semibold text-[#1B3061]">Help</p>
            <p>Use the sidebar to open a page. On Tasks, results update as you type in the search field. Choose filters and select Filter to apply them. Select Reset to clear all filters.</p>
          </div>
        </details>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1B3061] transition-colors hover:bg-[#f4f6ff]"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={2.2} />
          <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-[#e72961] ring-2 ring-white" />
        </button>

        <Link
          href="/settings"
          aria-label="Open settings"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B3061] text-[11px] font-bold text-white transition-colors hover:bg-[#142653] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B3061]/20"
        >
          AU
        </Link>
      </div>
    </div>
  );
};

export default Header;
