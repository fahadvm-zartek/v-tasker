import React from 'react';
import { Search } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';

type IconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const DashboardPageShell = ({
  children,
  contentClassName,
}: {
  children: React.ReactNode;
  contentClassName?: string;
}) => (
  <div className="app-shell flex min-h-screen bg-[#f7f8fa]">
    <Sidebar />

    <main className="dashboard-main flex-1 pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
      <Header />

      <div className={cn('dashboard-container px-8 pb-10 pt-5 max-sm:px-4', contentClassName)}>
        {children}
      </div>
    </main>
  </div>
);

export const DashboardPanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      'overflow-hidden rounded-[10px] border border-[#dde5f1] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
      className,
    )}
  >
    {children}
  </section>
);

export const DashboardMetricCard = ({
  title,
  value,
  icon: Icon,
  iconClass,
  iconWrapClass,
  children,
  className,
}: {
  title: string;
  value: string;
  icon: IconComponent;
  iconClass: string;
  iconWrapClass: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <article
    className={cn(
      'dashboard-interactive flex min-h-[150px] flex-col justify-between rounded-[10px] border border-[#dde5f1] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[13px] font-medium leading-4 text-[#596982]">{title}</p>
      <span className={cn('flex h-7 w-7 items-center justify-center rounded-[6px]', iconWrapClass)}>
        <Icon size={15} strokeWidth={2.1} className={iconClass} />
      </span>
    </div>

    <div>
      <p className="text-[25px] font-bold leading-8 text-[#202b3d]">{value}</p>
      {children}
    </div>
  </article>
);

export const DashboardSearchField = ({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) => (
  <label className={cn('relative block h-8 w-[245px] shrink-0', className)}>
    <Search
      aria-hidden="true"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8190a6]"
      size={15}
    />
    <input
      type="search"
      placeholder={placeholder}
      className="h-full w-full rounded-[5px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[11px] text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
    />
  </label>
);

export const DashboardSelectButton = ({
  children,
  className,
  onClick,
  ariaExpanded,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaExpanded?: boolean;
}) => (
  <button
    type="button"
    aria-expanded={ariaExpanded}
    onClick={onClick}
    className={cn(
      'inline-flex h-8 items-center justify-between gap-2 rounded-[5px] border border-[#dbe4ef] bg-white px-3 text-[11px] font-medium text-[#1f2937] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe] focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15',
      className,
    )}
  >
    {children}
  </button>
);

export const DashboardPrimaryButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#1B3061] px-4 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(27,48,97,0.18)] transition-colors hover:bg-[#14244d]',
      className,
    )}
  >
    {children}
  </button>
);

export const DashboardSecondaryButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[5px] border border-[#dbe4ef] bg-white px-3 text-[11px] font-semibold text-[#475569] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe] focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15',
      className,
    )}
  >
    {children}
  </button>
);

export const dashboardStatusBadgeClass = (tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info') => {
  const tones = {
    success: 'bg-[#dcf7e9] text-[#047857]',
    warning: 'bg-[#fff0d7] text-[#9a5b00]',
    danger: 'bg-[#ffe1e1] text-[#dc2626]',
    neutral: 'bg-[#eef2f6] text-[#475569]',
    info: 'bg-[#eef2ff] text-[#1B3061]',
  };

  return cn('status-badge', tones[tone]);
};
