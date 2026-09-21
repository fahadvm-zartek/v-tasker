'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ban, CalendarDays, CreditCard, Download, FileX2, Gavel, ReceiptText } from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPagination,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSelectButton,
  DashboardTableShell,
  cn,
  dashboardButtonClass,
  dashboardStatusBadgeClass,
} from '../../../components';
import { fetchCancellationFeesPage } from '../../../services/cancellationService';

type ResolutionTab = {
  label: string;
  count: string;
  href: string;
  active?: boolean;
};

type MetricTone = 'slate' | 'blue' | 'red' | 'amber';
type CancellationStatus = 'Payment Cancelled' | 'Under Review' | 'Refund Processing' | 'Cancelled & Refunded' | 'Cancelled & Settled' | 'Voided & Closed';

type CancellationMetric = {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
};

type CancellationRow = {
  id: string;
  task: string;
  service: string;
  type: 'Payment Cancellation' | 'Task Cancellation' | 'Service Cancellation' | 'Booking Cancellation';
  initiatedBy: string;
  role: 'Auto' | 'Client' | 'Tasker';
  initials: string;
  avatarClass: string;
  reason: string;
  amount: string;
  status: CancellationStatus;
  date: string;
};

const resolutionTabs: ResolutionTab[] = [
  { label: 'Disputes', count: '34', href: '/disputes' },
  { label: 'Cancellations', count: '48', href: '/cancellations', active: true },
];

const metricToneClasses: Record<MetricTone, { card: string; icon: string; iconWrap: string; value: string }> = {
  slate: { card: '', icon: 'text-[#64748b]', iconWrap: 'bg-[#f1f5f9]', value: 'text-[#202b3d]' },
  blue: { card: 'border-[#b8d4ff]', icon: 'text-[#2563eb]', iconWrap: 'bg-[#eef4ff]', value: 'text-[#2563eb]' },
  red: { card: 'border-[#ffc8d2] bg-[#fff8f8]', icon: 'text-[#ef4444]', iconWrap: 'bg-[#ffe1e1]', value: 'text-[#ef4444]' },
  amber: { card: 'border-[#f6d88f] bg-[#fffdf6]', icon: 'text-[#d97706]', iconWrap: 'bg-[#fff0d7]', value: 'text-[#d97706]' },
};

const typeClass: Record<CancellationRow['type'], string> = {
  'Payment Cancellation': 'bg-[#ffe1e1] text-[#dc2626]',
  'Task Cancellation': 'bg-[#eaf2ff] text-[#2563eb]',
  'Service Cancellation': 'bg-[#fff0d7] text-[#d97706]',
  'Booking Cancellation': 'bg-[#f3e8ff] text-[#9333ea]',
};

const statusTone: Record<CancellationStatus, 'danger' | 'warning' | 'info' | 'success' | 'neutral'> = {
  'Payment Cancelled': 'danger',
  'Under Review': 'warning',
  'Refund Processing': 'info',
  'Cancelled & Refunded': 'success',
  'Cancelled & Settled': 'neutral',
  'Voided & Closed': 'neutral',
};

const ResolutionTabs = ({ tabs }: { tabs: ResolutionTab[] }) => (
  <nav className="flex border-b border-[#dfe6f0]" aria-label="Resolution Center sections">
    {tabs.map((tab) => (
      <Link
        key={tab.label}
        href={tab.href}
        aria-current={tab.active ? 'page' : undefined}
        className={cn(
          'relative inline-flex h-11 items-center gap-2 px-6 text-[11px] font-bold transition-colors',
          tab.active ? 'text-[#1B3061]' : 'text-[#64748b] hover:text-[#1B3061]',
        )}
      >
        <Gavel size={13} strokeWidth={2.2} />
        {tab.label}
        <span className="rounded-full bg-[#eaf2ff] px-2 py-0.5 text-[9px] font-bold text-[#1B3061]">{tab.count}</span>
        {tab.active ? <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B3061]" /> : null}
      </Link>
    ))}
  </nav>
);

const Avatar = ({ initials, className }: { initials: string; className: string }) => (
  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold', className)}>
    {initials}
  </span>
);

export default function CancellationsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CancellationRow[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCancellationFeesPage({ search, pageSize: 20 });
      if (res && res.cancellations) {
        setTotalCount(res.count || res.cancellations.length);
        const mapped = res.cancellations.map((item: any) => ({
          id: item.id || `#CAN-${item.rawId || 'N/A'}`,
          task: item.task || '#TSK-N/A',
          service: item.service || 'Cancellation Fee',
          type: (item.type || 'Task Cancellation') as CancellationRow['type'],
          initiatedBy: item.initiatedBy || 'System Auto',
          role: (item.role || 'Client') as CancellationRow['role'],
          initials: item.initials || 'NA',
          avatarClass: item.avatarClass || 'bg-[#dbeafe] text-[#2563eb]',
          reason: item.reason || 'Cancellation Fee Assessed',
          amount: item.amount || '$0.00',
          status: (item.status || 'Payment Cancelled') as CancellationStatus,
          date: item.date || 'N/A',
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error('Failed to load cancellations:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const metrics: CancellationMetric[] = [
    { label: 'Total Cancellations', value: totalCount ? `${totalCount}` : '48', detail: 'System Auto & User Requested', icon: FileX2, tone: 'slate' },
    { label: 'Task Cancellations', value: `${rows.length}`, detail: 'Client scheduling & provider conflicts', icon: ReceiptText, tone: 'blue' },
    { label: 'Payment Cancellations', value: '16', detail: 'Card decline & Gateway voids', icon: CreditCard, tone: 'red' },
    { label: 'Booking & Service Cancellations', value: '10', detail: 'Provider no-shows & scope aborts', icon: Ban, tone: 'amber' },
  ];

  return (
    <DashboardPageShell contentClassName="px-0 pb-10 pt-0">
      <div className="animate-dashboard-entry">
        <DashboardPageHeader title="Cancellations" className="border-b border-[#dfe6f0] pb-2 pt-4" />
        <ResolutionTabs tabs={resolutionTabs} />

        <section aria-label="Cancellation metrics" className="mt-5 grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1">
          {metrics.map((metric) => {
            const tone = metricToneClasses[metric.tone];

            return (
              <DashboardMetricCard
                key={metric.label}
                title={metric.label}
                icon={metric.icon}
                iconClass={tone.icon}
                iconWrapClass={tone.iconWrap}
                className={cn('min-h-[104px]', tone.card)}
              >
                <div className="-mt-1">
                  <p className="mt-2 text-[25px] font-bold leading-8 text-[#202b3d]">{metric.value}</p>
                  <p className="mt-1 max-w-[210px] text-[9px] font-medium leading-3 text-[#64748b]">{metric.detail}</p>
                </div>
              </DashboardMetricCard>
            );
          })}
        </section>

        <DashboardTableShell className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf3] px-4 py-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#202b3d]">All Cancellations (Tasks, Payments & Bookings)</h2>
              <p className="mt-1 text-[11px] font-medium text-[#64748b]">Filter by cancellation type, cause, refund stage, or initiating party.</p>
            </div>
            <DashboardPrimaryButton>
              <Download size={13} strokeWidth={2.3} />
              Export CSV
            </DashboardPrimaryButton>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#e6ebf3] px-4 py-3">
            <DashboardSearchField 
              value={search} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} 
              placeholder="Search Cancellation ID, Task, or User..." 
              className="min-w-[300px] flex-1" 
            />
            <DashboardSelectButton className="min-w-[132px]">All Cancellation Types</DashboardSelectButton>
            <DashboardSelectButton className="min-w-[116px]">All Causes</DashboardSelectButton>
            <DashboardSelectButton className="min-w-[116px]">All Statuses</DashboardSelectButton>
            <DashboardSelectButton className="min-w-[94px]">
              Latest
              <CalendarDays size={13} strokeWidth={2.1} className="text-[#64748b]" />
            </DashboardSelectButton>
            <button type="button" onClick={() => setSearch('')} className="text-[11px] font-bold text-[#1B3061]">Clear Filters</button>
          </div>
          <div className="overflow-x-auto">
            <table className="ui-table min-w-[1180px] table-fixed">
              <thead>
                <tr className="ui-table-head h-[42px] text-left">
                  {['CANCELLATION ID', 'TASK REFERENCE', 'CANCELLATION TYPE', 'INITIATED BY', 'REASON / CAUSE', 'AMOUNT', 'STATUS', 'DATE FILED', 'ACTION'].map((heading) => (
                    <th key={heading} className={cn('px-4 text-[10px]', heading === 'ACTION' ? 'text-right' : '')}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[12px] font-medium text-[#64748b]">
                      Loading cancellations...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[12px] font-medium text-[#64748b]">
                      No cancellations found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="ui-table-row h-[58px]">
                      <td className="px-4 text-[11px] font-bold text-[#172033]">{row.id}</td>
                      <td className="px-4 text-[11px] font-medium text-[#64748b]"><span className="font-bold text-[#1B3061]">{row.task}</span> - {row.service}</td>
                      <td className="px-4"><span className={cn('rounded-[4px] px-2 py-1 text-[9px] font-bold', typeClass[row.type] || 'bg-[#eaf2ff] text-[#2563eb]')}>{row.type}</span></td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <Avatar initials={row.initials} className={row.avatarClass} />
                          <span className="text-[11px] font-semibold text-[#172033]">{row.initiatedBy}</span>
                          <span className="rounded-[4px] bg-[#eef2f6] px-1.5 py-0.5 text-[8px] font-bold text-[#475569]">{row.role}</span>
                        </div>
                      </td>
                      <td className="px-4 text-[10px] font-semibold text-[#dc2626]">{row.reason}</td>
                      <td className="px-4 text-[11px] font-bold text-[#172033]">{row.amount}</td>
                      <td className="px-4"><span className={dashboardStatusBadgeClass(statusTone[row.status] || 'warning')}>{row.status}</span></td>
                      <td className="px-4 text-[11px] font-medium text-[#64748b]">{row.date}</td>
                      <td className="px-4 text-right">
                        <button type="button" className={dashboardButtonClass(row.status === 'Payment Cancelled' || row.status === 'Under Review' ? 'primary' : 'outline', 'sm')}>
                          {row.status === 'Payment Cancelled' || row.status === 'Under Review' ? 'Review ->' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-[#e6ebf3] px-4 py-4 text-[11px] font-medium text-[#64748b]">
            <span>Showing {rows.length} of {totalCount || rows.length} cancellation entries</span>
            <DashboardPagination pages={['1']} label="Cancellations pagination" />
          </footer>
        </DashboardTableShell>
      </div>
    </DashboardPageShell>
  );
}
