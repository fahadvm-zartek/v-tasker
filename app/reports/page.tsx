import {
  CircleAlert,
  Clock3,
  FileText,
  MessageSquareWarning,
  Search,
  SmilePlus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardPanel,
  dashboardStatusBadgeClass,
} from '../components';

type ReportMetric = {
  title: string;
  value: string;
  trend: string;
  trendTone: 'positive' | 'negative' | 'danger';
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
};

type Complaint = {
  id: string;
  initials: string;
  avatarClass: string;
  user: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  dateFiled: string;
  assignedTo: string;
  status: 'Pending' | 'Under Investigation' | 'Resolved' | 'Open';
};

const metrics: ReportMetric[] = [
  {
    title: 'Total Complaints',
    value: '156',
    trend: '+5% vs last month',
    trendTone: 'negative',
    icon: FileText,
    iconClass: 'text-[#1B3061]',
    iconWrapClass: 'bg-[#eaf0ff]',
  },
  {
    title: 'Avg. Resolution Time',
    value: '4.2h',
    trend: '-12% improvement',
    trendTone: 'positive',
    icon: Clock3,
    iconClass: 'text-[#8b5cf6]',
    iconWrapClass: 'bg-[#f0e4ff]',
  },
  {
    title: 'Critical Issues',
    value: '12',
    trend: 'high priority',
    trendTone: 'danger',
    icon: CircleAlert,
    iconClass: 'text-[#ef4444]',
    iconWrapClass: 'bg-[#ffe1e1]',
  },
  {
    title: 'Satisfaction Score',
    value: '4.8/5',
    trend: '+2%',
    trendTone: 'positive',
    icon: SmilePlus,
    iconClass: 'text-[#10b981]',
    iconWrapClass: 'bg-[#dcfaee]',
  },
];

const complaints: Complaint[] = [
  {
    id: '#CMP-1042',
    initials: 'JS',
    avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    user: 'John Smith',
    category: 'App Issues',
    severity: 'Critical',
    dateFiled: 'Jun 28, 2025',
    assignedTo: 'Sarah Jenkins',
    status: 'Pending',
  },
  {
    id: '#CMP-1041',
    initials: 'AL',
    avatarClass: 'bg-[#cbf7e6] text-[#059669]',
    user: 'Alice Lee',
    category: 'Payment',
    severity: 'High',
    dateFiled: 'Jun 27, 2025',
    assignedTo: 'Mike Davis',
    status: 'Under Investigation',
  },
  {
    id: '#CMP-1040',
    initials: 'RW',
    avatarClass: 'bg-[#eedcff] text-[#8b5cf6]',
    user: 'Robert Wilson',
    category: 'Provider Behavior',
    severity: 'Medium',
    dateFiled: 'Jun 26, 2025',
    assignedTo: 'Emma Watson',
    status: 'Resolved',
  },
  {
    id: '#CMP-1039',
    initials: 'CD',
    avatarClass: 'bg-[#eef2f6] text-[#475569]',
    user: 'Claire Davis',
    category: 'Cancellation',
    severity: 'Low',
    dateFiled: 'Jun 25, 2025',
    assignedTo: 'Unassigned',
    status: 'Open',
  },
];

const trendClass = {
  positive: 'text-[#059669]',
  negative: 'text-[#ef4444]',
  danger: 'text-[#ef4444]',
};

const severityClass = {
  Critical: dashboardStatusBadgeClass('danger'),
  High: dashboardStatusBadgeClass('warning'),
  Medium: 'status-badge bg-[#fef3c7] text-[#b45309]',
  Low: dashboardStatusBadgeClass('neutral'),
};

const statusClass = {
  Pending: dashboardStatusBadgeClass('warning'),
  'Under Investigation': dashboardStatusBadgeClass('info'),
  Resolved: dashboardStatusBadgeClass('success'),
  Open: dashboardStatusBadgeClass('neutral'),
};

const ReportsPage = () => (
  <DashboardPageShell>
    <div className="animate-dashboard-entry space-y-6">
      <section
        aria-label="Complaint metrics"
        className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
      >
        {metrics.map((metric) => {
          const TrendIcon = metric.trendTone === 'positive' ? TrendingUp : TrendingDown;

          return (
            <DashboardMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconClass={metric.iconClass}
              iconWrapClass={metric.iconWrapClass}
            >
              <p className={`mt-2 flex items-center gap-1 text-[12px] font-bold ${trendClass[metric.trendTone]}`}>
                {metric.trendTone === 'danger' ? (
                  <MessageSquareWarning size={13} strokeWidth={2.3} />
                ) : (
                  <TrendIcon size={13} strokeWidth={2.3} />
                )}
                {metric.trend}
              </p>
            </DashboardMetricCard>
          );
        })}
      </section>

      <DashboardPanel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf3] px-5 py-4">
          <h1 className="text-[20px] font-bold leading-7 text-[#202b3d]">Recent Complaints</h1>

          <label className="relative block h-9 w-full max-w-[292px]">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8190a6]"
              size={15}
            />
            <input
              type="search"
              placeholder="Search complaints..."
              className="h-full w-full rounded-[5px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[12px] text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="ui-table min-w-[920px] table-fixed">
            <thead>
              <tr className="ui-table-head h-[42px] text-left">
                <th className="w-[12%] px-5 text-[11px]">Complaint ID</th>
                <th className="w-[17%] px-5 text-[11px]">User</th>
                <th className="w-[15%] px-5 text-[11px]">Category</th>
                <th className="w-[10%] px-5 text-[11px]">Severity</th>
                <th className="w-[14%] px-5 text-[11px]">Date Filed</th>
                <th className="w-[15%] px-5 text-[11px]">Assigned To</th>
                <th className="w-[13%] px-5 text-[11px]">Status</th>
                <th className="w-[12%] px-5 text-right text-[11px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="ui-table-row h-[58px]">
                  <td className="px-5 text-[13px] font-medium text-[#49627f]">{complaint.id}</td>
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${complaint.avatarClass}`}
                      >
                        {complaint.initials}
                      </span>
                      <span className="truncate text-[13px] font-bold text-[#1f2937]">
                        {complaint.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 text-[13px] text-[#49627f]">{complaint.category}</td>
                  <td className="px-5">
                    <span className={severityClass[complaint.severity]}>{complaint.severity}</span>
                  </td>
                  <td className="px-5 text-[13px] text-[#64748b]">{complaint.dateFiled}</td>
                  <td className="px-5 text-[13px] text-[#49627f]">{complaint.assignedTo}</td>
                  <td className="px-5">
                    <span className={statusClass[complaint.status]}>{complaint.status}</span>
                  </td>
                  <td className="px-5 text-right">
                    <Link
                      href={`/reports/${complaint.id.replace('#', '')}`}
                      className="inline-flex h-8 items-center justify-center rounded-[7px] px-3 text-[12px] font-bold text-[#1B3061] transition-colors hover:bg-[#f3f6ff]"
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf3] px-5 py-4">
          <p className="text-[13px] text-[#64748b]">Showing 1 to 4 of 156 complaints</p>
          <nav className="flex items-center gap-2" aria-label="Reports pagination">
            <button
              type="button"
              className="h-8 rounded-[5px] border border-[#e5ebf3] px-3 text-[12px] font-medium text-[#a0a8b4]"
            >
              Previous
            </button>
            <button
              type="button"
              className="h-8 rounded-[5px] border border-[#dbe4ef] px-3 text-[12px] font-medium text-[#334155] hover:bg-[#f1f5f9]"
            >
              Next
            </button>
          </nav>
        </div>
      </DashboardPanel>
    </div>
  </DashboardPageShell>
);

export default ReportsPage;
