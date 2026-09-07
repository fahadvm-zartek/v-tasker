import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Flag,
  MessageSquareWarning,
  ShieldOff,
} from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSecondaryButton,
  DashboardSelectButton,
  dashboardStatusBadgeClass,
} from '../../components';

type ModerationMetric = {
  title: string;
  value: string;
  trend: string;
  helper?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconWrapClass: string;
  iconClass: string;
  valueClass?: string;
  trendClass: string;
  urgent?: boolean;
};

type ModerationRow = {
  name: string;
  userId: string;
  totalChats: number;
  triggered: number;
  flagged: number;
  blocked: number;
  score: number;
  scoreLabel: string;
  status: 'High Risk' | 'Flagged' | 'Normal';
};

const moderationMetrics: ModerationMetric[] = [
  {
    title: 'Total Chats Reviewed',
    value: '18,204',
    trend: '+12.5%',
    helper: 'vs last week',
    icon: Eye,
    iconWrapClass: 'bg-[#eaf0ff]',
    iconClass: 'text-[#1B3061]',
    trendClass: 'text-[#0f9f68]',
  },
  {
    title: 'Pending Moderation',
    value: '142',
    trend: '+5.2%',
    icon: MessageSquareWarning,
    iconWrapClass: 'bg-[#eef2ff]',
    iconClass: 'text-[#66758b]',
    trendClass: 'text-[#dc2626]',
  },
  {
    title: 'Flagged Chats',
    value: '356',
    trend: '+8.4%',
    helper: 'vs last week',
    icon: Flag,
    iconWrapClass: 'bg-[#fbece7]',
    iconClass: 'text-[#e45f2b]',
    trendClass: 'text-[#0f9f68]',
  },
  {
    title: 'Blocked Chats',
    value: '61',
    trend: '-2.1%',
    icon: ShieldOff,
    iconWrapClass: 'bg-[#eeeeed]',
    iconClass: 'text-[#4b5563]',
    trendClass: 'text-[#0f9f68]',
  },
  {
    title: 'High Risk Chats',
    value: '29',
    trend: 'Requires Immediate Action',
    icon: AlertTriangle,
    iconWrapClass: 'bg-[#ffe0df]',
    iconClass: 'text-[#ef4444]',
    valueClass: 'text-[#111827]',
    trendClass: 'text-[#dc2626]',
    urgent: true,
  },
];

const moderationRows: ModerationRow[] = [
  { name: 'Rahul Sharma', userId: 'VTK-10245', totalChats: 42, triggered: 12, flagged: 4, blocked: 1, score: 82, scoreLabel: '82 / 100', status: 'High Risk' },
  { name: 'Arjun Kumar', userId: 'VTK-10872', totalChats: 27, triggered: 8, flagged: 2, blocked: 0, score: 58, scoreLabel: '58 / 100', status: 'Flagged' },
  { name: 'Neha Thomas', userId: 'VTK-11439', totalChats: 36, triggered: 1, flagged: 0, blocked: 0, score: 12, scoreLabel: '12 / 100', status: 'Normal' },
  { name: 'Anita Joshi', userId: 'VTK-14592', totalChats: 15, triggered: 5, flagged: 1, blocked: 0, score: 45, scoreLabel: '45 / 100', status: 'Flagged' },
  { name: 'Vikram Singh', userId: 'VTK-09321', totalChats: 64, triggered: 18, flagged: 8, blocked: 2, score: 91, scoreLabel: '91 / 100', status: 'High Risk' },
];

const riskScoreClass = (score: number) => {
  if (score >= 80) return 'text-[#dc2626]';
  if (score >= 40) return 'text-[#c2410c]';
  return 'text-[#0f9f68]';
};

const statusClass = (status: ModerationRow['status']) => {
  const styles = {
    'High Risk': dashboardStatusBadgeClass('danger'),
    Flagged: dashboardStatusBadgeClass('warning'),
    Normal: dashboardStatusBadgeClass('neutral'),
  };

  return styles[status];
};

const FilterField = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <label className="min-w-0">
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#536173]">{label}</span>
    <DashboardSelectButton className="h-10 w-full text-[13px]">
      {icon}
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronDown size={14} className="shrink-0 text-[#536173]" />
    </DashboardSelectButton>
  </label>
);

const ModerationMetricCard = ({ metric }: { metric: ModerationMetric }) => {
  const Icon = metric.icon;
  const TrendIcon = metric.trend.startsWith('-') ? ArrowDown : ArrowUp;

  return (
    <DashboardMetricCard
      title={metric.title}
      value={metric.value}
      icon={Icon}
      iconClass={metric.iconClass}
      iconWrapClass={metric.iconWrapClass}
      className={metric.urgent ? 'border-[#f8b4b4] border-r-[6px] border-r-[#c81e1e]' : undefined}
    >
      <p className={`mt-4 flex items-center gap-1 text-[12px] font-bold ${metric.trendClass}`}>
        {metric.urgent ? <span>!</span> : <TrendIcon size={13} strokeWidth={2.4} />}
        {metric.trend}
        {metric.helper ? <span className="font-medium text-[#66758b]">{metric.helper}</span> : null}
      </p>
    </DashboardMetricCard>
  );
};

const ChatModerationOverviewPage = () => (
  <DashboardPageShell contentClassName="pb-12 pt-6">
        <div className="space-y-7">
          <header>
            <h1 className="text-[28px] font-bold leading-9 text-[#111827]">Chat Moderation Overview</h1>
            <p className="mt-1 text-[14px] font-medium text-[#4b5563]">Monitor and manage user chat activities across the platform.</p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {moderationMetrics.map((metric) => (
              <ModerationMetricCard key={metric.title} metric={metric} />
            ))}
          </div>

          <DashboardPanel>
            <div className="grid gap-3 border-b border-[#dfe7f2] bg-[#fbfcfe] p-4 lg:grid-cols-[minmax(220px,1.4fr)_150px_150px_180px_170px_auto_auto] lg:items-end">
              <label className="min-w-0">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#536173]">Search User</span>
                <DashboardSearchField placeholder="User ID, name, or mobile number" className="h-10 w-full" />
              </label>

              <FilterField label="Risk Level" value="All levels" />
              <FilterField label="Content Type" value="All types" />
              <FilterField label="Rule Category" value="All categories" />
              <FilterField label="Date Range" value="Last 7 days" icon={<CalendarDays size={15} className="text-[#536173]" />} />

              <DashboardPrimaryButton className="h-10 px-6 text-[13px]">
                Apply Filters
              </DashboardPrimaryButton>
              <DashboardSecondaryButton className="h-10 px-5 text-[13px]">
                <Download size={14} />
                Export
              </DashboardSecondaryButton>
            </div>

            <div className="hidden grid-cols-[minmax(180px,1.1fr)_110px_110px_110px_110px_170px_140px_150px] bg-[#f4f6f9] lg:grid">
              {['User Details', 'Total Chats', 'Triggered', 'Flagged', 'Blocked', 'Highest Risk Score', 'Status', 'Action'].map((heading) => (
                <div key={heading} className="px-5 py-4 text-[11px] font-bold tracking-[0.08em] text-[#4b5563]">
                  {heading}
                </div>
              ))}
            </div>

            <div className="divide-y divide-[#dfe7f2]">
              {moderationRows.map((row) => (
                <div
                  key={row.userId}
                  className="grid gap-3 px-5 py-4 text-[14px] lg:grid-cols-[minmax(180px,1.1fr)_110px_110px_110px_110px_170px_140px_150px] lg:items-center lg:gap-0"
                >
                  <div>
                    <p className="text-[16px] font-bold leading-5 text-[#1f2937]">{row.name}</p>
                    <p className="mt-1 text-[12px] font-medium tracking-[0.06em] text-[#4b5563]">{row.userId}</p>
                  </div>
                  <div className="font-medium text-[#1f2937]">{row.totalChats}</div>
                  <div className="font-medium text-[#1f2937]">{row.triggered}</div>
                  <div className={row.flagged > 0 ? 'font-bold text-[#c81e1e]' : 'font-medium text-[#1f2937]'}>{row.flagged}</div>
                  <div className={row.blocked > 0 ? 'font-bold text-[#c81e1e]' : 'font-medium text-[#1f2937]'}>{row.blocked}</div>
                  <div className="font-bold text-[#4b5563]">
                    <span className={riskScoreClass(row.score)}>{row.scoreLabel.split(' / ')[0]}</span> / 100
                  </div>
                  <div>
                    <span className={`inline-flex h-7 items-center gap-2 rounded-[5px] px-3 text-[12px] font-bold ${statusClass(row.status)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </div>
                  <div>
                    <Link href={`/chat-moderation/overview/${row.userId}`} className="flex h-10 items-center justify-center gap-2 rounded-[5px] bg-[#1B3061] px-4 text-[13px] font-bold text-white">
                      View History
                      <ChevronRight size={15} strokeWidth={2.3} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <p className="text-[13px] font-medium text-[#66758b]">Showing 1 to 5 of 142 high-priority entries</p>
              <nav className="flex items-center gap-2 text-[13px] font-medium text-[#536173]" aria-label="Chat moderation pagination">
                <ChevronLeft size={15} />
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#1B3061] font-bold text-white">1</button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[5px]">2</button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[5px]">3</button>
                <span className="px-1">...</span>
                <ChevronRight size={15} />
              </nav>
            </div>
          </DashboardPanel>
        </div>
  </DashboardPageShell>
);

export default ChatModerationOverviewPage;
