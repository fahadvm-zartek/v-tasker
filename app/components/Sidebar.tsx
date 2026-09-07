'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MapPin,
  MessageSquareWarning,
  Settings,
  Tags,
  TriangleAlert,
  Users,
} from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'v-Tasker-sidebar-collapsed';

const getInitialSidebarCollapsed = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
};

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutGrid },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Reports', href: '/reports', icon: TriangleAlert },
  { label: 'Locations', href: '/locations', icon: MapPin },
  { label: 'Service Categories', href: '/service-categories', icon: Tags },
  {
    label: 'Chat Moderation',
    href: '/chat-moderation/overview',
    icon: MessageSquareWarning,
    children: [
      { label: 'Overview', href: '/chat-moderation/overview' },
      { label: 'Moderation Logs', href: '/chat-moderation/logs' },
      { label: 'Rules', href: '/chat-moderation/rules' },
    ],
  },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(getInitialSidebarCollapsed);
  const [expandedMenuLabel, setExpandedMenuLabel] = useState<string | null>(null);
  const ToggleIcon = isCollapsed ? ChevronRight : ChevronLeft;

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    document.documentElement.dataset.sidebarCollapsed = String(isCollapsed);
    document.documentElement.style.setProperty(
      '--layout-sidebar-current',
      isCollapsed ? '64px' : '256px',
    );
  }, [isCollapsed]);

  return (
    <aside
      className="fixed left-0 top-0 z-20 flex h-screen w-[var(--layout-sidebar-current)] flex-col justify-between border-r border-[#dfe5ef] bg-white text-[#1B3061] transition-[width] duration-300 max-md:hidden"
    >
      <button
        type="button"
        className="absolute -right-[14px] top-[18px] z-30 flex h-7 w-7 items-center justify-center rounded-full border border-[#dfe5ef] bg-white text-[#1B3061] shadow-[0_8px_20px_rgba(27,48,97,0.16)] transition-all duration-200 hover:border-[#E68A2E] hover:text-[#E68A2E] hover:shadow-[0_10px_24px_rgba(27,48,97,0.20)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E68A2E]/30"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!isCollapsed}
        onClick={() => setIsCollapsed((current) => !current)}
      >
        <ToggleIcon size={15} strokeWidth={2.4} />
      </button>

      <div>
        <div className="sidebar-brand-row flex h-[64px] items-center gap-3 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border-2 border-[#1B3061] bg-white shadow-[0_5px_13px_rgba(27,48,97,0.12)]">
  <img
    src="/logo.png"
    alt="V Tasker"
    className="h-7 w-7 object-contain"
  />
</div>
          <div
            className="sidebar-brand-copy flex w-[170px] flex-col overflow-hidden whitespace-nowrap opacity-100 transition-all duration-200"
          >
            <span className="text-[17px] font-bold leading-5 text-[#1B3061]">
              V Tasker
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#777682]">
              ADMIN PANEL
            </span>
          </div>
        </div>

        <nav className="pt-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href) || item.children?.some((child) => isActivePath(child.href));
            const isExpanded = expandedMenuLabel === item.label;

            const itemClass = isActive
              ? 'sidebar-nav-link group relative flex h-[42px] items-center justify-between bg-[#eef2ff] px-4 text-[14px] font-medium text-[#1B3061] transition-all duration-150'
              : 'sidebar-nav-link group relative flex h-12 items-center justify-between px-4 text-[14px] font-normal text-[#454756] transition-all duration-150 hover:bg-[#f6f7fb] hover:text-[#1B3061]';

            return (
              <div key={item.label} className="sidebar-nav-group">
                {item.children ? (
                  <button
                    type="button"
                    className={itemClass}
                    aria-current={isActive ? 'page' : undefined}
                    aria-expanded={item.children ? isExpanded : undefined}
                    onClick={() => setExpandedMenuLabel(isExpanded ? null : item.label)}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 top-0 w-1 bg-[#1B3061] "
                      />
                    )}

                    <div className="sidebar-nav-main flex items-center gap-[14px]">
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.25 : 1.85}
                        className={`shrink-0 transition-colors ${isActive ? 'text-[#1B3061]' : 'text-[#4f5160] group-hover:text-[#1B3061]'
                          }`}
                      />
                      <span
                        className="sidebar-label w-[148px] truncate overflow-hidden whitespace-nowrap opacity-100 transition-all duration-200"
                      >
                        {item.label}
                      </span>
                    </div>

                    <ChevronRight
                      size={14}
                      strokeWidth={2.2}
                      className={`sidebar-badge shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
                    />

                    <span
                      className="sidebar-tooltip pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-[7px] border border-[#dfe5ef] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1B3061] opacity-0 shadow-[0_8px_20px_rgba(27,48,97,0.16)] transition-opacity duration-150 group-hover:opacity-100"
                      role="tooltip"
                    >
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={itemClass}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setExpandedMenuLabel(null)}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 top-0 w-1 bg-[#1B3061] "
                      />
                    )}

                    <div className="sidebar-nav-main flex items-center gap-[14px]">
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.25 : 1.85}
                        className={`shrink-0 transition-colors ${isActive ? 'text-[#1B3061]' : 'text-[#4f5160] group-hover:text-[#1B3061]'
                          }`}
                      />
                      <span
                        className="sidebar-label w-[148px] truncate overflow-hidden whitespace-nowrap opacity-100 transition-all duration-200"
                      >
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span className="sidebar-badge rounded-full bg-[#f5f6f8] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c7c88]">
                        {item.badge}
                      </span>
                    )}

                    <span
                      className="sidebar-tooltip pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-[7px] border border-[#dfe5ef] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1B3061] opacity-0 shadow-[0_8px_20px_rgba(27,48,97,0.16)] transition-opacity duration-150 group-hover:opacity-100"
                      role="tooltip"
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
                {item.children && isExpanded ? (
                  <div className="sidebar-subnav py-1.5 pl-[52px] pr-3">
                    {item.children?.map((child) => {
                      const isChildActive = isActivePath(child.href);

                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`sidebar-subnav-link relative flex h-8 items-center rounded-[6px] px-3 pl-4 text-[12px] font-medium transition-colors ${
                            isChildActive
                              ? 'bg-[#f3f6ff] text-[#1B3061] shadow-[inset_0_0_0_1px_rgba(27,48,97,0.04)]'
                              : 'text-[#6f7280] hover:bg-[#f7f8fb] hover:text-[#1B3061]'
                          }`}
                          aria-current={isChildActive ? 'page' : undefined}
                        >
                          {isChildActive ? (
                            <span
                              aria-hidden="true"
                              className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-full bg-[#1B3061]"
                            />
                          ) : null}
                          <span className="sidebar-label truncate overflow-hidden whitespace-nowrap opacity-100 transition-all duration-200">
                            {child.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Profile */}
      <div className="border-t border-[#dfe5ef] px-4 py-[18px]">
        <div className="sidebar-profile-row flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B3061] text-[11px] font-bold text-white">
            AU
          </div>
          <div
            className="sidebar-profile-copy flex w-[170px] flex-col truncate overflow-hidden whitespace-nowrap opacity-100 transition-all duration-200"
          >
            <span className="truncate text-[14px] font-bold leading-5 text-[#0d1b2f]">Admin User</span>
            <span className="truncate text-[11px] font-normal leading-4 text-[#777682]">
              admin@alwaysvalentines.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
