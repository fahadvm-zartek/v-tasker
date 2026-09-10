import Link from 'next/link';
import { AlertTriangle, Download, Gavel, Search, ShieldCheck } from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPagination,
  DashboardPrimaryButton,
  DashboardSelectButton,
  DashboardTableShell,
  cn,
  dashboardButtonClass,
  dashboardStatusBadgeClass,
} from '../components';

type ResolutionTab = {
  label: string;
  count: string;
  href: string;
  active?: boolean;
};

type MetricTone = 'red' | 'amber' | 'green';
type DisputeStatus = 'Dispute Raised' | 'Under Review' | 'Resolved';

type DisputeMetric = {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
};

type DisputeRow = {
  id: string;
  task: string;
  service: string;
  raisedBy: string;
  role: 'Client' | 'Tasker';
  initials: string;
  avatarClass: string;
  against: string;
  category: 'Payment' | 'Quality' | 'No Show' | 'Miscommunication';
  status: DisputeStatus;
  date: string;
};

const resolutionTabs: ResolutionTab[] = [
  { label: 'Disputes', count: '34', href: '/disputes', active: true },
  { label: 'Cancellations', count: '48', href: '/cancellations' },
];

const disputeMetrics: DisputeMetric[] = [
  { label: 'Open Disputes', value: '23', icon: AlertTriangle, tone: 'red' },
  { label: 'Under Review', value: '11', icon: Search, tone: 'amber' },
  { label: 'Resolved', value: '89', icon: ShieldCheck, tone: 'green' },
];

const disputeRows: DisputeRow[] = [
  ['#DIS-1142', '#TSK-4421', 'Deep Cleaning', 'John Doe', 'Client', 'JD', 'bg-[#dbeafe] text-[#2563eb]', 'Jane Smith', 'Payment', 'Dispute Raised', 'Oct 24, 2023'],
  ['#DIS-1141', '#TSK-4398', 'Plumbing Repair', 'Alice Stone', 'Tasker', 'AS', 'bg-[#fef3c7] text-[#b45309]', 'Bob Marley', 'Quality', 'Under Review', 'Oct 23, 2023'],
  ['#DIS-1140', '#TSK-4210', 'Furniture Assembly', 'Mark Wahlberg', 'Client', 'MW', 'bg-[#dcfce7] text-[#047857]', 'Tom Cruise', 'No Show', 'Dispute Raised', 'Oct 22, 2023'],
  ['#DIS-1139', '#TSK-4105', 'Yard Work', 'Steve Jobs', 'Tasker', 'SJ', 'bg-[#e0e7ff] text-[#4f46e5]', 'Bill Gates', 'Miscommunication', 'Resolved', 'Oct 20, 2023'],
  ['#DIS-1138', '#TSK-4099', 'Moving Help', 'Emma Hayes', 'Client', 'EH', 'bg-[#fee2e2] text-[#dc2626]', 'David Moyes', 'Payment', 'Resolved', 'Oct 18, 2023'],
  ['#DIS-1137', '#TSK-3950', 'Tech Support', 'Rafael Nadal', 'Tasker', 'RN', 'bg-[#dbeafe] text-[#2563eb]', 'Roger Federer', 'Quality', 'Under Review', 'Oct 15, 2023'],
  ['#DIS-1136', '#TSK-3812', 'Event Staffing', 'Serena Williams', 'Client', 'SW', 'bg-[#ccfbf1] text-[#0f766e]', 'Maria Sharapova', 'No Show', 'Dispute Raised', 'Oct 12, 2023'],
  ['#DIS-1135', '#TSK-3701', 'Delivery', 'Lewis Hamilton', 'Tasker', 'LH', 'bg-[#fef3c7] text-[#b45309]', 'Max Verstappen', 'Miscommunication', 'Resolved', 'Oct 10, 2023'],
].map(([id, task, service, raisedBy, role, initials, avatarClass, against, category, status, date]) => ({
  id,
  task,
  service,
  raisedBy,
  role: role as DisputeRow['role'],
  initials,
  avatarClass,
  against,
  category: category as DisputeRow['category'],
  status: status as DisputeStatus,
  date,
}));

const metricToneClasses: Record<MetricTone, { icon: string; iconWrap: string; value: string }> = {
  red: { icon: 'text-[#ef4444]', iconWrap: 'bg-[#fff0f0]', value: 'text-[#ef4444]' },
  amber: { icon: 'text-[#d97706]', iconWrap: 'bg-[#fff7e6]', value: 'text-[#d97706]' },
  green: { icon: 'text-[#10b981]', iconWrap: 'bg-[#e8fbf2]', value: 'text-[#10b981]' },
};

const categoryClass: Record<DisputeRow['category'], string> = {
  Payment: 'text-[#2563eb]',
  Quality: 'text-[#d97706]',
  'No Show': 'text-[#dc2626]',
  Miscommunication: 'text-[#475569]',
};

const statusTone: Record<DisputeStatus, 'danger' | 'warning' | 'success'> = {
  'Dispute Raised': 'danger',
  'Under Review': 'warning',
  Resolved: 'success',
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

const DisputesPage = () => (
  <DashboardPageShell contentClassName="px-0 pb-10 pt-0">
    <div className="animate-dashboard-entry">
      <DashboardPageHeader title="Disputes" className="border-b border-[#dfe6f0] pb-2 pt-4" />
      <ResolutionTabs tabs={resolutionTabs} />

      <section aria-label="Dispute metrics" className="mt-5 grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        {disputeMetrics.map((metric) => {
          const tone = metricToneClasses[metric.tone];

          return (
            <DashboardMetricCard
              key={metric.label}
              title={metric.label}
              icon={metric.icon}
              iconClass={tone.icon}
              iconWrapClass={tone.iconWrap}
              className="min-h-[74px] justify-center px-5"
            >
              <div>
                <p className={cn('text-[22px] font-bold leading-7', tone.value)}>{metric.value}</p>
              </div>
            </DashboardMetricCard>
          );
        })}
      </section>

      <DashboardTableShell className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf3] px-4 py-4">
          <h2 className="text-[17px] font-bold text-[#202b3d]">Recent Disputes</h2>
          <DashboardPrimaryButton>
            <Download size={13} strokeWidth={2.3} />
            Export
          </DashboardPrimaryButton>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e6ebf3] px-4 py-3">
          {['Status: All', 'Category: All', 'Date: Latest', 'Priority: All'].map((filter) => (
            <DashboardSelectButton key={filter} className="min-w-[126px]">{filter}</DashboardSelectButton>
          ))}
          <button type="button" className="text-[11px] font-bold text-[#1B3061]">Clear Filters</button>
        </div>
        <div className="overflow-x-auto">
          <table className="ui-table min-w-[1120px] table-fixed">
            <thead>
              <tr className="ui-table-head h-[42px] text-left">
                {['DISPUTE ID', 'TASK REFERENCE', 'RAISED BY', 'AGAINST', 'CATEGORY', 'STATUS', 'DATE FILED', 'ACTION'].map((heading) => (
                  <th key={heading} className={cn('px-4 text-[10px]', heading === 'ACTION' ? 'text-right' : '')}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disputeRows.map((row) => (
                <tr key={row.id} className="ui-table-row h-[58px]">
                  <td className="px-4 text-[11px] font-bold text-[#172033]">{row.id}</td>
                  <td className="px-4 text-[11px] font-medium text-[#64748b]"><span className="font-bold text-[#1B3061]">{row.task}</span> - {row.service}</td>
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <Avatar initials={row.initials} className={row.avatarClass} />
                      <span className="text-[11px] font-semibold text-[#172033]">{row.raisedBy}</span>
                      <span className="rounded-[4px] bg-[#eef2f6] px-1.5 py-0.5 text-[8px] font-bold text-[#475569]">{row.role}</span>
                    </div>
                  </td>
                  <td className="px-4 text-[11px] font-medium text-[#172033]">{row.against}</td>
                  <td className={cn('px-4 text-[11px] font-semibold', categoryClass[row.category])}>{row.category}</td>
                  <td className="px-4"><span className={dashboardStatusBadgeClass(statusTone[row.status])}>{row.status}</span></td>
                  <td className="px-4 text-[11px] font-medium text-[#64748b]">{row.date}</td>
                  <td className="px-4 text-right">
                    <Link href={`/disputes/${row.id.replace('#', '')}`} className={cn(dashboardButtonClass(row.status === 'Resolved' ? 'outline' : 'primary', 'sm'))}>
                      {row.status === 'Resolved' ? 'View' : 'Review ->'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between border-t border-[#e6ebf3] px-4 py-4 text-[11px] font-medium text-[#64748b]">
          <span>Showing 1 to 8 of 123 entries</span>
          <DashboardPagination pages={['1', '2', '3', '...']} label="Disputes pagination" />
        </footer>
      </DashboardTableShell>
    </div>
  </DashboardPageShell>
);

export default DisputesPage;
