'use client';

import React from 'react';
import {
  AlertTriangle,
  BadgePercent,
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  CreditCard,
  Download,
  Flag,
  Gavel,
  Gift,
  IndianRupee,
  Landmark,
  MessageSquareWarning,
  PackageCheck,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Trash2,
  Trophy,
  UserRoundCheck,
  Zap,
} from 'lucide-react';
import TasksTable from './TasksTable';
import { cn } from './dashboard-ui';

type MetricTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

type MetricCard = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
  detail?: string;
  action?: string;
};

const filters = [
  { label: 'Today', value: '24 Oct, 2023', icon: CalendarDays },
  { label: 'All Categories', value: '', icon: null },
  { label: 'All Services', value: '', icon: null },
  { label: 'All Statuses', value: '', icon: null },
];

const metricCards: MetricCard[] = [
  { title: 'Tasks Posted', value: '1,284', icon: Smartphone, tone: 'info' },
  { title: 'Completed Tasks', value: '946', icon: CheckCircle2, tone: 'success' },
  { title: 'Total Payments', value: '$2,48,650', icon: IndianRupee, tone: 'success' },
  {
    title: 'Total Commission',
    value: '$24,865',
    icon: BadgePercent,
    tone: 'success',
    detail: 'Normal Users: $18,815 Student Users: $6,050',
  },
  { title: 'Task Deletion Rate', value: '6.8%', icon: Trash2, tone: 'danger', detail: '54 deletions' },
  { title: 'Users Requiring Review', value: '18', icon: ShieldAlert, tone: 'danger', action: 'Review now' },
  { title: 'Tasks Without Offers', value: '142', icon: CircleAlert, tone: 'warning' },
  { title: 'Cancellation Rate', value: '6.8%', icon: Ban, tone: 'warning', detail: '87 cancellations' },
  { title: 'Cancellations Earnings', value: '$3,210', icon: CreditCard, tone: 'info', detail: '87 cancellations' },
  {
    title: 'Suspended & Reported',
    value: '18',
    icon: AlertTriangle,
    tone: 'danger',
    detail: 'Reported 7 Suspended Users',
    action: 'View flagged users',
  },
  { title: 'Moderations Detected', value: '356', icon: MessageSquareWarning, tone: 'info', detail: 'auto-scanned', action: '+12 detected today' },
  { title: 'Hard Moderations', value: '61', icon: Gavel, tone: 'danger', action: 'Review now' },
  { title: 'Milestone Products Total', value: '1,248', icon: Trophy, tone: 'warning', detail: 'Across all reward tiers' },
  { title: 'Total Points Granted', value: '48,500', icon: Gift, tone: 'warning', detail: 'Equiv: $485.00 AUD' },
  { title: 'Disputes', value: '7', icon: Flag, tone: 'danger', detail: 'Open Dispute 18 Closed Dispute' },
];

const topServices = [
  { name: 'House Cleaning', tasks: '342', revenue: '$68,400', icon: ClipboardList, iconClass: 'text-[#2563eb]', iconWrapClass: 'bg-[#eaf2ff]' },
  { name: 'Plumbing Repair', tasks: '215', revenue: '$86,000', icon: Landmark, iconClass: 'text-[#0f9f74]', iconWrapClass: 'bg-[#e6f7ef]' },
  { name: 'Electrical Work', tasks: '189', revenue: '$75,600', icon: Zap, iconClass: 'text-[#7c3aed]', iconWrapClass: 'bg-[#f1eaff]' },
];

const topCategories = [
  { label: 'In Person', value: '412 (24%)', color: '#df8226', widthClass: 'w-[78%]', icon: PackageCheck },
  { label: 'Professional', value: '298 (21%)', color: '#3b82f6', widthClass: 'w-[62%]', icon: UserRoundCheck },
  { label: 'Online', value: '246 (19%)', color: '#9a4d17', widthClass: 'w-[52%]', icon: Smartphone },
  { label: 'Others', value: '194 (15%)', color: '#64748b', widthClass: 'w-[40%]', icon: Sparkles },
];

const toneClasses = {
  default: {
    card: 'border-[#dde5f1] bg-white',
    icon: 'bg-[#eef2ff] text-[#1B3061]',
    title: 'text-[#68758d]',
    value: 'text-[#202b3d]',
  },
  success: {
    card: 'border-[#dde5f1] bg-white',
    icon: 'bg-[#e8f9f0] text-[#10b981]',
    title: 'text-[#68758d]',
    value: 'text-[#202b3d]',
  },
  warning: {
    card: 'border-[#dde5f1] bg-white',
    icon: 'bg-[#fff6db] text-[#e68a2e]',
    title: 'text-[#68758d]',
    value: 'text-[#202b3d]',
  },
  danger: {
    card: 'border-[#ffd9d4] bg-[#fff1ef]',
    icon: 'bg-[#ffe1e1] text-[#ef4444]',
    title: 'text-[#c62828]',
    value: 'text-[#b91c1c]',
  },
  info: {
    card: 'border-[#dde5f1] bg-white',
    icon: 'bg-[#eef2ff] text-[#1B3061]',
    title: 'text-[#68758d]',
    value: 'text-[#202b3d]',
  },
};

const DashboardFilterBar = () => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#dfe5ef] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => {
        const FilterIcon = filter.icon;

        return (
          <button
            key={filter.label}
            type="button"
            className="dashboard-interactive inline-flex h-8 items-center justify-center gap-2 rounded-[5px] border border-[#dbe4ef] bg-white px-3 text-[12px] font-semibold text-[#26354d] hover:bg-[#fbfcfe]"
          >
            {FilterIcon ? <FilterIcon size={14} strokeWidth={2.1} className="text-[#64748b]" /> : null}
            <span>{filter.label}</span>
            {filter.value ? <span className="text-[11px] font-medium text-[#7a8798]">{filter.value}</span> : null}
            <ChevronDown size={13} strokeWidth={2.3} className="text-[#64748b]" />
          </button>
        );
      })}
    </div>

    <button
      type="button"
      className="dashboard-interactive inline-flex h-8 items-center justify-center gap-2 rounded-[5px] border border-[#dbe4ef] bg-white px-4 text-[12px] font-bold text-[#26354d] hover:bg-[#fbfcfe]"
    >
      <Download size={14} strokeWidth={2.2} />
      Export Report
    </button>
  </div>
);

const MetricTile = ({ metric }: { metric: MetricCard }) => {
  const Icon = metric.icon;
  const classes = toneClasses[metric.tone];

  return (
    <article
      className={cn(
        'dashboard-interactive flex min-h-[128px] flex-col justify-between rounded-[10px] border p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
        classes.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className={cn('text-[12px] font-semibold leading-4', classes.title)}>{metric.title}</h2>
        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', classes.icon)}>
          <Icon size={15} strokeWidth={2.15} />
        </span>
      </div>

      <div>
        <p className={cn('text-[30px] font-bold leading-8 tracking-normal', classes.value)}>{metric.value}</p>
        {metric.detail ? <p className="mt-1 text-[10px] font-medium leading-4 text-[#6f7d94]">{metric.detail}</p> : null}
        {metric.action ? <p className="mt-2 text-[11px] font-bold leading-3 text-[#0b63ce]">{metric.action} -&gt;</p> : null}
      </div>
    </article>
  );
};

const PanelHeader = ({ title }: { title: string }) => (
  <div className="flex h-[42px] items-center justify-between px-4">
    <h2 className="text-[15px] font-bold text-[#202b3d]">{title}</h2>
    <a href="#" className="text-[13px] font-bold text-[#0b63ce]">
      View All
    </a>
  </div>
);

const TopServicesPanel = () => (
  <section className="overflow-hidden rounded-[10px] border border-[#dde5f1] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
    <PanelHeader title="Top Services (Above 25%)" />
    <div className="grid grid-cols-[minmax(0,1fr)_72px_88px] bg-[#f8fafc] px-4 py-3 text-[11px] font-bold uppercase text-[#77849b]">
      <span>Service</span>
      <span>Tasks</span>
      <span className="text-right">Revenue</span>
    </div>
    <div>
      {topServices.map((service) => {
        const ServiceIcon = service.icon;

        return (
          <div
            key={service.name}
            className="grid min-h-[50px] grid-cols-[minmax(0,1fr)_72px_88px] items-center border-t border-[#eef2f6] px-4 text-[13px] text-[#26354d]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px]', service.iconWrapClass)}>
                <ServiceIcon size={13} strokeWidth={2.15} className={service.iconClass} />
              </span>
              <span className="truncate font-semibold">{service.name}</span>
            </span>
            <span>{service.tasks}</span>
            <span className="text-right font-medium">{service.revenue}</span>
          </div>
        );
      })}
    </div>
  </section>
);

const TopCategoryPanel = () => (
  <section className="overflow-hidden rounded-[10px] border border-[#dde5f1] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
    <PanelHeader title="Top Category" />
    <div className="space-y-3 px-4 pb-4 pt-2">
      {topCategories.map((category) => {
        const CategoryIcon = category.icon;

        return (
          <div key={category.label}>
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-2 font-semibold text-[#26354d]">
                <CategoryIcon size={13} strokeWidth={2.1} style={{ color: category.color }} />
                {category.label}
              </span>
              <span className="font-medium text-[#64748b]">{category.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#edf1f7]">
              <div className={cn('h-full rounded-full', category.widthClass)} style={{ backgroundColor: category.color }} />
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const OverviewDashboard = () => (
  <div className="animate-dashboard-entry max-h-[calc(100vh-94px)] overflow-y-auto pb-10 pr-1">
    <DashboardFilterBar />

    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
      {metricCards.map((metric) => (
        <MetricTile key={metric.title} metric={metric} />
      ))}
    </div>

    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
      <div className="min-w-0">
        <TasksTable />
      </div>

      <aside className="space-y-5">
        <TopServicesPanel />
        <TopCategoryPanel />
      </aside>
    </div>
  </div>
);

export default OverviewDashboard;
