'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  CalendarDays,
  ChevronDown,
  Download,
  Edit2,
  Eye,
  Gift,
  Grid2X2,
  PackageCheck,
  Plus,
  Settings2,
  Sparkles,
  Trophy,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPagination,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSecondaryButton,
  DashboardSelectButton,
  DashboardTableShell,
  cn,
  dashboardStatusBadgeClass,
} from '../components';

type MetricTone = 'blue' | 'amber' | 'green' | 'teal';
type RewardsTabKey = 'all' | 'points' | 'milestones' | 'configure';

type RewardMetric = {
  title: string;
  value: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
  note?: string;
};

type RewardType = 'Points' | 'Milestone';
type RewardStatus = 'Completed' | 'Pending' | 'Shipped' | 'Delivered';

type RewardRow = {
  user: string;
  account: string;
  initials: string;
  avatarClass: string;
  type: RewardType;
  detail: string;
  reference?: string;
  tier?: 'Gold' | 'Silver' | 'Bronze';
  points: string;
  aud: string;
  date: string;
  status: RewardStatus;
};

type TierRow = {
  range: string;
  name: 'Low' | 'Medium' | 'Standard' | 'High' | 'Very High' | 'Premium';
  points: string;
  aud: string;
};

type MilestoneTier = {
  milestone: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
};

type MilestoneClaimRow = {
  claimId: string;
  user: string;
  initials: string;
  avatarClass: string;
  milestone: 'Bronze' | 'Silver' | 'Gold';
  reward: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
};

const metricToneClasses: Record<MetricTone, { icon: string; iconWrap: string }> = {
  blue: {
    icon: 'text-[#2563eb]',
    iconWrap: 'bg-[#eef4ff]',
  },
  amber: {
    icon: 'text-[#d97706]',
    iconWrap: 'bg-[#fff7e6]',
  },
  green: {
    icon: 'text-[#10b981]',
    iconWrap: 'bg-[#ecfdf5]',
  },
  teal: {
    icon: 'text-[#059669]',
    iconWrap: 'bg-[#e8fbf2]',
  },
};

const rewardMetrics: RewardMetric[] = [
  {
    title: 'Total Rewards Claimed',
    value: '1,248',
    icon: Gift,
    tone: 'blue',
    note: '+12% mo.',
  },
  {
    title: 'Pending Fulfillment',
    value: '45',
    icon: Award,
    tone: 'amber',
  },
  {
    title: 'In Shipment',
    value: '82',
    icon: PackageCheck,
    tone: 'blue',
  },
  {
    title: 'Total Points Redeemed',
    value: '48,500 PTS',
    icon: Sparkles,
    tone: 'teal',
  },
];

const pointMetrics: RewardMetric[] = [
  {
    title: 'Total Points Earned',
    value: '8,230,500',
    icon: Sparkles,
    tone: 'green',
    note: '+12% this month',
  },
  {
    title: 'Total Points Converted',
    value: '3,100,200',
    icon: Trophy,
    tone: 'amber',
    note: '+5% this month',
  },
  {
    title: 'Total AUD Conversion',
    value: '$43,402.80',
    icon: Award,
    tone: 'blue',
    note: 'Based on $0.014 per point',
  },
];

const rewardRows: RewardRow[] = [
  {
    user: 'John Doe',
    account: 'CST-84926',
    initials: 'JD',
    avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    type: 'Points',
    detail: 'Task Completion',
    reference: '#TSK-4421',
    points: '+50',
    aud: '$0.50',
    date: 'Oct 24, 14:32',
    status: 'Completed',
  },
  {
    user: 'John Doe',
    account: 'CST-84920',
    initials: 'JD',
    avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    type: 'Milestone',
    detail: 'Premium Gear Pack',
    tier: 'Gold',
    points: '-',
    aud: '-',
    date: 'Oct 24, 2023',
    status: 'Pending',
  },
  {
    user: 'Alice Smith',
    account: 'PRV-11023',
    initials: 'AS',
    avatarClass: 'bg-[#ffedd5] text-[#ea580c]',
    type: 'Points',
    detail: 'Bonus',
    points: '+250',
    aud: '$2.50',
    date: 'Oct 24, 11:15',
    status: 'Completed',
  },
  {
    user: 'Alice Smith',
    account: 'PRV-11023',
    initials: 'AS',
    avatarClass: 'bg-[#ffedd5] text-[#ea580c]',
    type: 'Milestone',
    detail: '$50 Fuel Voucher',
    tier: 'Silver',
    points: '-',
    aud: '$50.00',
    date: 'Oct 23, 2023',
    status: 'Shipped',
  },
  {
    user: 'Michael Johnson',
    account: 'CST-99381',
    initials: 'MJ',
    avatarClass: 'bg-[#f3e8ff] text-[#9333ea]',
    type: 'Points',
    detail: 'Conversion',
    reference: '#TSK-4421',
    points: '-1000',
    aud: '-$10.00',
    date: 'Oct 23, 16:45',
    status: 'Completed',
  },
  {
    user: 'Robert Jones',
    account: 'PRV-20184',
    initials: 'RJ',
    avatarClass: 'bg-[#ccfbf1] text-[#0f766e]',
    type: 'Milestone',
    detail: 'Company T-Shirt',
    tier: 'Bronze',
    points: '-',
    aud: '-',
    date: 'Oct 21, 2023',
    status: 'Delivered',
  },
  {
    user: 'Emily Roberts',
    account: 'PRV-44821',
    initials: 'ER',
    avatarClass: 'bg-[#e0e7ff] text-[#4f46e5]',
    type: 'Points',
    detail: 'Task Completion',
    points: '+75',
    aud: '$0.75',
    date: 'Oct 23, 09:20',
    status: 'Completed',
  },
  {
    user: 'David Lee',
    account: 'CST-22194',
    initials: 'DL',
    avatarClass: 'bg-[#dcfce7] text-[#059669]',
    type: 'Points',
    detail: 'Milestone Reached',
    points: '+500',
    aud: '$5.00',
    date: 'Oct 22, 18:05',
    status: 'Completed',
  },
];

const pointsActivityRows = rewardRows.filter((row) => row.type === 'Points');

const milestoneTiers: MilestoneTier[] = [
  { milestone: 'Milestone 1', tier: 'Bronze' },
  { milestone: 'Milestone 2', tier: 'Silver' },
  { milestone: 'Milestone 3', tier: 'Gold' },
];

const milestoneClaimRows: MilestoneClaimRow[] = [
  {
    claimId: 'CLM-8824',
    user: 'John Doe',
    initials: 'JD',
    avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    milestone: 'Gold',
    reward: 'Premium Gear Pack',
    date: 'Oct 24, 2023',
    status: 'Pending',
  },
  {
    claimId: 'CLM-8825',
    user: 'Alice Smith',
    initials: 'AS',
    avatarClass: 'bg-[#e0e7ff] text-[#4f46e5]',
    milestone: 'Silver',
    reward: '$50 Fuel Voucher',
    date: 'Oct 23, 2023',
    status: 'Shipped',
  },
  {
    claimId: 'CLM-8826',
    user: 'Robert Jones',
    initials: 'RJ',
    avatarClass: 'bg-[#ccfbf1] text-[#0f766e]',
    milestone: 'Bronze',
    reward: 'Company T-Shirt',
    date: 'Oct 21, 2023',
    status: 'Delivered',
  },
];

const tierRows: TierRow[] = [
  { range: '$1 - $100', name: 'Low', points: '25 PTS', aud: '$0.35' },
  { range: '$100.01 - $500', name: 'Medium', points: '50 PTS', aud: '$0.70' },
  { range: '$500.01 - $1,000', name: 'Standard', points: '75 PTS', aud: '$1.05' },
  { range: '$1,000.01 - $3,000', name: 'High', points: '100 PTS', aud: '$1.40' },
  { range: '$3,000.01 - $6,000', name: 'Very High', points: '125 PTS', aud: '$1.75' },
  { range: '$6,000.01 - $9,999', name: 'Premium', points: '150 PTS', aud: '$2.10' },
];

const statusTone: Record<RewardStatus, 'success' | 'warning' | 'info'> = {
  Completed: 'success',
  Pending: 'warning',
  Shipped: 'info',
  Delivered: 'success',
};

const typeBadgeClass: Record<RewardType, string> = {
  Points: 'border-[#bfdbfe] bg-[#eaf2ff] text-[#2563eb]',
  Milestone: 'border-[#fde68a] bg-[#fff7e6] text-[#b45309]',
};

const tierBadgeClass = {
  Gold: 'bg-[#fef3c7] text-[#92400e]',
  Silver: 'bg-[#edf2f7] text-[#475569]',
  Bronze: 'bg-[#ffedd5] text-[#9a3412]',
};

const taskTierBadgeClass: Record<TierRow['name'], string> = {
  Low: 'bg-[#eef2f6] text-[#475569]',
  Medium: 'bg-[#eaf2ff] text-[#2563eb]',
  Standard: 'bg-[#dcfce7] text-[#047857]',
  High: 'bg-[#fff0d7] text-[#d97706]',
  'Very High': 'bg-[#f3e8ff] text-[#9333ea]',
  Premium: 'bg-[#ffe1e1] text-[#be123c]',
};

const RewardsMetricCard = ({ metric }: { metric: RewardMetric }) => {
  const tone = metricToneClasses[metric.tone];

  return (
    <DashboardMetricCard
      title={metric.title}
      value={metric.value}
      icon={metric.icon}
      iconClass={tone.icon}
      iconWrapClass={tone.iconWrap}
      className="min-h-[118px] rounded-[8px] px-4 py-4"
    >
      {metric.note ? (
        <span className="mt-2 inline-flex rounded-full bg-[#dcf7e9] px-2.5 py-1 text-[10px] font-bold text-[#10b981]">
          {metric.note}
        </span>
      ) : null}
    </DashboardMetricCard>
  );
};

const RewardsTab = ({
  active,
  icon: Icon,
  onClick,
  children,
}: {
  active?: boolean;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'relative inline-flex h-11 items-center gap-2 px-6 text-[11px] font-bold transition-colors',
      active ? 'text-[#0457cf]' : 'text-[#64748b] hover:text-[#1B3061]',
    )}
  >
    <Icon size={14} strokeWidth={2.2} />
    {children}
    {active ? (
      <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B3061]" />
    ) : null}
  </button>
);

const RewardsTabQuerySync = ({ onTabRequested }: { onTabRequested: (tab: RewardsTabKey) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const requestedTab = searchParams.get('tab');

    if (requestedTab === 'milestones' || requestedTab === 'points') {
      queueMicrotask(() => onTabRequested(requestedTab));
    }
  }, [onTabRequested, searchParams]);

  return null;
};

const RewardAvatar = ({ initials, className }: { initials: string; className: string }) => (
  <span
    className={cn(
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
      className,
    )}
  >
    {initials}
  </span>
);

const RewardDetailBadge = ({ row }: { row: RewardRow }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span
      className={cn(
        'rounded-[4px] px-2 py-1 text-[10px] font-bold',
        row.detail === 'Conversion'
          ? 'bg-[#ffe1e1] text-[#be123c]'
          : row.type === 'Points'
            ? 'bg-[#eaf6ff] text-[#0f4f7a]'
            : 'bg-transparent px-0 text-[#1f2937]',
      )}
    >
      {row.detail}
    </span>
    {row.reference ? <span className="text-[10px] font-medium text-[#94a3b8]">{row.reference}</span> : null}
    {row.tier ? (
      <span className={cn('rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold', tierBadgeClass[row.tier])}>
        {row.tier}
      </span>
    ) : null}
  </div>
);

const RewardsTableFooter = () => (
  <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f7] px-5 py-4">
    <p className="text-[12px] font-medium text-[#64748b]">Showing 1 to 5 of 12,430 entries</p>
    <DashboardPagination pages={['1', '2', '3', '...']} label="Rewards pagination" />
  </footer>
);

const AllRewardsPanel = () => (
  <DashboardTableShell className="mt-5">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf1f7] px-5 py-5">
      <div>
        <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">All Transactions & Claims</h2>
        <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
          Consolidated log of milestone achievements and points transactions.
        </p>
      </div>
      <DashboardPrimaryButton className="h-9 px-4">
        <Upload size={14} strokeWidth={2.2} />
        Export
      </DashboardPrimaryButton>
    </div>

    <div className="flex flex-wrap items-center gap-3 border-b border-[#edf1f7] px-5 py-4">
      <DashboardSearchField placeholder="Search user, task ID..." className="h-8 min-w-[320px] flex-1" />
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-[#64748b]">TYPE:</span>
        <DashboardSelectButton className="w-[140px]">
          All Types
          <ChevronDown size={14} strokeWidth={2.2} />
        </DashboardSelectButton>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-[#64748b]">STATUS:</span>
        <DashboardSelectButton className="w-[210px]">
          All Statuses
          <ChevronDown size={14} strokeWidth={2.2} />
        </DashboardSelectButton>
      </div>
      <DashboardSelectButton className="w-[190px]">
        Select range...
        <CalendarDays size={14} strokeWidth={2.2} className="text-[#94a3b8]" />
      </DashboardSelectButton>
    </div>

    <div className="overflow-x-auto">
      <table className="ui-table min-w-[1160px] table-fixed">
        <thead>
          <tr className="ui-table-head h-[44px] text-left">
            <th className="w-[18%] px-8 text-[10px]">USER</th>
            <th className="w-[11%] px-4 text-[10px]">TYPE</th>
            <th className="w-[28%] px-4 text-[10px]">DETAILS / REFERENCE</th>
            <th className="w-[11%] px-4 text-center text-[10px]">PTS / VALUE</th>
            <th className="w-[10%] px-4 text-center text-[10px]">AUD EQUIV</th>
            <th className="w-[12%] px-4 text-[10px]">DATE</th>
            <th className="w-[10%] px-4 text-[10px]">STATUS</th>
            <th className="w-[8%] px-6 text-right text-[10px]">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rewardRows.map((row, index) => {
            const isNegative = row.points.startsWith('-');

            return (
              <tr key={`${row.user}-${row.detail}-${index}`} className="ui-table-row h-[70px]">
                <td className="px-8">
                  <div className="flex items-center gap-3">
                    <RewardAvatar initials={row.initials} className={row.avatarClass} />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold leading-4 text-[#1f2937]">{row.user}</p>
                      <p className="mt-0.5 truncate text-[10px] font-medium leading-3 text-[#94a3b8]">
                        {row.account}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold',
                      typeBadgeClass[row.type],
                    )}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-4">
                  <RewardDetailBadge row={row} />
                </td>
                <td
                  className={cn(
                    'px-4 text-center text-[12px] font-bold',
                    row.points === '-'
                      ? 'text-[#64748b]'
                      : isNegative
                        ? 'text-[#f43f5e]'
                        : 'text-[#059669]',
                  )}
                >
                  {row.points}
                </td>
                <td
                  className={cn(
                    'px-4 text-center text-[12px] font-semibold',
                    row.aud.startsWith('-$') ? 'text-[#f43f5e]' : 'text-[#334155]',
                  )}
                >
                  {row.aud}
                </td>
                <td className="px-4 text-[12px] font-medium text-[#52627a]">{row.date}</td>
                <td className="px-4">
                  <span className={dashboardStatusBadgeClass(statusTone[row.status])}>{row.status}</span>
                </td>
                <td className="px-6">
                  <button
                    type="button"
                    aria-label={`View reward transaction ${index + 1}`}
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-[#eef2ff] hover:text-[#1B3061]"
                  >
                    <Eye size={14} strokeWidth={2.1} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <RewardsTableFooter />
  </DashboardTableShell>
);

const PointsActivityPanel = () => (
  <DashboardTableShell className="mt-5">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf1f7] px-5 py-4">
      <h2 className="text-[14px] font-bold leading-5 text-[#202b3d]">Points Activity</h2>
      <DashboardPrimaryButton className="h-9 px-4">
        <Upload size={14} strokeWidth={2.2} />
        Export
      </DashboardPrimaryButton>
    </div>

    <div className="flex flex-wrap items-center gap-3 border-b border-[#edf1f7] px-5 py-4">
      <DashboardSearchField placeholder="Search users..." className="h-9 min-w-[320px] flex-1" />
      <DashboardSelectButton className="h-9 w-[180px]">
        Activity Type: All
        <ChevronDown size={14} strokeWidth={2.2} />
      </DashboardSelectButton>
      <DashboardSelectButton className="h-9 w-[150px]">
        mm/dd/yyyy
        <CalendarDays size={14} strokeWidth={2.2} className="text-[#94a3b8]" />
      </DashboardSelectButton>
    </div>

    <div className="overflow-x-auto">
      <table className="ui-table min-w-[980px] table-fixed">
        <thead>
          <tr className="ui-table-head h-[44px] text-left">
            <th className="w-[22%] px-8 text-[10px]">USER NAME</th>
            <th className="w-[16%] px-4 text-[10px]">USER ID</th>
            <th className="w-[18%] px-4 text-[10px]">ACTIVITY TYPE</th>
            <th className="w-[14%] px-4 text-[10px]">TASK ID</th>
            <th className="w-[10%] px-4 text-center text-[10px]">POINTS</th>
            <th className="w-[10%] px-4 text-center text-[10px]">AUD EQV.</th>
            <th className="w-[14%] px-4 text-[10px]">TIMESTAMP</th>
          </tr>
        </thead>
        <tbody>
          {pointsActivityRows.map((row) => {
            const isNegative = row.points.startsWith('-');

            return (
              <tr key={`${row.account}-${row.detail}`} className="ui-table-row h-[62px]">
                <td className="px-8">
                  <div className="flex items-center gap-3">
                    <RewardAvatar initials={row.initials} className={row.avatarClass} />
                    <span className="truncate text-[12px] font-semibold text-[#1f2937]">{row.user}</span>
                  </div>
                </td>
                <td className="px-4 text-[12px] font-semibold text-[#64748b]">{row.account}</td>
                <td className="px-4">
                  <RewardDetailBadge row={row} />
                </td>
                <td className="px-4 text-[12px] font-medium text-[#94a3b8]">{row.reference ?? '-'}</td>
                <td className={cn('px-4 text-center text-[12px] font-bold', isNegative ? 'text-[#f43f5e]' : 'text-[#059669]')}>
                  {row.points}
                </td>
                <td className={cn('px-4 text-center text-[12px] font-semibold', row.aud.startsWith('-$') ? 'text-[#f43f5e]' : 'text-[#64748b]')}>
                  {row.aud}
                </td>
                <td className="px-4 text-[12px] font-medium text-[#52627a]">{row.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <RewardsTableFooter />
  </DashboardTableShell>
);

const MilestonesPanel = ({ onOpenAddTier }: { onOpenAddTier: () => void }) => (
  <section className="mt-5 grid grid-cols-[minmax(280px,0.95fr)_minmax(520px,2fr)] gap-6 max-xl:grid-cols-1">
    <DashboardPanel className="rounded-[8px]">
      <div className="flex items-start justify-between gap-4 px-5 py-5">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">Milestone Tiers</h2>
          <p className="mt-1 max-w-[300px] text-[12px] font-medium leading-5 text-[#64748b]">
            Define rules and rewards for achievement levels.
          </p>
        </div>
        <DashboardPrimaryButton
          aria-label="Open add task tier modal"
          onClick={onOpenAddTier}
          className="h-10 shrink-0 px-4"
        >
          <Plus size={15} strokeWidth={2.4} />
          Add Tier
        </DashboardPrimaryButton>
      </div>

      <table className="ui-table w-full table-fixed">
        <thead>
          <tr className="ui-table-head h-[46px] text-left">
            <th className="w-[52%] px-5 text-[11px]">MILESTONE</th>
            <th className="w-[30%] px-4 text-[11px]">STATUS</th>
            <th className="w-[18%] px-5 text-right text-[11px]">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {milestoneTiers.map((tier) => (
            <tr key={tier.milestone} className="ui-table-row h-[72px]">
              <td className="px-5 text-[13px] font-semibold text-[#172033]">{tier.milestone}</td>
              <td className="px-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border',
                      tier.tier === 'Gold'
                        ? 'border-[#facc15] bg-[#fef9c3] text-[#d97706]'
                        : tier.tier === 'Silver'
                          ? 'border-[#cbd5e1] bg-[#f8fafc] text-[#64748b]'
                          : 'border-[#fdba74] bg-[#ffedd5] text-[#ea580c]',
                    )}
                  >
                    <Award size={16} strokeWidth={2.1} />
                  </span>
                  <span className="text-[13px] font-medium text-[#172033]">{tier.tier}</span>
                </div>
              </td>
              <td className="px-5">
                <button
                  type="button"
                  aria-label={`Edit ${tier.milestone}`}
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-[#eef2ff] hover:text-[#2563eb]"
                >
                  <Edit2 size={15} strokeWidth={2.1} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardPanel>

    <DashboardPanel className="rounded-[8px]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#edf1f7] px-5 py-5">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">Recent Claims</h2>
          <p className="mt-1 text-[12px] font-medium leading-5 text-[#64748b]">
            Latest reward redemptions requiring fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12px] font-bold text-[#334155]">
          <button type="button" className="inline-flex h-8 items-center gap-2 rounded-[5px] px-2 transition-colors hover:bg-[#f4f7fb]">
            <ChevronDown size={14} strokeWidth={2.2} className="rotate-90 text-[#64748b]" />
            Filter
          </button>
          <button type="button" className="h-8 rounded-[5px] px-2 text-[#1B3061] transition-colors hover:bg-[#eef4ff]">
            View All
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-[#edf1f7] px-5 py-4">
        <DashboardSearchField placeholder="Search User..." className="h-9 min-w-[240px] flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#64748b]">STATUS:</span>
          <DashboardSelectButton className="h-9 w-[110px]">
            All
            <ChevronDown size={14} strokeWidth={2.2} />
          </DashboardSelectButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#64748b]">MILESTONE:</span>
          <DashboardSelectButton className="h-9 w-[110px]">
            All
            <ChevronDown size={14} strokeWidth={2.2} />
          </DashboardSelectButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#64748b]">DATE RANGE:</span>
          <DashboardSelectButton className="h-9 w-[150px]">
            Select range...
            <CalendarDays size={14} strokeWidth={2.2} className="text-[#94a3b8]" />
          </DashboardSelectButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="ui-table min-w-[760px] table-fixed">
          <thead>
            <tr className="ui-table-head h-[46px] text-left">
              <th className="w-[28%] px-8 text-[11px]">USER</th>
              <th className="w-[16%] px-4 text-[11px]">MILESTONE</th>
              <th className="w-[20%] px-4 text-[11px]">REWARD</th>
              <th className="w-[16%] px-4 text-[11px]">CLAIM DATE</th>
              <th className="w-[12%] px-4 text-[11px]">STATUS</th>
              <th className="w-[8%] px-6 text-right text-[11px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {milestoneClaimRows.map((row, index) => (
              <tr key={`${row.user}-${row.reward}`} className="ui-table-row h-[70px]">
                <td className="px-8">
                  <div className="flex items-center gap-3">
                    <RewardAvatar initials={row.initials} className={row.avatarClass} />
                    <span className="truncate text-[12px] font-semibold text-[#1f2937]">{row.user}</span>
                  </div>
                </td>
                <td className="px-4">
                  <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-bold', tierBadgeClass[row.milestone])}>
                    {row.milestone}
                  </span>
                </td>
                <td className="px-4 text-[12px] font-medium leading-4 text-[#334155]">{row.reward}</td>
                <td className="px-4 text-[12px] font-medium leading-4 text-[#52627a]">{row.date}</td>
                <td className="px-4">
                  <span className={dashboardStatusBadgeClass(statusTone[row.status])}>{row.status}</span>
                </td>
                <td className="px-6">
                <Link
                  href={`/rewards-platform/claims/${row.claimId}`}
                  aria-label={`View milestone claim ${index + 1}`}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-[#eef2ff] hover:text-[#2563eb]"
                >
                  <Eye size={14} strokeWidth={2.1} />
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  </section>
);

const TierInput = ({ label, value, className }: { label: string; value: string; className?: string }) => (
  <label className={cn('block min-w-0', className)}>
    <span className="text-[10px] font-bold uppercase leading-3 text-[#334155]">{label}</span>
    <input
      type="text"
      readOnly
      value={value}
      className="mt-2 h-10 w-full rounded-[5px] border border-[#cbd5e1] bg-white px-3 text-[12px] font-medium text-[#1f2937] outline-none"
    />
  </label>
);

const AddTierModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tier-title"
      className="w-full max-w-[520px] overflow-hidden rounded-[8px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#e4eaf2] px-5 py-4">
        <div>
          <h2 id="add-tier-title" className="text-[17px] font-bold leading-6 text-[#172033]">
            Add New Milestone Tier
          </h2>
          <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
            Configure requirements and rewards for user achievement.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close add task tier modal"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#99a5b8] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={17} strokeWidth={2.4} />
        </button>
      </header>

      <div className="space-y-5 px-5 py-4">
        <section>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">TIER DETAILS</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-[11px] font-semibold text-[#334155]">
                Tier Name <span className="text-[#ef4444]">*</span>
              </span>
              <input
                type="text"
                placeholder="e.g. Gold Member, Task Master"
                className="mt-1 h-9 w-full rounded-[3px] border border-[#dbe4ef] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-semibold text-[#334155]">
                  Reward Name <span className="text-[#ef4444]">*</span>
                </span>
                <input
                  type="text"
                  placeholder="Type the reward name..."
                  className="mt-1 h-9 w-full rounded-[3px] border border-[#dbe4ef] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-[#334155]">
                  Task Completed <span className="text-[#ef4444]">*</span>
                </span>
                <input
                  type="text"
                  placeholder="e.g. 100"
                  className="mt-1 h-9 w-full rounded-[3px] border border-[#dbe4ef] bg-white px-3 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="border-t border-[#edf1f7] pt-4">
          <h3 className="mb-3 text-[11px] font-semibold text-[#334155]">Tier Icon</h3>
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px] border border-dashed border-[#ccd8e8] bg-[#eef4ff] text-[#8aa0bd]">
              <Upload size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-4 text-[#334155]">Upload custom icon</p>
              <p className="mt-1 text-[10px] font-medium leading-4 text-[#64748b]">
                SVG, PNG, or JPG. Max 2MB. Recommended 128x128px.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex h-7 items-center gap-2 rounded-[4px] border border-[#d8e2ef] bg-white px-3 text-[11px] font-semibold text-[#475569] transition-colors hover:bg-[#f8fafc]"
              >
                <Upload size={12} strokeWidth={2.2} />
                Browse
              </button>
            </div>
          </div>
        </section>

        <section className="border-t border-[#edf1f7] pt-4">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">SETTINGS</h3>
          <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#dbe4ef] bg-white px-4 py-3">
            <div>
              <p className="text-[12px] font-bold text-[#172033]">Tier Status</p>
              <p className="mt-1 text-[11px] font-medium text-[#64748b]">
                Set to inactive to hide this tier from users.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Tier status active"
                aria-pressed="true"
                className="relative h-6 w-11 rounded-full bg-[#10b981] transition-colors"
              >
                <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
              </button>
              <span className="text-[11px] font-semibold text-[#10b981]">Active</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e4eaf2] bg-[#f6f8fb] px-5 py-3">
        <p className="text-[10px] font-medium text-[#8a98ad]">Last Activated Date: Oct 24, 2024, 02:45 PM</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-[5px] border border-[#d5dfec] bg-white px-4 text-[11px] font-semibold text-[#334155] transition-colors hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-[5px] bg-[#0457cf] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#0347a8]"
          >
            <Plus size={13} strokeWidth={2.4} />
            Create Tier
          </button>
        </div>
      </footer>
    </section>
  </div>
);

const RewardsConfigurationPanel = ({ onOpenAddTier }: { onOpenAddTier: () => void }) => (
  <div className="mt-5 space-y-6">
    <DashboardPanel className="rounded-[8px] px-5 py-5">
      <header className="border-b border-[#edf1f7] pb-4">
        <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">Points & Tier Configuration</h2>
        <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
          Define base exchange conversion rate and manage Task Value reward tier rules.
        </p>
      </header>

      <div className="pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[11px] font-bold uppercase leading-4 text-[#111827]">
            ADD / EDIT TASK TIER PARAMETERS
          </h3>
          <p className="text-[10px] font-medium text-[#94a3b8]">
            Tier reward points will recalculate estimated AUD value
          </p>
        </div>

        <div className="grid grid-cols-[1.1fr_1.1fr_0.7fr_0.7fr_auto] items-end gap-3 max-xl:grid-cols-2">
          <TierInput label="TASK VALUE RANGE ($ AUD)" value="$1,000.01 - $3,000" />
          <TierInput label="TIER NAME" value="High" />
          <TierInput label="POINTS (PTS)" value="100" />
          <TierInput label="AUD VALUE ($)" value="$1.40" />
          <DashboardPrimaryButton
            aria-label="Open add task tier modal"
            onClick={onOpenAddTier}
            className="h-10 min-w-[168px] px-5"
          >
            <Plus size={16} strokeWidth={2.4} />
            Add Tier
          </DashboardPrimaryButton>
        </div>
      </div>
    </DashboardPanel>

    <DashboardPanel className="rounded-[8px]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf1f7] px-5 py-5">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">Task Value Tiers & Points</h2>
          <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
            Calculated reward points distribution matrix based on standard task budget. Configure or modify tiers below.
          </p>
        </div>
        <DashboardSecondaryButton className="h-8 px-3">
          <Download size={13} strokeWidth={2.2} />
          Export CSV
        </DashboardSecondaryButton>
      </div>

      <div className="overflow-x-auto">
        <table className="ui-table min-w-[920px] table-fixed">
          <thead>
            <tr className="ui-table-head h-[46px] text-left">
              <th className="w-[28%] px-8 text-[11px]">Task Value Range</th>
              <th className="w-[20%] px-4 text-[11px]">Tier Name</th>
              <th className="w-[18%] px-4 text-center text-[11px]">Points Awarded</th>
              <th className="w-[18%] px-4 text-center text-[11px]">AUD Value</th>
              <th className="w-[16%] px-8 text-right text-[11px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tierRows.map((tier) => (
              <tr key={tier.name} className="ui-table-row h-[58px]">
                <td className="px-8 text-[12px] font-bold text-[#1f2937]">{tier.range}</td>
                <td className="px-4">
                  <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', taskTierBadgeClass[tier.name])}>
                    {tier.name}
                  </span>
                </td>
                <td className="px-4 text-center text-[12px] font-bold text-[#2563eb]">{tier.points}</td>
                <td className="px-4 text-center text-[12px] font-semibold text-[#334155]">{tier.aud}</td>
                <td className="px-8">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      aria-label={`Edit ${tier.name} tier`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#2563eb] transition-colors hover:bg-[#eef2ff]"
                    >
                      <Edit2 size={13} strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${tier.name} tier`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#ef4444] transition-colors hover:bg-[#fff0f0]"
                    >
                      <Trash2 size={13} strokeWidth={2.2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  </div>
);

export default function RewardsPlatformPage() {
  const [activeTab, setActiveTab] = useState<RewardsTabKey>(() => {
    if (typeof window === 'undefined') {
      return 'all';
    }

    const requestedTab = new URLSearchParams(window.location.search).get('tab');

    if (requestedTab === 'milestones' || requestedTab === 'points') {
      return requestedTab;
    }

    return 'all';
  });
  const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false);

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');

    if (requestedTab === 'milestones' || requestedTab === 'points') {
      queueMicrotask(() => setActiveTab(requestedTab));
    }
  }, []);

  const activeMetrics =
    activeTab === 'points' ? pointMetrics : activeTab === 'milestones' ? rewardMetrics.slice(0, 3) : rewardMetrics;

  return (
    <DashboardPageShell contentClassName="px-0 pb-10 pt-0">
      <Suspense fallback={null}>
        <RewardsTabQuerySync onTabRequested={setActiveTab} />
      </Suspense>
      <div className="animate-dashboard-entry">
        <DashboardPageHeader
          title="Rewards Platform"
          description="Manage loyalty points, milestones, and user rewards programmatically."
          className="border-b border-[#dfe6f0] pb-4 pt-4"
          action={
            <DashboardSecondaryButton
              aria-label="Configure rewards platform"
              onClick={() => setActiveTab('configure')}
              className="h-9 border-[#0457cf] px-3 text-[13px] text-[#0457cf] hover:bg-[#eef4ff]"
            >
              <Settings2 size={16} strokeWidth={2.2} />
              Configure
            </DashboardSecondaryButton>
          }
        />

        <nav className="flex border-b border-[#dfe6f0]" aria-label="Rewards sections">
          <RewardsTab active={activeTab === 'all'} icon={Grid2X2} onClick={() => setActiveTab('all')}>
            All
          </RewardsTab>
          <RewardsTab
            active={activeTab === 'points' || activeTab === 'configure'}
            icon={Trophy}
            onClick={() => setActiveTab('points')}
          >
            Points Configuration
          </RewardsTab>
          <RewardsTab
            active={activeTab === 'milestones'}
            icon={Award}
            onClick={() => setActiveTab('milestones')}
          >
            Milestones
          </RewardsTab>
        </nav>

        {activeTab === 'configure' ? (
          <RewardsConfigurationPanel onOpenAddTier={() => setIsAddTierModalOpen(true)} />
        ) : (
          <>
            <section aria-label="Rewards metrics" className="mt-5 grid grid-cols-4 gap-6 max-xl:grid-cols-2">
              {activeMetrics.map((metric) => (
                <RewardsMetricCard key={metric.title} metric={metric} />
              ))}
            </section>

            {activeTab === 'points' ? (
              <PointsActivityPanel />
            ) : activeTab === 'milestones' ? (
              <MilestonesPanel onOpenAddTier={() => setIsAddTierModalOpen(true)} />
            ) : (
              <AllRewardsPanel />
            )}
          </>
        )}

        {isAddTierModalOpen ? (
          <AddTierModal onClose={() => setIsAddTierModalOpen(false)} />
        ) : null}
      </div>
    </DashboardPageShell>
  );
}
