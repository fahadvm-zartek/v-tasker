import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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

export const DashboardPageHeader = ({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) => (
  <header className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
    <div>
      <h1 className="page-title">{title}</h1>
      {description ? <p className="page-description mt-1">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
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
      'ui-card',
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
  value?: string;
  icon: IconComponent;
  iconClass: string;
  iconWrapClass: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <article
    className={cn(
      'ui-card dashboard-interactive flex min-h-[150px] flex-col justify-between p-4',
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
      {value ? <p className="text-[25px] font-bold leading-8 text-[#202b3d]">{value}</p> : null}
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
      className="ui-control h-full w-full pl-9 pr-3 text-[11px] placeholder:text-[#93a0b4]"
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
      'ui-control inline-flex h-8 items-center justify-between gap-2 px-3 text-[11px] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe] focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15',
      className,
    )}
  >
    {children}
  </button>
);

export const dashboardButtonClass = (
  variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
) => {
  const variants = {
    primary: 'ui-button-primary',
    secondary: 'ui-button-secondary',
    outline: 'ui-button-outline',
    danger: 'ui-button-danger',
    success: 'ui-button-success',
  };
  const sizes = {
    sm: 'h-8 px-3 text-[11px]',
    md: 'h-9 px-4 text-[12px]',
    lg: 'h-10 px-5 text-[13px]',
  };

  return cn(variants[variant], sizes[size]);
};

type DashboardButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export const DashboardPrimaryButton = ({
  children,
  className,
  ...buttonProps
}: DashboardButtonProps) => (
  <button
    type="button"
    {...buttonProps}
    className={cn(
      dashboardButtonClass('primary', 'sm'),
      'shrink-0',
      className,
    )}
  >
    {children}
  </button>
);

export const DashboardSecondaryButton = ({
  children,
  className,
  ...buttonProps
}: DashboardButtonProps) => (
  <button
    type="button"
    {...buttonProps}
    className={cn(
      dashboardButtonClass('secondary', 'sm'),
      'shrink-0',
      className,
    )}
  >
    {children}
  </button>
);

export const DashboardIconButton = ({
  children,
  className,
  onClick,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={cn('ui-icon-button h-8 w-8 transition-colors hover:bg-[#eef2ff] hover:text-[#1B3061]', className)}
  >
    {children}
  </button>
);

export const DashboardTableShell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <DashboardPanel className={cn('relative overflow-visible', className)}>
    {children}
  </DashboardPanel>
);

export const DashboardPagination = ({
  pages,
  activePage = '1',
  label,
}: {
  pages: string[];
  activePage?: string;
  label: string;
}) => (
  <nav className="flex items-center gap-2" aria-label={label}>
    <button type="button" className="text-[#b0bac9]" aria-label="Previous page">
      <ChevronLeft size={16} strokeWidth={2.2} />
    </button>
    {pages.map((page) => (
      <button
        key={page}
        type="button"
        className={cn(
          'ui-pagination-button',
          page === activePage && 'ui-pagination-button-active',
        )}
      >
        {page}
      </button>
    ))}
    <button type="button" className="text-[#94a3b8]" aria-label="Next page">
      <ChevronRight size={16} strokeWidth={2.2} />
    </button>
  </nav>
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
