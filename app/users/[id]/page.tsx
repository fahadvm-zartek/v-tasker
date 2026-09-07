'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  Eye,
  FileCheck2,
  Gauge,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  UserRound,
} from 'lucide-react';
import { Header, Sidebar } from '../../components';

type DetailRow = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: string;
};

type OverviewMetric = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
};

type InfoItemData = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: string;
  tone?: 'default' | 'positive';
};

type TaskHistoryRow = {
  id: string;
  date: string;
  service: string;
  doer: string;
  doerInitials: string;
  status: 'Completed' | 'Assigned' | 'Posted' | 'Canceled';
  amount: string;
  reward?: string;
};

type TaskDoerRow = {
  id: string;
  date: string;
  service: string;
  taskPoster: string;
  status: TaskHistoryRow['status'];
  amount: string;
  milestone: string;
  action?: string;
};

type PaymentHistoryRow = {
  date: string;
  taskId: string;
  taskName: string;
  taskPoster: string;
  taskProvider: string;
  amount: string;
  cancellationFee: string;
  status: 'Paid' | 'In Review' | 'Credited' | 'Canceled';
};

type OutgoingPaymentRow = {
  date: string;
  taskName: string;
  taskDoer: string;
  amount: string;
  status: 'Paid' | 'In Review';
};

type EarnedPaymentRow = {
  date: string;
  taskName: string;
  taskPoster: string;
  amount: string;
  status: 'Credited';
};

type CancellationFeeRow = {
  date: string;
  taskId: string;
  taskName: string;
  taskDoer: string;
  feeAmount: string;
  status: 'Pending' | 'Paid' | 'Waived';
};

type RewardPointRow = {
  taskId: string;
  date: string;
  activity: 'AUD Conversion' | 'Review Completed' | 'Milestone Bonus';
  taskType: 'Withdrawal' | 'Standard Task' | 'High Value Task' | 'Bonus';
  points: string;
  audEquiv: string;
};

type RewardCatalogItem = {
  milestone: string;
  title: string;
  state: 'claimed' | 'current' | 'locked';
  shipping?: string;
};

type ReportMetricCard = {
  title: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  valueClass: string;
  helperClass: string;
};

type RecentComplaintRow = {
  id: string;
  category: string;
  severity: 'Critical' | 'High';
  dateFiled: string;
  assignedTo: string;
  status: 'Pending' | 'Under Investigation';
};

const identityInfoItems: InfoItemData[] = [
  { icon: UserRound, label: 'Name', value: 'S.Mitchell' },
  { icon: CalendarPlus, label: 'Joining Date', value: 'Jan 12, 2024' },
  { icon: BadgeCheck, label: 'Member ID', value: 'CST-9824' },
  { icon: BriefcaseBusiness, label: 'Role', value: 'Both' },
  { icon: Award, label: 'Milestone', value: 'Silver' },
  { icon: CheckCircle2, label: 'Status', value: 'Verified • Active', tone: 'positive' },
  { icon: Clock3, label: 'Interaction Date', value: 'Dec 01, 2024' },
  { icon: CalendarDays, label: 'Student Verification Expiry', value: 'Oct 24, 2026' },
];

const overviewMetrics: OverviewMetric[] = [
  {
    title: 'Completed Tasks',
    value: '42',
    icon: CheckCircle2,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
  },
  {
    title: 'Total Earned',
    value: '$3,240.50',
    icon: CreditCard,
    iconClass: 'text-[#059669]',
    iconWrapClass: 'bg-[#dcfaee]',
  },
  {
    title: 'No. of Reports',
    value: '12',
    icon: AlertTriangle,
    iconClass: 'text-[#b91c1c]',
    iconWrapClass: 'bg-[#fef2f2]',
  },
  {
    title: 'Total Tasks Posted',
    value: '24',
    icon: ClipboardList,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
  },
  {
    title: 'Total Spent',
    value: '$1,240.00',
    icon: FileCheck2,
    iconClass: 'text-[#7c3aed]',
    iconWrapClass: 'bg-[#f0e4ff]',
  },
  {
    title: 'No. of Disputes',
    value: '5',
    icon: AlertTriangle,
    iconClass: 'text-[#b91c1c]',
    iconWrapClass: 'bg-[#fef2f2]',
  },
  {
    title: 'Cancellation Rate',
    value: '2.4%',
    icon: Gauge,
    iconClass: 'text-[#d97706]',
    iconWrapClass: 'bg-[#fff0d8]',
  },
];

const tabs = [
  'Account Details',
  'Task History',
  'Payment History',
  'Rewards History',
  'Reports',
  'Disputes',
];

const taskStatusFilterOptions = ['All', 'Assigned', 'Done', 'Pending', 'Cancelled', 'Unpaid', 'Expired', 'Dispute'];
const dateCreatedFilterOptions = ['Today', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

const taskHistoryRows: TaskHistoryRow[] = [
  {
    id: '#TSK-4412',
    date: '24 Oct 2024',
    service: 'Regular Cleaning',
    doer: 'Alexander Sterling',
    doerInitials: 'AS',
    status: 'Completed',
    amount: '$150.00',
    reward: '+100 pts',
  },
  {
    id: '#TSK-4415',
    date: '26 Oct 2024',
    service: 'Garden Maintenance',
    doer: 'Maria Rodriguez',
    doerInitials: 'MR',
    status: 'Assigned',
    amount: '$85.00',
    reward: '+50 pts',
  },
  {
    id: '#TSK-4428',
    date: '30 Oct 2024',
    service: 'Deep Cleaning',
    doer: 'Unassigned',
    doerInitials: '--',
    status: 'Posted',
    amount: '$320.00',
    reward: '+150 pts',
  },
  {
    id: '#TSK-4390',
    date: '15 Oct 2024',
    service: 'Window Washing',
    doer: 'James Chen',
    doerInitials: 'JC',
    status: 'Canceled',
    amount: '$0.00',
  },
  {
    id: '#TSK-4355',
    date: '02 Oct 2024',
    service: 'Regular Cleaning',
    doer: 'Alexander Sterling',
    doerInitials: 'AS',
    status: 'Completed',
    amount: '$150.00',
    reward: '+150 pts',
  },
];

const taskDoerRows: TaskDoerRow[] = [
  {
    id: '#TSK-8921',
    date: 'Oct 24, 2023',
    service: 'Premium Site Inspection',
    taskPoster: 'Sarah Jenkins',
    status: 'Completed',
    amount: '$145.00',
    milestone: 'Milestone2 / Task16',
    action: 'View Receipt',
  },
  {
    id: '#TSK-8925',
    date: 'Oct 25, 2023',
    service: 'Emergency Repair Routing',
    taskPoster: 'Marcus Thorne',
    status: 'Assigned',
    amount: '$210.00',
    milestone: 'Milestone2 / Task 15',
  },
  {
    id: '#TSK-8890',
    date: 'Oct 22, 2023',
    service: 'Standard Installation',
    taskPoster: 'TechNova Inc.',
    status: 'Completed',
    amount: '$85.50',
    milestone: 'Milestone1 / Task14',
    action: 'View Receipt',
  },
];

const paymentHistoryRows: PaymentHistoryRow[] = [
  {
    date: '24 Oct 2024',
    taskId: '-',
    taskName: 'House Cleaning',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Chidi A.',
    amount: '$150.00',
    cancellationFee: '-',
    status: 'Paid',
  },
  {
    date: '18 Oct 2024',
    taskId: '-',
    taskName: 'Plumbing Repair',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Marcus T.',
    amount: '$85.50',
    cancellationFee: '-',
    status: 'In Review',
  },
  {
    date: '15 Sep 2024',
    taskId: '-',
    taskName: 'Deep Cleaning',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Elena R.',
    amount: '$220.00',
    cancellationFee: '-',
    status: 'Paid',
  },
  {
    date: '24 Oct 2024',
    taskId: '-',
    taskName: 'House Cleaning',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Maria R.',
    amount: '$150.00',
    cancellationFee: '-',
    status: 'Credited',
  },
  {
    date: '05 Oct 2024',
    taskId: '-',
    taskName: 'End of lease cleaning',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Alexander Sterling',
    amount: '$450.00',
    cancellationFee: '-',
    status: 'Credited',
  },
  {
    date: '26 Oct 2024',
    taskId: '#TSK-4492',
    taskName: 'Window Cleaning',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Alexander Sterling',
    amount: '-',
    cancellationFee: '$12.50',
    status: 'Canceled',
  },
  {
    date: '22 Oct 2024',
    taskId: '#TSK-4481',
    taskName: 'Lawn Mowing',
    taskPoster: 'Sarah Mitchell',
    taskProvider: 'Alexander Sterling',
    amount: '-',
    cancellationFee: '$11.42',
    status: 'Canceled',
  },
];

const outgoingPaymentRows: OutgoingPaymentRow[] = [
  { date: '24 Oct 2024', taskName: 'House Cleaning', taskDoer: 'Chidi A.', amount: '$150.00', status: 'Paid' },
  { date: '18 Oct 2024', taskName: 'Plumbing Repair', taskDoer: 'Marcus T.', amount: '$85.50', status: 'In Review' },
  { date: '02 Oct 2024', taskName: 'Lawn Mowing', taskDoer: 'David L.', amount: '$45.00', status: 'Paid' },
  { date: '15 Sep 2024', taskName: 'Deep Cleaning', taskDoer: 'Elena R.', amount: '$220.00', status: 'Paid' },
];

const earnedPaymentRows: EarnedPaymentRow[] = [
  { date: '24 Oct 2024', taskName: 'House Cleaning', taskPoster: 'Elena Rodriguez', amount: '$150.00', status: 'Credited' },
  { date: '19 Oct 2024', taskName: 'Deep Cleaning', taskPoster: 'Marcus Thorne', amount: '$220.00', status: 'Credited' },
  { date: '12 Oct 2024', taskName: 'Gardening', taskPoster: 'Maria Rivera', amount: '$85.50', status: 'Credited' },
  { date: '05 Oct 2024', taskName: 'End of lease cleaning', taskPoster: 'David Lawson', amount: '$450.00', status: 'Credited' },
];

const cancellationFeeRows: CancellationFeeRow[] = [
  { date: '26 Oct 2024', taskId: '#TSK-4492', taskName: 'Window Cleaning', taskDoer: 'Elena Rodriguez', feeAmount: '$12.50', status: 'Pending' },
  { date: '22 Oct 2024', taskId: '#TSK-4481', taskName: 'Lawn Mowing', taskDoer: 'Marcus Thorne', feeAmount: '$11.42', status: 'Paid' },
  { date: '15 Oct 2024', taskId: '#TSK-4450', taskName: 'Car Wash', taskDoer: 'Maria Rivera', feeAmount: '$15.00', status: 'Waived' },
];

const rewardPointRows: RewardPointRow[] = [
  {
    taskId: '-',
    date: 'Nov 10, 2024 · 2:15 PM',
    activity: 'AUD Conversion',
    taskType: 'Withdrawal',
    points: '-1,500 pts',
    audEquiv: '$21.00 AUD paid',
  },
  {
    taskId: '#TSK-8902',
    date: 'Oct 24, 2024 · 11:40 AM',
    activity: 'Review Completed',
    taskType: 'Standard Task',
    points: '+50 pts',
    audEquiv: '+$0.70 AUD',
  },
  {
    taskId: '#TSK-8841',
    date: 'Oct 12, 2024 · 3:20 PM',
    activity: 'Review Completed',
    taskType: 'High Value Task',
    points: '+150 pts',
    audEquiv: '+$2.10 AUD',
  },
  {
    taskId: '#TSK-8715',
    date: 'Sep 28, 2024',
    activity: 'Review Completed',
    taskType: 'Standard Task',
    points: '+50 pts',
    audEquiv: '+$0.70 AUD',
  },
  {
    taskId: '#TSK-8600',
    date: 'Sep 15, 2024',
    activity: 'Milestone Bonus',
    taskType: 'Bonus',
    points: '+200 pts',
    audEquiv: '+$2.80 AUD',
  },
  {
    taskId: '-',
    date: 'Sep 01, 2024',
    activity: 'AUD Conversion',
    taskType: 'Withdrawal',
    points: '-1,500 pts',
    audEquiv: '$21.00 AUD paid',
  },
  {
    taskId: '#TSK-8512',
    date: 'Aug 22, 2024',
    activity: 'Review Completed',
    taskType: 'Standard Task',
    points: '+25 pts',
    audEquiv: '+$0.35 AUD',
  },
];

const rewardCatalogItems: RewardCatalogItem[] = [
  {
    milestone: '20 Tasks',
    title: 'Starter Gear Pack',
    state: 'claimed',
    shipping: 'Shipped to: 1248 Oak Creek Dr...',
  },
  {
    milestone: '50 Tasks',
    title: 'Pro Tools Kit',
    state: 'claimed',
    shipping: 'Shipped to: 1248 Oak Creek Dr...',
  },
  {
    milestone: '100 Tasks',
    title: 'Silver Tasker Status + Fuel Voucher',
    state: 'current',
  },
  {
    milestone: '200 Tasks',
    title: 'Elite Performance Reward',
    state: 'locked',
  },
];

const reportMetricCards: ReportMetricCard[] = [
  {
    title: 'Total Complaints',
    value: '2',
    helper: '+2% vs last month',
    icon: FileCheck2,
    valueClass: 'text-[#1B3061]',
    helperClass: 'text-[#dc2626]',
  },
  {
    title: 'Avg. Resolution Time',
    value: '4.2h',
    helper: '-12% improvement',
    icon: Clock3,
    valueClass: 'text-[#a855f7]',
    helperClass: 'text-[#0f9f68]',
  },
  {
    title: 'Critical Issues',
    value: '1',
    helper: 'High priority',
    icon: AlertTriangle,
    valueClass: 'text-[#dc2626]',
    helperClass: 'text-[#dc2626]',
  },
  {
    title: 'Satisfaction Score',
    value: '4.8/5',
    helper: '+2%',
    icon: CheckCircle2,
    valueClass: 'text-[#0f9f68]',
    helperClass: 'text-[#0f9f68]',
  },
];

const recentComplaintRows: RecentComplaintRow[] = [
  {
    id: '#CMP-1042',
    category: 'App Issues',
    severity: 'Critical',
    dateFiled: 'Jun 28, 2025',
    assignedTo: 'Sarah Jenkins',
    status: 'Pending',
  },
  {
    id: '#CMP-1041',
    category: 'Payment',
    severity: 'High',
    dateFiled: 'Jun 27, 2025',
    assignedTo: 'Mike Davis',
    status: 'Under Investigation',
  },
];

const contactRows: DetailRow[] = [
  { icon: Mail, label: 'Email Address', value: 'sarah.m@example.com' },
  { icon: Phone, label: 'Phone Number', value: '+61 412 345 678' },
  { icon: MapPin, label: 'Location', value: 'Alexandria, New South Wales' },
  { icon: UserRound, label: 'Preferred Language', value: 'English' },
];

const verificationItems = [
  { label: 'ID Verified', status: 'Approved on Feb 12, 2024' },
  { label: 'Background Check', status: 'Passed on Mar 03, 2024' },
  { label: 'License Verified', status: 'ABN and trade license' },
];

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-[8px] border border-[#dfe7f2] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ title, action }: { title: string; action?: string }) => (
  <div className="flex items-center justify-between gap-3 border-b border-[#edf1f7] px-4 py-3">
    <h2 className="text-[13px] font-bold leading-5 text-[#1f2a3d]">{title}</h2>
    {action ? <a href="#" className="text-[11px] font-semibold text-[#1B3061]">{action}</a> : null}
  </div>
);

const StatusChip = ({
  children,
  tone = 'green',
}: {
  children: React.ReactNode;
  tone?: 'green' | 'red' | 'slate';
}) => {
  const styles = {
    green: 'border-[#bbf7d0] bg-[#dcfce7] text-[#15803d]',
    red: 'border-[#fecaca] bg-[#fee2e2] text-[#dc2626]',
    slate: 'border-[#d8e1ee] bg-[#f3f6fb] text-[#475569]',
  };

  return (
    <span className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
};

const InfoItem = ({ icon: Icon, label, value, tone = 'default' }: InfoItemData) => {
  const isPositive = tone === 'positive';

  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon
        size={15}
        strokeWidth={1.9}
        className={`mt-[2px] shrink-0 ${isPositive ? 'text-[#0f8a4b]' : 'text-[#69778a]'}`}
      />
      <p className="min-w-0 text-[13px] leading-5">
        <span className="font-medium text-[#64748b]">{label}</span>
        <span className="px-1 text-[#9aa6b5]">:</span>
        {isPositive ? (
          <span className="inline-flex flex-wrap items-center gap-1 font-semibold text-[#0f8a4b]">
            <span>Verified</span>
            <span className="text-[#a7b2c0]">•</span>
            <span>Active</span>
          </span>
        ) : (
          <span className="break-words font-semibold text-[#182235]">{value}</span>
        )}
      </p>
    </div>
  );
};

const OverviewMetricCard = ({ metric }: { metric: OverviewMetric }) => {
  const Icon = metric.icon;

  return (
    <Card className="min-h-[128px] p-4">
      <div className="flex h-full min-w-0 flex-col justify-between gap-7">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-[14px] font-medium leading-5 text-[#536987]">{metric.title}</h2>
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] ${metric.iconWrapClass}`}>
            <Icon size={18} strokeWidth={2.1} className={metric.iconClass} />
          </span>
        </div>

        <div>
          <p className="text-[26px] font-bold leading-8 text-[#182235]">{metric.value}</p>
        </div>
      </div>
    </Card>
  );
};

const TaskStatusBadge = ({ status }: { status: TaskHistoryRow['status'] }) => {
  const styles = {
    Completed: 'bg-[#006b45] text-white',
    Assigned: 'bg-[#059669] text-white',
    Posted: 'bg-[#d8e1ee] text-[#17345f]',
    Canceled: 'bg-[#e40012] text-white',
  };

  return (
    <span className={`inline-flex h-5 items-center rounded-full px-2.5 text-[9px] font-bold uppercase leading-none ${styles[status]}`}>
      {status}
    </span>
  );
};

const TaskDoer = ({ row }: { row: TaskHistoryRow }) => {
  const isUnassigned = row.status === 'Posted';

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
          isUnassigned ? 'bg-[#e5e9ef] text-[#98a3b3]' : 'bg-[#16324f] text-white'
        }`}
      >
        {row.doerInitials}
      </span>
      <span className="truncate text-[13px] font-medium text-[#263348]">{row.doer}</span>
    </div>
  );
};

const TaskHistoryPagination = () => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e3eaf4] px-5 py-4">
    <p className="text-[12px] font-medium text-[#536987]">Showing 1 to 5 of 24 tasks</p>
    <div className="flex items-center gap-2">
      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[#8a98ad]">
        <ChevronLeft size={16} />
      </button>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          className={`h-8 w-8 rounded-[4px] text-[12px] font-bold ${
            page === 1 ? 'bg-[#0f2d5f] text-white' : 'text-[#536987]'
          }`}
        >
          {page}
        </button>
      ))}
      <span className="px-2 text-[12px] font-bold text-[#75849a]">...</span>
      <button type="button" className="h-8 w-8 rounded-[4px] text-[12px] font-bold text-[#536987]">
        5
      </button>
      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[#536987]">
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const TaskPosterTable = () => (
  <div className="overflow-hidden rounded-[6px] border border-[#dfe7f2] bg-white">
    <div className="hidden grid-cols-[112px_118px_minmax(150px,1.2fr)_minmax(150px,1fr)_118px_100px_130px] bg-[#f7f9fc] lg:grid">
      {['Task ID', 'Date', 'Service Name', 'Doer', 'Status', 'Amount', 'Reward Points'].map((heading) => (
        <div key={heading} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6f7f98]">
          {heading}
        </div>
      ))}
    </div>

    <div className="divide-y divide-[#e3eaf4]">
      {taskHistoryRows.map((row) => (
        <div
          key={row.id}
          className={`grid gap-3 px-5 py-4 text-[13px] lg:grid-cols-[112px_118px_minmax(150px,1.2fr)_minmax(150px,1fr)_118px_100px_130px] lg:items-center lg:gap-0 ${
            row.status === 'Canceled' ? 'bg-[#f4f4f6] text-[#71809a]' : 'bg-white'
          }`}
        >
          <div className="font-semibold text-[#0f2d5f]">{row.id}</div>
          <div className="text-[#536987]">{row.date}</div>
          <div className="font-bold text-[#0f2d5f]">{row.service}</div>
          <TaskDoer row={row} />
          <div>
            <TaskStatusBadge status={row.status} />
          </div>
          <div className="font-bold text-[#17345f]">{row.amount}</div>
          <div className="font-bold text-[#1f9b5f]">{row.reward}</div>
        </div>
      ))}
    </div>

    <TaskHistoryPagination />
  </div>
);

const TaskDoerTable = () => (
  <div className="overflow-hidden rounded-[6px] border border-[#dfe7f2] bg-white">
    <div className="hidden grid-cols-[112px_118px_minmax(150px,1.2fr)_minmax(150px,1fr)_118px_110px_150px_104px] bg-[#f7f9fc] lg:grid">
      {['Task ID', 'Date', 'Service Name', 'Task Poster', 'Status', 'Amount', 'Milestone', 'Action'].map((heading) => (
        <div key={heading} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6f7f98]">
          {heading}
        </div>
      ))}
    </div>

    <div className="divide-y divide-[#e3eaf4]">
      {taskDoerRows.map((row) => (
        <div
          key={row.id}
          className="grid gap-3 px-5 py-4 text-[13px] lg:grid-cols-[112px_118px_minmax(150px,1.2fr)_minmax(150px,1fr)_118px_110px_150px_104px] lg:items-center lg:gap-0"
        >
          <div className="font-semibold text-[#0f2d5f]">{row.id}</div>
          <div className="text-[#536987]">{row.date}</div>
          <div className="font-bold text-[#0f2d5f]">{row.service}</div>
          <div className="font-medium text-[#263348]">{row.taskPoster}</div>
          <div>
            <TaskStatusBadge status={row.status} />
          </div>
          <div className="font-bold text-[#17345f]">{row.amount}</div>
          <div className="font-bold text-[#24935a]">{row.milestone}</div>
          <div>
            {row.action ? (
              <button type="button" className="h-8 rounded-none border border-[#b7793b] px-3 text-[11px] font-medium text-[#a46122]">
                {row.action}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>

    <TaskHistoryPagination />
  </div>
);

const TaskHistoryFilterDropdown = ({
  label,
  options,
  isOpen,
  onToggle,
  showCalendar = false,
}: {
  label: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  showCalendar?: boolean;
}) => (
  <div className="relative w-full sm:w-[220px]">
    <button
      type="button"
      onClick={onToggle}
      className={`flex h-9 w-full items-center justify-between gap-3 rounded-[6px] border bg-[#fbfcff] px-4 text-[12px] font-medium text-[#263348] ${
        isOpen ? 'border-[#9aa6b8] shadow-[0_1px_2px_rgba(15,23,42,0.08)]' : 'border-[#d7e1ee]'
      }`}
    >
      <span>{label}</span>
      {showCalendar ? (
        <CalendarDays size={16} className="text-[#5f6f83]" />
      ) : (
        <ChevronDown size={15} className={`text-[#5f6f83] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </button>

    {isOpen ? (
      <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[6px] border border-[#c2cad6] bg-white py-1 shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
        {options.map((option, index) => {
          const isSelected = index === 0;
          const isCustomRange = option === 'Custom Range';

          return (
            <button
              key={option}
              type="button"
              className={`flex h-9 w-full items-center justify-between px-4 text-left text-[13px] font-medium text-[#263348] ${
                isSelected ? 'bg-[#dbe5ff] font-bold text-[#0f2d5f]' : 'hover:bg-[#f5f7fb]'
              } ${isCustomRange ? 'border-t border-[#d7dce5]' : ''}`}
            >
              <span>{option}</span>
              {isSelected ? <Check size={15} strokeWidth={2.4} className="text-[#0f2d5f]" /> : null}
            </button>
          );
        })}
      </div>
    ) : null}
  </div>
);

const TaskHistoryPanel = () => {
  const [activeTaskHistoryTab, setActiveTaskHistoryTab] = useState('Task Doer');
  const [openTaskFilter, setOpenTaskFilter] = useState<'status' | 'date' | null>('status');

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-6 border-b border-[#d9e2ef]">
        {['Task Poster', 'Task Doer'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setActiveTaskHistoryTab(mode)}
            className={`h-9 border-b-2 text-[12px] font-bold ${
              activeTaskHistoryTab === mode ? 'border-[#0f2d5f] text-[#0f2d5f]' : 'border-transparent text-[#75849a]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[7px] border border-[#dfe7f2] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <label className="flex h-9 min-w-[260px] flex-1 items-center gap-3 rounded-[6px] border border-[#d7e1ee] bg-[#fbfcff] px-3 text-[#8a98ad]">
          <Search size={16} strokeWidth={2} />
          <input
            className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#8a98ad]"
            placeholder="Search tasks title/customer/provider..."
          />
        </label>

        <TaskHistoryFilterDropdown
          label="Task Status: All"
          options={taskStatusFilterOptions}
          isOpen={openTaskFilter === 'status'}
          onToggle={() => setOpenTaskFilter(openTaskFilter === 'status' ? null : 'status')}
        />

        <TaskHistoryFilterDropdown
          label="Date Created: All Time"
          options={dateCreatedFilterOptions}
          isOpen={openTaskFilter === 'date'}
          onToggle={() => setOpenTaskFilter(openTaskFilter === 'date' ? null : 'date')}
          showCalendar
        />

        <button
          type="button"
          className="ml-auto flex h-9 items-center gap-2 rounded-[6px] bg-[#1B3061] px-5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(27,48,97,0.22)]"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
      </div>

      {activeTaskHistoryTab === 'Task Doer' ? <TaskDoerTable /> : <TaskPosterTable />}
    </div>
  );
};

const PaymentStatusBadge = ({ status }: { status: PaymentHistoryRow['status'] }) => {
  const styles = {
    Paid: 'bg-[#d8f7df] text-[#16803b]',
    'In Review': 'bg-[#fff0bb] text-[#b98312]',
    Credited: 'bg-[#dff7eb] text-[#158f5a]',
    Canceled: 'bg-[#f00010] text-white',
  };

  return (
    <span className={`inline-flex h-5 items-center rounded-full px-2.5 text-[9px] font-bold uppercase leading-none ${styles[status]}`}>
      {status}
    </span>
  );
};

const PaymentHistoryPagination = ({ summary = 'Showing 1 to 4 of 24 entries' }: { summary?: string }) => (
  <div className="flex items-center justify-between border-t border-[#e5ebf4] px-4 py-3">
    <p className="text-[12px] font-medium text-[#536987]">{summary}</p>
    <div className="flex items-center gap-2 text-[#0f2d5f]">
      <ChevronLeft size={15} />
      <ChevronRight size={15} />
    </div>
  </div>
);

const AllPaymentTable = () => (
  <>
      <div className="hidden grid-cols-[110px_110px_minmax(145px,1.2fr)_minmax(130px,1fr)_minmax(130px,1fr)_90px_128px_90px_108px] bg-[#f7f9fc] lg:grid">
        {['Date', 'Task ID', 'Task Name', 'Task Poster', 'Task Provider', 'Amount', 'Cancellation Fee Amount', 'Status', 'Action'].map((heading) => (
          <div key={heading} className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.04em] text-[#75849a]">
            {heading}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#e5ebf4]">
        {paymentHistoryRows.map((row, index) => (
          <div
            key={`${row.date}-${row.taskName}-${index}`}
            className="grid gap-3 px-5 py-4 text-[12px] lg:grid-cols-[110px_110px_minmax(145px,1.2fr)_minmax(130px,1fr)_minmax(130px,1fr)_90px_128px_90px_108px] lg:items-center lg:gap-0"
          >
            <div className="font-medium text-[#536987]">{row.date}</div>
            <div className="font-medium text-[#75849a]">{row.taskId}</div>
            <div className="font-bold text-[#0f2d5f]">{row.taskName}</div>
            <div className="font-medium text-[#263348]">{row.taskPoster}</div>
            <div className="font-medium text-[#263348]">{row.taskProvider}</div>
            <div className="font-bold text-[#132f5d]">{row.amount}</div>
            <div className="font-bold text-[#132f5d]">{row.cancellationFee}</div>
            <div>
              <PaymentStatusBadge status={row.status} />
            </div>
            <div>
              <button type="button" className="h-8 rounded-[4px] border border-[#0f2d5f] px-3 text-[10px] font-bold text-[#0f2d5f]">
                View Receipt
              </button>
            </div>
          </div>
        ))}
      </div>

      <PaymentHistoryPagination />
  </>
);

const OutgoingPaymentTable = () => (
  <>
    <div className="hidden grid-cols-[160px_minmax(180px,1.2fr)_minmax(160px,1fr)_120px_120px] bg-[#f7f9fc] lg:grid">
      {['Date', 'Task Name', 'Task Doer', 'Amount', 'Status'].map((heading) => (
        <div key={heading} className="px-16 py-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f718d] first:pl-24">
          {heading}
        </div>
      ))}
    </div>

    <div className="divide-y divide-[#dfe7f2]">
      {outgoingPaymentRows.map((row) => (
        <div
          key={`${row.date}-${row.taskName}`}
          className="grid gap-3 px-6 py-5 text-[15px] lg:grid-cols-[160px_minmax(180px,1.2fr)_minmax(160px,1fr)_120px_120px] lg:items-center lg:gap-0"
        >
          <div className="font-medium text-[#111827] lg:pl-16">{row.date}</div>
          <div className="font-bold text-[#0f2d5f]">{row.taskName}</div>
          <div className="font-medium text-[#111827]">{row.taskDoer}</div>
          <div className="font-bold text-[#111827]">{row.amount}</div>
          <div>
            <PaymentStatusBadge status={row.status} />
          </div>
        </div>
      ))}
    </div>

    <PaymentHistoryPagination />
  </>
);

const EarnedPaymentTable = () => (
  <>
    <div className="hidden grid-cols-[150px_minmax(180px,1.2fr)_minmax(160px,1fr)_120px_120px_120px] bg-[#f7f9fc] lg:grid">
      {['Date', 'Task Name', 'Task Poster', 'Amount', 'Status', 'Action'].map((heading) => (
        <div key={heading} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f718d]">
          {heading}
        </div>
      ))}
    </div>

    <div className="divide-y divide-[#dfe7f2]">
      {earnedPaymentRows.map((row) => (
        <div
          key={`${row.date}-${row.taskName}`}
          className="grid gap-3 px-5 py-4 text-[14px] lg:grid-cols-[150px_minmax(180px,1.2fr)_minmax(160px,1fr)_120px_120px_120px] lg:items-center lg:gap-0"
        >
          <div className="font-medium text-[#111827]">{row.date}</div>
          <div className="font-bold text-[#0f2d5f]">{row.taskName}</div>
          <div className="font-medium text-[#263348]">{row.taskPoster}</div>
          <div className="font-bold text-[#111827]">{row.amount}</div>
          <div>
            <PaymentStatusBadge status={row.status} />
          </div>
          <div>
            <button type="button" className="h-8 rounded-none border border-[#b7793b] px-3 text-[11px] font-medium text-[#a46122]">
              View Receipt
            </button>
          </div>
        </div>
      ))}
    </div>

    <PaymentHistoryPagination />
  </>
);

const CancellationFeeStatusBadge = ({ status }: { status: CancellationFeeRow['status'] }) => {
  const styles = {
    Pending: 'border-[#fed7aa] bg-[#fff1df] text-[#f47b20]',
    Paid: 'border-[#bcebd0] bg-[#dff7eb] text-[#16803b]',
    Waived: 'border-[#d4dbe6] bg-[#e7ebf1] text-[#6f7f98]',
  };

  return (
    <span
      className={`inline-flex h-5 items-center rounded-full border px-2.5 text-[9px] font-bold uppercase leading-none ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const CancellationFeesTable = () => (
  <>
    <div className="flex items-center gap-5 border-b border-[#dfe7f2] px-5">
      {['Task Poster', 'Task Doer'].map((mode, index) => (
        <button
          key={mode}
          type="button"
          className={`h-11 border-b-2 text-[13px] font-bold ${
            index === 0 ? 'border-[#0f2d5f] text-[#0f2d5f]' : 'border-transparent text-[#5f718d]'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>

    <div className="hidden grid-cols-[110px_110px_minmax(160px,1.1fr)_minmax(150px,1fr)_120px_110px_90px] bg-[#f7f9fc] lg:grid">
      {['Date', 'Task ID', 'Task Name', 'Task Doer', 'Fee Amount', 'Status', 'Actions'].map((heading) => (
        <div key={heading} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.04em] text-[#5f718d]">
          {heading}
        </div>
      ))}
    </div>

    <div className="divide-y divide-[#dfe7f2]">
      {cancellationFeeRows.map((row) => (
        <div
          key={row.taskId}
          className="grid gap-3 px-5 py-5 text-[14px] lg:grid-cols-[110px_110px_minmax(160px,1.1fr)_minmax(150px,1fr)_120px_110px_90px] lg:items-center lg:gap-0"
        >
          <div className="font-medium text-[#111827]">{row.date}</div>
          <div className="font-medium text-[#536987]">{row.taskId}</div>
          <div className="font-bold text-[#0f2d5f]">{row.taskName}</div>
          <div className="font-medium text-[#263348]">{row.taskDoer}</div>
          <div className="font-bold text-[#111827]">{row.feeAmount}</div>
          <div>
            <CancellationFeeStatusBadge status={row.status} />
          </div>
          <div>
            <button
              type="button"
              aria-label={`View cancellation fee for ${row.taskId}`}
              className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#61728d] transition hover:bg-[#eef3fb] hover:text-[#0f2d5f]"
            >
              <Eye size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}
    </div>

    <PaymentHistoryPagination summary="Showing 1 to 3 of 3 entries" />
  </>
);

const PaymentHistoryPanel = () => {
  const [activePaymentFilter, setActivePaymentFilter] = useState('Cancellation Fees');

  const paymentTable =
    activePaymentFilter === 'Outgoing' ? (
      <OutgoingPaymentTable />
    ) : activePaymentFilter === 'Earned' ? (
      <EarnedPaymentTable />
    ) : activePaymentFilter === 'Cancellation Fees' ? (
      <CancellationFeesTable />
    ) : (
      <AllPaymentTable />
    );

  return (
  <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_300px]">
    <div className="overflow-hidden rounded-[7px] border border-[#dfe7f2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1e8f3] px-4 py-4">
        <h2 className="text-[15px] font-bold text-[#111827]">Transactions</h2>
        <div className="flex rounded-[6px] bg-[#eef2f8] p-1">
          {['All', 'Outgoing', 'Earned', 'Cancellation Fees'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActivePaymentFilter(filter)}
              className={`h-8 rounded-[5px] px-4 text-[11px] font-semibold ${
                activePaymentFilter === filter ? 'bg-white text-[#1f2a3d] shadow-[0_1px_3px_rgba(15,23,42,0.12)]' : 'text-[#66758b]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {paymentTable}
    </div>

    <aside className="space-y-4">
      <div className="rounded-[7px] border border-[#ff9f43] bg-[#fff7ee] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={17} className="mt-0.5 text-[#ff8a00]" />
          <div>
            <h3 className="text-[13px] font-bold text-[#ff8a00]">Remaining Fees</h3>
            <p className="mt-3 text-[11px] leading-5 text-[#5f4a34]">
              You have remaining fees. The remaining Cancellation fees of $23.92 will be added to your next outgoing payment invoice.
            </p>
            <button type="button" className="mt-3 text-[11px] font-bold text-[#d66d00]">
              See fees →
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[7px] border border-[#dfe7f2] bg-white">
        <div className="border-b border-[#e7edf5] px-4 py-4">
          <h3 className="text-[15px] font-bold text-[#1f2937]">Saved Methods</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-[6px] border border-[#dfe7f2] bg-[#f7f9fc] p-3">
            <span className="flex h-8 w-10 items-center justify-center rounded-[3px] border border-[#d7e1ee] bg-white text-[9px] font-bold text-[#0f2d5f]">
              VISA
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-[#1f2937]">Visa ending in 4242</p>
              <p className="mt-0.5 text-[10px] font-medium text-[#7a8799]">Expires 12/26</p>
            </div>
            <span className="rounded-[3px] bg-[#e7eef8] px-2 py-1 text-[9px] font-bold text-[#0f2d5f]">DEFAULT</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
  );
};

const RewardActivityMarker = ({ activity }: { activity: RewardPointRow['activity'] }) => {
  const markerStyles = {
    'AUD Conversion': 'bg-[#ef4444]',
    'Review Completed': 'bg-[#9db8ff]',
    'Milestone Bonus': 'bg-[#a35f00]',
  };

  const textStyles = {
    'AUD Conversion': 'text-[#dc2626]',
    'Review Completed': 'text-[#1f2a3d]',
    'Milestone Bonus': 'text-[#9a5b00]',
  };

  return (
    <span className={`inline-flex items-center gap-2 text-[12px] font-medium ${textStyles[activity]}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${markerStyles[activity]}`} />
      {activity}
    </span>
  );
};

const RewardPointsValue = ({ row }: { row: RewardPointRow }) => {
  const isNegative = row.points.startsWith('-');

  return (
    <span className={`font-bold ${isNegative ? 'text-[#ef4444]' : 'text-[#17945b]'}`}>
      {row.points}
    </span>
  );
};

const RewardAudValue = ({ value }: { value: string }) => {
  const isPaid = value.includes('paid');

  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold ${
        isPaid ? 'bg-[#ffe0dc] text-[#ef4444]' : 'bg-[#dcf7e8] text-[#17945b]'
      }`}
    >
      {value}
    </span>
  );
};

const RewardsPointsPanel = () => (
    <div className="overflow-hidden rounded-[7px] border border-[#dfe7f2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebf4] px-5 py-4">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#111827]">Points History</h2>
          <p className="mt-1 text-[11px] font-semibold tracking-[0.02em] text-[#5f718d]">
            Task Poster rewards -- review-completed tasks &amp; AUD conversions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-9 w-[210px] items-center gap-2 rounded-[4px] border border-[#dbe4f0] bg-[#f8fafd] px-3 text-[#8a98ad]">
            <Search size={14} strokeWidth={2} />
            <input
              className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-[#1f2a3d] outline-none placeholder:text-[#8a98ad]"
              placeholder="Search ID..."
            />
          </label>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[4px] border border-[#dbe4f0] bg-white px-4 text-[11px] font-bold text-[#1f2a3d]"
          >
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 border-b border-[#e5ebf4] bg-[#f8faff] px-5">
        {[
          ['All Activity', '42'],
          ['Points Earned', '34'],
          ['AUD Conversions', '8'],
        ].map(([label, count], index) => (
          <button
            key={label}
            type="button"
            className={`h-11 border-b-2 text-[12px] font-semibold ${
              index === 0 ? 'border-[#0f2d5f] text-[#0f2d5f]' : 'border-transparent text-[#66758b]'
            }`}
          >
            {label}
            <span
              className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                index === 0 ? 'bg-[#111827] text-white' : 'bg-[#e5eaf2] text-[#66758b]'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-b border-[#e5ebf4] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-[#f0cf8a] bg-[#fff8e8] text-[#a76100]">
            <Award size={17} fill="currentColor" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[14px] font-bold leading-5 text-[#a76100]">Silver Member</p>
            <p className="text-[11px] font-medium text-[#7b8798]">Since Jan 15, 2024</p>
          </div>
        </div>

        <div className="w-full max-w-[430px]">
          <div className="mb-1 flex items-center justify-between gap-4 text-[11px] font-bold uppercase text-[#64748b]">
            <span>Progress to Gold</span>
            <span className="text-[13px] normal-case text-[#1f2a3d]">750 / 1,000 pts</span>
          </div>
          <div className="h-2 rounded-full bg-[#e6ebf3]">
            <div className="h-full w-3/4 rounded-full bg-[#935100]" />
          </div>
        </div>
      </div>

      <div className="grid border-b border-[#e5ebf4] sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total Pts Earned', '+3,750 pts', 'text-[#17945b]'],
          ['Total Pts Converted', '-3,000 pts', 'text-[#ef4444]'],
          ['Total AUD Withdrawn', '$42.00 AUD', 'text-[#a76100]'],
          ['Current Pts Balance', '750 pts', 'text-[#111827]'],
        ].map(([label, value, className]) => (
          <div key={label} className="border-b border-r border-[#e5ebf4] px-5 py-5 last:border-r-0 xl:border-b-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#75849a]">{label}</p>
            <p className={`mt-2 text-[20px] font-bold leading-6 ${className}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="hidden grid-cols-[120px_190px_minmax(170px,1fr)_170px_150px_150px] bg-[#f7f9fc] lg:grid">
        {['Task ID', 'Date', 'Activity', 'Task Type', 'Points', 'AUD Equiv.'].map((heading) => (
          <div key={heading} className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f718d]">
            {heading}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#dfe7f2]">
        {rewardPointRows.map((row, index) => {
          const isConversion = row.activity === 'AUD Conversion';

          return (
            <div
              key={`${row.taskId}-${row.date}-${index}`}
              className={`grid gap-3 px-5 py-4 text-[12px] lg:grid-cols-[120px_190px_minmax(170px,1fr)_170px_150px_150px] lg:items-center lg:gap-0 ${
                isConversion ? 'bg-[#fff7ed]' : 'bg-white'
              }`}
            >
              <div className="font-semibold text-[#0f2d5f]">
                {row.taskId.startsWith('#') ? (
                  <span className="rounded-[3px] bg-[#0f2d5f] px-2 py-1 text-[10px] font-bold text-white">{row.taskId}</span>
                ) : (
                  <span className="text-[#75849a]">{row.taskId}</span>
                )}
              </div>
              <div className="font-medium text-[#263348]">{row.date}</div>
              <RewardActivityMarker activity={row.activity} />
              <div className="font-medium text-[#5f718d]">{row.taskType}</div>
              <RewardPointsValue row={row} />
              <RewardAudValue value={row.audEquiv} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#e5ebf4] px-4 py-3">
        <p className="text-[12px] font-medium text-[#536987]">Showing 1-7 of 42 entries</p>
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#536987]">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#dbe4f0]">
            <ChevronLeft size={14} />
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#0f2d5f] font-bold text-white">
            1
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px]">2</button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px]">3</button>
          <span className="px-1">...</span>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px]">6</button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#dbe4f0]">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
);

const RewardCatalogIcon = ({ item }: { item: RewardCatalogItem }) => {
  const iconClass =
    item.state === 'current'
      ? 'bg-[#17356d] text-white'
      : item.state === 'locked'
        ? 'bg-[#eef1f6] text-[#b2bdcc]'
        : 'bg-[#eef2ff] text-[#64748b]';

  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
      {item.state === 'locked' ? <ShieldCheck size={17} /> : <Award size={17} />}
    </span>
  );
};

const RewardsMilestonesPanel = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
    <div className="space-y-5">
      <section className="rounded-[8px] bg-[#203b75] px-6 py-5 text-white shadow-[0_12px_28px_rgba(15,45,95,0.18)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#b8c7e7]">Current Progress</p>
        <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
          <span className="text-[56px] font-bold leading-none text-[#ffae1a]">142</span>
          <span className="pb-2 text-[19px] font-medium text-[#f8fafc]">Tasks Completed</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[71%] rounded-full bg-[#ffae1a]" />
        </div>
        <div className="mt-3 grid gap-2 text-[13px] font-medium text-[#e5edf9] sm:grid-cols-3">
          <span>Next Milestone: 200 Tasks</span>
          <span className="text-center">71% Complete</span>
          <span className="text-right font-bold text-white">$50 Value Unlock</span>
        </div>
      </section>

      <div>
        <h2 className="mb-3 text-center text-[12px] font-bold uppercase tracking-[0.08em] text-[#475569]">Rewards Catalog</h2>
        <div className="overflow-hidden rounded-[8px] border border-[#dfe7f2] bg-white">
          {rewardCatalogItems.map((item) => {
            const isLocked = item.state === 'locked';
            const isCurrent = item.state === 'current';

            return (
              <div key={item.title} className={`${isCurrent ? 'bg-[#f0f2f6]' : 'bg-white'} ${isLocked ? 'text-[#9aa6b5]' : ''}`}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <RewardCatalogIcon item={item} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] font-bold ${isLocked ? 'text-[#9aa6b5]' : 'text-[#f59e0b]'}`}>{item.milestone}</p>
                    <p className={`mt-0.5 text-[14px] font-bold ${isLocked ? 'text-[#9aa6b5]' : 'text-[#111827]'}`}>{item.title}</p>
                  </div>
                  {item.state === 'claimed' ? (
                    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#d7f8e7] px-3 text-[11px] font-bold text-[#0f9f68]">
                      <CheckCircle2 size={12} />
                      Claimed
                    </span>
                  ) : null}
                  {isLocked ? <ShieldCheck size={17} className="text-[#aeb8c7]" /> : null}
                </div>

                {item.shipping ? (
                  <div className="flex items-center justify-between gap-4 border-t border-[#e5ebf4] px-5 py-3 text-[11px] font-semibold text-[#536987]">
                    <span className="flex min-w-0 items-center gap-2 truncate">
                      <ClipboardList size={13} />
                      {item.shipping}
                    </span>
                    <button type="button" className="shrink-0 text-[12px] font-bold text-[#0f2d5f]">
                      View Details
                    </button>
                  </div>
                ) : null}

                {isCurrent ? (
                  <div className="border-t border-[#dfe5ee] px-5 py-3 text-[11px] font-medium italic text-[#536987]">
                    * You will be asked to confirm your shipping address upon claiming.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <aside className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center gap-3 text-[#0f2d5f]">
          <ClipboardList size={18} />
          <h3 className="text-[14px] font-bold text-[#1f2937]">Default Shipping Address</h3>
        </div>
        <div className="mt-5 rounded-[7px] border border-[#dfe7f2] bg-[#f5f7fb] p-5">
          <p className="text-[11px] font-bold text-[#75849a]">Current Default Address</p>
          <address className="mt-3 not-italic text-[14px] font-semibold leading-6 text-[#1f2937]">
            Alexander Sterling<br />
            1248 Oak Creek Dr, Apt 3B<br />
            Austin, TX 78701<br />
            United States
          </address>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8797ad] text-[12px] font-bold text-[#536987]">
            i
          </span>
          <p className="text-[16px] font-medium leading-7 text-[#5f6673]">
            Physical rewards are typically processed and shipped within 3-5 business days upon claim confirmation.
          </p>
        </div>
      </Card>
    </aside>
  </div>
);

const RewardsHistoryPanel = () => {
  const [activeRewardsTab, setActiveRewardsTab] = useState('Milestones');

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center gap-6 border-b border-[#d9e2ef]">
        {['Points', 'Milestones'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveRewardsTab(tab)}
            className={`h-9 border-b-2 text-[12px] font-bold ${
              activeRewardsTab === tab ? 'border-[#0f2d5f] text-[#0f2d5f]' : 'border-transparent text-[#75849a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeRewardsTab === 'Milestones' ? <RewardsMilestonesPanel /> : <RewardsPointsPanel />}
    </div>
  );
};

const ComplaintSeverityBadge = ({ severity }: { severity: RecentComplaintRow['severity'] }) => {
  const styles = {
    Critical: 'bg-[#fee2e2] text-[#dc2626]',
    High: 'bg-[#ffedd5] text-[#c05621]',
  };

  return <span className={`inline-flex h-6 items-center rounded-[4px] px-2.5 text-[11px] font-bold ${styles[severity]}`}>{severity}</span>;
};

const ComplaintStatusBadge = ({ status }: { status: RecentComplaintRow['status'] }) => {
  const styles = {
    Pending: 'bg-[#fde68a] text-[#b45309]',
    'Under Investigation': 'bg-[#dbe3ff] text-[#4338ca]',
  };

  return <span className={`inline-flex h-6 items-center rounded-[4px] px-2.5 text-[11px] font-bold ${styles[status]}`}>{status}</span>;
};

const ReportsPanel = () => (
  <div className="space-y-5 p-4">
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {reportMetricCards.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.title} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#5f718d]">{metric.title}</p>
                <p className={`mt-3 text-[24px] font-bold leading-7 ${metric.valueClass}`}>{metric.value}</p>
                <p className={`mt-2 text-[12px] font-bold ${metric.helperClass}`}>{metric.helper}</p>
              </div>
              <Icon size={18} strokeWidth={2.2} className={metric.valueClass} />
            </div>
          </Card>
        );
      })}
    </div>

    <div className="overflow-hidden rounded-[8px] border border-[#dfe7f2] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="border-b border-[#e5ebf4] px-5 py-4">
        <h2 className="text-[18px] font-bold leading-6 text-[#111827]">Recent Complaints</h2>
      </div>

      <div className="hidden grid-cols-[140px_minmax(130px,1fr)_112px_150px_minmax(150px,1fr)_180px_120px] bg-[#f7f9fc] lg:grid">
        {['Complaint ID', 'Category', 'Severity', 'Date Filed', 'Assigned To', 'Status', 'Action'].map((heading) => (
          <div key={heading} className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f718d]">
            {heading}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#dfe7f2]">
        {recentComplaintRows.map((row) => (
          <div
            key={row.id}
            className="grid gap-3 px-8 py-4 text-[14px] lg:grid-cols-[140px_minmax(130px,1fr)_112px_150px_minmax(150px,1fr)_180px_120px] lg:items-center lg:gap-0"
          >
            <div className="font-bold text-[#1f2a3d]">{row.id}</div>
            <div className="font-medium text-[#263348]">{row.category}</div>
            <div>
              <ComplaintSeverityBadge severity={row.severity} />
            </div>
            <div className="font-medium text-[#536987]">{row.dateFiled}</div>
            <div className="font-medium text-[#263348]">{row.assignedTo}</div>
            <div>
              <ComplaintStatusBadge status={row.status} />
            </div>
            <div>
              <button type="button" className="text-[13px] font-bold text-[#0054bd]">
                View Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AccountDetailsPanel = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ProfileIdentity = () => (
  <div className="flex min-w-0 flex-1 items-center gap-4">
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] border border-[#d7dee8] bg-[#f4f6f9] text-[17px] font-bold text-[#152033]">
      SM
      <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#e9f8f0] text-[#0f8a4b]">
        <BadgeCheck size={13} strokeWidth={2.3} />
      </span>
    </div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#7b8798]">Primary Identity</p>
      <h2 className="mt-1 text-[24px] font-bold leading-7 text-[#111827]">S.Mitchell</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-[#64748b]">
        <span>Sarah Mitchell</span>
        <span className="h-3 w-px bg-[#d6dde7]" />
        <span>CST-9824</span>
        <span className="h-3 w-px bg-[#d6dde7]" />
        <span>Both</span>
      </div>
    </div>
  </div>
);

const IdentityInformation = () => (
  <div className="min-w-0">
    <p className="text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-[#64748b]">Identity Information</p>
    <div className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
      {identityInfoItems.map((item) => (
        <InfoItem key={item.label} {...item} />
      ))}
    </div>
  </div>
);

const AccountStanding = () => (
  <div className="border-t border-[#e7ecf3] px-6 py-4">
    <div className="flex items-start gap-3">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[#f3f6fa] text-[#536173]">
        <ShieldCheck size={14} strokeWidth={2.1} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#64748b]">Suspension Status</p>
        <p className="mt-1 text-[13px] font-semibold leading-5 text-[#182235]">No active suspensions</p>
        <p className="mt-0.5 text-[12px] leading-5 text-[#64748b]">Account is currently in good standing.</p>
      </div>
    </div>
  </div>
);

const ProfileOverview = () => (
  <Card className="overflow-hidden border-[#d8e0ea] shadow-[0_8px_24px_rgba(15,23,42,0.035)]">
    <div className="flex flex-col gap-5 border-b border-[#e7ecf3] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <ProfileIdentity />

      <div className="flex shrink-0 flex-col gap-2 rounded-[7px] border border-[#e3e9f1] bg-[#fafbfc] px-4 py-3 lg:min-w-[230px]">
        <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#7b8798]">Verification State</p>
        <div className="flex flex-wrap gap-2">
          <StatusChip>
            <CheckCircle2 size={12} />
            Verified
          </StatusChip>
          <StatusChip>Active</StatusChip>
        </div>
        <p className="text-[12px] font-medium leading-5 text-[#64748b]">Silver account with no active suspension.</p>
      </div>
    </div>

    <div className="px-6 py-5">
      <IdentityInformation />
    </div>

    <AccountStanding />
  </Card>
);

export default function UserDetailsPage() {
  const [activeTab, setActiveTab] = useState('Account Details');

  return (
    <div className="app-shell flex bg-[#f7f8fa]">
      <Sidebar />

      <main className="dashboard-main flex-1 overflow-x-hidden overflow-y-auto pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
        <Header />

        <div className="dashboard-container px-8 pb-12 pt-5 max-sm:px-4">
          <div className="animate-dashboard-entry space-y-6">
            <div>
              <h1 className="text-[22px] font-bold leading-7 text-[#111827]">Sarah Mitchell</h1>
              <p className="mt-1 text-[13px] text-[#64748b]">User profile, verification, payments, activity, and admin context.</p>
            </div>

            <ProfileOverview />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {overviewMetrics.map((metric) => (
                <OverviewMetricCard key={metric.title} metric={metric} />
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#475569]">
                  <Trophy size={15} />
                  Milestone
                </div>
                <p className="mt-3 text-[18px] font-bold leading-6 text-[#111827]">Silver</p>
                <div className="mt-3 h-2 rounded-full bg-[#e7ecf4]">
                  <div className="h-full w-[74%] rounded-full bg-[#1d3470]" />
                </div>
                <p className="mt-2 text-right text-[11px] font-medium text-[#475569]">Progress to Gold</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#475569]">
                  <CreditCard size={15} />
                  Payment Summary
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-4 text-[13px]">
                    <span className="text-[#64748b]">Total Earned</span>
                    <span className="font-bold text-[#111827]">$3,240.50</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[13px]">
                    <span className="text-[#64748b]">Total Spent</span>
                    <span className="font-bold text-[#111827]">$1,240.00</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#475569]">
                  <ClipboardList size={15} />
                  Task Activity
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-[12px] text-[#64748b]">Total Completed</span>
                  <span className="text-[18px] font-bold leading-6 text-[#111827]">42</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#e7ecf4]">
                  <div className="h-full w-[68%] rounded-full bg-[#1d3470]" />
                </div>
                <div className="mt-3 space-y-2 border-b border-[#e5ebf4] pb-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#64748b]">Task Poster</span>
                    <span className="font-bold text-[#111827]">18</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#64748b]">Task Doer</span>
                    <span className="font-bold text-[#111827]">24</span>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-[12px] text-[#64748b]">Total Tasks Posted</span>
                  <div className="text-right">
                    <p className="text-[18px] font-bold leading-6 text-[#111827]">24</p>
                    <p className="text-[11px] font-bold text-[#15803d]">+12.5%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#475569]">
                  <Gauge size={15} />
                  Performance Metrics
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ['Cancellation Count & Rate', '1 (2.4%)'],
                    ['Offers Made', '56'],
                    ['Offers Accepted', '42'],
                    ['Deletions', '0'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 text-[12px]">
                      <span className="text-[#64748b]">{label}</span>
                      <span className={label === 'Cancellation Count & Rate' ? 'font-bold text-[#f97316]' : 'font-bold text-[#111827]'}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <nav className="flex flex-wrap items-center gap-1 border-b border-[#edf1f7] px-3 pt-2" aria-label="User detail tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`h-9 rounded-t-[6px] px-3 text-[11px] font-semibold ${activeTab === tab
                        ? 'border-b-2 border-[#1B3061] text-[#1B3061]'
                        : 'text-[#64748b] hover:text-[#1f2937]'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              {activeTab === 'Task History' ? <TaskHistoryPanel /> : null}
              {activeTab === 'Payment History' ? <PaymentHistoryPanel /> : null}
              {activeTab === 'Rewards History' ? <RewardsHistoryPanel /> : null}
              {activeTab === 'Reports' ? <ReportsPanel /> : null}

              {activeTab === 'Account Details' ? (
                <AccountDetailsPanel>
              <div className="grid gap-6 p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  <Card>
                    <SectionHeader title="About" />
                    <div className="space-y-4 p-4">
                      <p className="text-[13px] leading-6 text-[#475569]">
                        Licensed mover and reliable Tasker with over 7 years of experience in residential
                        and commercial services. Specializes in urgent requests, senior support,
                        decluttering, and careful packing for fragile household items.
                      </p>
                      <h3 className="text-[12px] font-bold leading-5 text-[#1f2a3d]">Contact Information</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {contactRows.map((row) => {
                          const Icon = row.icon;
                          return (
                            <div key={row.label} className="flex items-start gap-3 rounded-[7px] border border-[#edf1f7] p-3">
                              <Icon size={15} className="mt-0.5 text-[#64748b]" />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#738098]">{row.label}</p>
                                <p className="mt-1 text-[12px] font-semibold text-[#1f2937]">{row.value}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Portfolio" action="Manage" />
                    <div className="grid gap-3 p-4 sm:grid-cols-3">
                      {['Storage organization', 'Wall mounting', 'Move-out preparation'].map((item, index) => (
                        <div key={item} className="overflow-hidden rounded-[7px] border border-[#dfe7f2]">
                          <div className={`h-28 ${index === 0 ? 'bg-[linear-gradient(135deg,#7c4a16,#fbbf24)]' : index === 1 ? 'bg-[linear-gradient(135deg,#e2e8f0,#475569)]' : 'bg-[linear-gradient(135deg,#f8fafc,#94a3b8)]'}`} />
                          <p className="px-3 py-2 text-[11px] font-semibold text-[#334155]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Internal Admin Notes" action="Edit" />
                    <div className="p-4">
                      <textarea
                        className="h-28 w-full resize-none rounded-[7px] border border-[#e5ebf4] bg-[#f8fafc] p-3 text-[12px] text-[#475569] outline-none focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
                        defaultValue="Add private notes about this provider..."
                      />
                    </div>
                  </Card>
                </div>

                <aside className="space-y-6">
                  <Card>
                    <SectionHeader title="Verification" action="View Documents" />
                    <div className="space-y-3 p-4">
                      {verificationItems.map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          <BadgeCheck size={16} className="mt-0.5 text-[#10b981]" />
                          <div>
                            <p className="text-[12px] font-bold text-[#1f2937]">{item.label}</p>
                            <p className="mt-0.5 text-[11px] text-[#64748b]">{item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Student Verification" action="View Documents" />
                    <div className="space-y-3 p-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap size={16} className="mt-0.5 text-[#10b981]" />
                        <div>
                          <p className="text-[12px] font-bold text-[#1f2937]">ID Verified</p>
                          <p className="mt-0.5 text-[11px] text-[#64748b]">Student ID active through Oct 24, 2026</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Skills" />
                    <div className="flex flex-wrap gap-2 p-4">
                      {['Heavy lifting', 'Packing', 'Furniture assembly', 'Gardening', 'Emergency service'].map((skill) => (
                        <span key={skill} className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-bold text-[#1B3061]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader title="Education & Certs" />
                    <div className="space-y-3 p-4">
                      <div className="flex gap-3">
                        <Award size={16} className="mt-0.5 text-[#64748b]" />
                        <div>
                          <p className="text-[12px] font-bold text-[#1f2937]">Service Trade Institute</p>
                          <p className="text-[11px] text-[#64748b]">Household Relocation Techniques, 2021</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FileCheck2 size={16} className="mt-0.5 text-[#64748b]" />
                        <div>
                          <p className="text-[12px] font-bold text-[#1f2937]">Master Provider License</p>
                          <p className="text-[11px] text-[#64748b]">Valid through Aug 14, 2027</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-[#d7e6fb] bg-[#fbfdff] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={17} className="mt-0.5 text-[#1B3061]" />
                      <div>
                        <p className="text-[12px] font-bold text-[#1f2937]">Account Standing</p>
                        <p className="mt-1 text-[11px] leading-5 text-[#64748b]">
                          No active suspensions. Account is in good standing.
                        </p>
                      </div>
                    </div>
                  </Card>
                </aside>
              </div>
                </AccountDetailsPanel>
              ) : null}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
