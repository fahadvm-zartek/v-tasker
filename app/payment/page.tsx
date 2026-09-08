'use client';

import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  ChevronDown,
  Check,
  CircleDollarSign,
  CreditCard,
  Download,
  Eye,
  FileBarChart2,
  Percent,
  Printer,
  ReceiptText,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSecondaryButton,
  cn,
} from '../components';

type MetricTone = 'blue' | 'green' | 'red' | 'amber' | 'rose';

type PaymentMetric = {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  trendTone: 'positive' | 'negative';
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
};

type TransactionStatus = 'Paid' | 'Pending' | 'Processing' | 'Refunded' | 'Rejected';

type PaymentDetailStatus = 'Completed' | 'Rejected';

type Transaction = {
  date: string;
  taskId: string;
  poster: {
    name: string;
    initials: string;
    avatarClass: string;
  };
  provider: {
    name: string;
    initials: string;
    avatarClass: string;
  };
  amount: string;
  commission: string;
  status: TransactionStatus;
  note?: string;
};

type PaymentDetail = {
  taskId: string;
  taskDescription: string;
  totalAmount: string;
  status: PaymentDetailStatus;
  poster: {
    name: string;
    initials: string;
    avatarClass: string;
    id: string;
  };
  provider: {
    name: string;
    initials: string;
    avatarClass: string;
    id: string;
  };
  timeline: Array<{
    title: string;
    date: string;
    time: string;
    state: 'complete' | 'pending' | 'rejected';
    note?: string;
  }>;
  paymentMethod: {
    card: string;
    expiry: string;
    note?: string;
  };
  rejection?: {
    code: string;
    reason: string;
    origin: string;
    timestamp: string;
  };
};

type PaymentReceipt = {
  id: string;
  issuedOn: string;
  title: string;
  total: string;
  postedBy: string;
  receiptLines: Array<{
    label: string;
    value: string;
  }>;
  netEarnings: string;
  businessName: string;
  abn: string;
  taxLines: Array<{
    label: string;
    value: string;
  }>;
  taxTotal: string;
};

const metricToneClasses: Record<MetricTone, { icon: string; iconWrap: string }> = {
  blue: {
    icon: 'text-[#2563eb]',
    iconWrap: 'bg-[#eef4ff]',
  },
  green: {
    icon: 'text-[#10b981]',
    iconWrap: 'bg-[#e8fbf2]',
  },
  red: {
    icon: 'text-[#ef4444]',
    iconWrap: 'bg-[#fff0f0]',
  },
  amber: {
    icon: 'text-[#f59e0b]',
    iconWrap: 'bg-[#fff7e6]',
  },
  rose: {
    icon: 'text-[#f43f5e]',
    iconWrap: 'bg-[#fff1f2]',
  },
};

const paymentMetrics: PaymentMetric[] = [
  {
    title: 'Gross Revenue',
    value: '$125,400',
    trend: '+12.5% this month',
    trendDirection: 'up',
    trendTone: 'positive',
    icon: ReceiptText,
    tone: 'blue',
  },
  {
    title: 'Commission',
    value: '$18,810',
    trend: '+8.2% this month',
    trendDirection: 'up',
    trendTone: 'positive',
    icon: Percent,
    tone: 'blue',
  },
  {
    title: 'Net Revenue',
    value: '$106,590',
    trend: '+14.1% this month',
    trendDirection: 'up',
    trendTone: 'positive',
    icon: WalletCards,
    tone: 'green',
  },
  {
    title: 'Rejection Rate',
    value: '3.2%',
    trend: '+0.5% this month',
    trendDirection: 'up',
    trendTone: 'negative',
    icon: Ban,
    tone: 'red',
  },
  {
    title: 'Cancellations',
    value: '$4,250',
    trend: '+2.4% this month',
    trendDirection: 'up',
    trendTone: 'negative',
    icon: CircleDollarSign,
    tone: 'amber',
  },
  {
    title: 'Refunds',
    value: '$1,890',
    trend: '-1.1% this month',
    trendDirection: 'down',
    trendTone: 'positive',
    icon: RefreshCcw,
    tone: 'rose',
  },
];

const transactions: Transaction[] = [
  {
    date: '24 Oct 2024',
    taskId: '#TSK-8824',
    poster: {
      name: 'Sarah Mitchell',
      initials: 'SM',
      avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    },
    provider: {
      name: 'Alexander Sterling',
      initials: 'AS',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    amount: '$150.00',
    commission: '$15.00',
    status: 'Paid',
  },
  {
    date: '24 Oct 2024',
    taskId: '#TSK-8823',
    poster: {
      name: 'James Davis',
      initials: 'JD',
      avatarClass: 'bg-[#dbeafe] text-[#2563eb]',
    },
    provider: {
      name: 'Maria Garcia',
      initials: 'MG',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    amount: '$85.50',
    commission: '$8.55',
    status: 'Pending',
    note: '30 Days',
  },
  {
    date: '23 Oct 2024',
    taskId: '#TSK-8819',
    poster: {
      name: 'Robert Chen',
      initials: 'RC',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    provider: {
      name: 'Emma Wilson',
      initials: 'EW',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    amount: '$420.00',
    commission: '$42.00',
    status: 'Processing',
  },
  {
    date: '23 Oct 2024',
    taskId: '#TSK-8795',
    poster: {
      name: 'Olivia Thompson',
      initials: 'OT',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    provider: {
      name: 'William Baker',
      initials: 'WB',
      avatarClass: 'bg-[#eef2ff] text-[#2563eb]',
    },
    amount: '$65.00',
    commission: '$6.50',
    status: 'Refunded',
  },
  {
    date: '23 Oct 2024',
    taskId: '#TSK-8790',
    poster: {
      name: 'David Kim',
      initials: 'DK',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    provider: {
      name: 'Sophia Lee',
      initials: 'SL',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    amount: '$115.00',
    commission: '$11.50',
    status: 'Rejected',
  },
];

const statusClass: Record<TransactionStatus, string> = {
  Paid: 'bg-[#dcf7e9] text-[#047857]',
  Pending: 'bg-[#fff0d7] text-[#d97706]',
  Processing: 'bg-[#eef2ff] text-[#2563eb]',
  Refunded: 'bg-[#ffe1e1] text-[#ef4444]',
  Rejected: 'bg-[#ffe1e1] text-[#dc2626]',
};

const statusFilterOptions = [
  'All',
  'Paid',
  'Pending',
  'Processing',
  'Refunded',
  'Cancelled',
  'Auto Canceled',
];

const dateFilterOptions = [
  'All',
  'Today',
  'Last 7 Days',
  'Last 7 Days',
  'Last 30 Days',
  'Last 60 Days',
];

const sortFilterOptions = [
  'All',
  'Highest Amount',
  'Lowest Amount',
];

const paymentDetails: Record<string, PaymentDetail> = {
  '#TSK-8824': {
    taskId: '#TSK-8824',
    taskDescription: 'Premium Site Inspection',
    totalAmount: '$150.00',
    status: 'Completed',
    poster: {
      name: 'Sarah Mitchell',
      initials: 'SM',
      avatarClass: 'bg-[#e0f2fe] text-[#0f4f7a]',
      id: 'ID: USR-992',
    },
    provider: {
      name: 'Alexander Sterling',
      initials: 'AS',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
      id: 'ID: PRV-441',
    },
    timeline: [
      { title: 'Payment Created', date: 'Oct 24, 2023', time: '09:12 AM', state: 'pending' },
      { title: 'Payment Authorized', date: 'Oct 24, 2023', time: '02:45 PM', state: 'pending' },
      {
        title: 'Funds Released',
        date: 'Oct 24, 2023',
        time: '03:10 PM',
        state: 'complete',
        note: 'Completed',
      },
    ],
    paymentMethod: {
      card: 'Visa ending in 4242',
      expiry: 'Expiry 12/25',
    },
  },
  '#TSK-8790': {
    taskId: '#TSK-8824',
    taskDescription: 'Premium Site Inspection',
    totalAmount: '$115.00',
    status: 'Rejected',
    poster: {
      name: 'David Kim',
      initials: 'DK',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
      id: 'ID: USR-992',
    },
    provider: {
      name: 'Sophia Lee',
      initials: 'SL',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
      id: 'ID: PRV-441',
    },
    timeline: [
      { title: 'Payment Created', date: 'Oct 24, 2023', time: '09:12 AM', state: 'pending' },
      { title: 'Payment Authorized', date: 'Oct 24, 2023', time: '02:45 PM', state: 'pending' },
      {
        title: 'Payment Rejected',
        date: 'Oct 24, 2023',
        time: '03:10 PM',
        state: 'rejected',
        note: 'Failed Authorization',
      },
    ],
    paymentMethod: {
      card: 'Visa ending in 4242',
      expiry: 'Expiry 12/25',
      note: 'Card Declined',
    },
    rejection: {
      code: 'ERR_INSUFFICIENT_FUNDS',
      reason:
        'Insufficient funds on the cardholder account. The issuing bank declined authorization for $150.00. An automated notification was dispatched to the client to update their payment method.',
      origin: 'Origin: Payment Gateway (Stripe)',
      timestamp: 'Oct 24, 2023 - 03:10 PM',
    },
  },
};

const paymentReceipts: Record<string, PaymentReceipt> = {
  '#TSK-8824': {
    id: '#A0035700522',
    issuedOn: 'Issued on Aug 0, 2026',
    title: 'Bathroom cleaning',
    total: '$79.70',
    postedBy: 'Posted by Mina S.',
    receiptLines: [
      { label: 'Task cost', value: '$95.00' },
      { label: 'Pricing adjustment', value: '$20.00' },
      { label: 'Service fee', value: '-$25.30' },
      { label: 'Cancellation fee', value: '-$10.00' },
    ],
    netEarnings: '$79.70',
    businessName: 'VTASKER Limited',
    abn: 'ABN 53 149 850 457',
    taxLines: [
      { label: 'Service fee', value: '$25.30' },
    ],
    taxTotal: '$25.30',
  },
};

const Avatar = ({
  initials,
  className,
}: {
  initials: string;
  className: string;
}) => (
  <span
    className={cn(
      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
      className,
    )}
  >
    {initials}
  </span>
);

const PaymentMetricCard = ({ metric }: { metric: PaymentMetric }) => {
  const Icon = metric.icon;
  const TrendIcon = metric.trendDirection === 'up' ? TrendingUp : TrendingDown;
  const tone = metricToneClasses[metric.tone];

  return (
    <article className="dashboard-interactive flex min-h-[94px] flex-col justify-between rounded-[8px] border border-[#dde5f1] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[9px] font-bold uppercase leading-3 tracking-[0.08em] text-[#64748b]">
          {metric.title}
        </p>
        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]', tone.iconWrap)}>
          <Icon size={14} strokeWidth={2.2} className={tone.icon} />
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[23px] font-bold leading-7 text-[#202b3d]">{metric.value}</p>
        <p
          className={cn(
            'flex items-center gap-1 text-[9px] font-semibold leading-3',
            metric.trendTone === 'positive' ? 'text-[#10b981]' : 'text-[#ef4444]',
          )}
        >
          <TrendIcon size={10} strokeWidth={2.2} />
          {metric.trend}
        </p>
      </div>
    </article>
  );
};

const PaymentDropdown = ({
  label,
  options,
  className,
}: {
  label: string;
  options: string[];
  className?: string;
}) => (
  <details className={cn('group relative h-9 shrink-0', className)}>
    <summary className="flex h-9 cursor-pointer list-none items-center justify-between gap-3 rounded-[5px] border border-[#dbe4ef] bg-white px-3 text-[11px] font-medium text-[#1f2937] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe] focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15 [&::-webkit-details-marker]:hidden">
      <span>{label}</span>
      <ChevronDown
        aria-hidden="true"
        size={14}
        strokeWidth={2.2}
        className="text-[#475569] transition-transform duration-150 group-open:rotate-180"
      />
    </summary>
    <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-[8px] border border-[#dbe4ef] bg-white py-2 shadow-[0_14px_30px_rgba(15,23,42,0.13)]">
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          type="button"
          className="flex h-8 w-full items-center px-3 text-left text-[11px] font-medium text-[#1f2937] transition-colors hover:bg-[#f8fafc] focus-visible:bg-[#eef2ff] focus-visible:outline-none"
        >
          {option}
        </button>
      ))}
    </div>
  </details>
);

const PaymentStatusBadge = ({ status }: { status: PaymentDetailStatus }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold leading-4',
      status === 'Completed'
        ? 'bg-[#d8f8e9] text-[#059669]'
        : 'bg-[#fee2e2] text-[#b91c1c]',
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'Completed' ? 'bg-[#10b981]' : 'bg-[#dc2626]',
      )}
    />
    {status}
  </span>
);

const PaymentTimeline = ({ payment }: { payment: PaymentDetail }) => (
  <div className="rounded-[8px] border border-[#dbe4ef] bg-white p-3">
    <h3 className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#1f2937]">
      Payment Timeline
    </h3>
    <div className="mt-3 space-y-3">
      {payment.timeline.map((item, index) => {
        const isFinal = index === payment.timeline.length - 1;
        const isRejected = item.state === 'rejected';
        const isComplete = item.state === 'complete';

        return (
          <div key={item.title} className="relative flex gap-4 pl-1">
            {!isFinal ? (
              <span
                aria-hidden="true"
                className="absolute left-[10px] top-5 h-[28px] w-px bg-[#dbe4ef]"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white',
                isRejected
                  ? 'border-[#fecaca] bg-[#fee2e2]'
                  : isComplete
                    ? 'border-[#10b981] bg-[#10b981]'
                    : 'border-[#dbe4ef]',
              )}
            >
              {isRejected ? <span className="h-3 w-3 rounded-full bg-[#dc2626]" /> : null}
            </span>

            <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] gap-3">
              <div>
                <p
                  className={cn(
                    'text-[12px] font-bold leading-4',
                    isRejected ? 'text-[#b91c1c]' : 'text-[#1f2937]',
                  )}
                >
                  {item.title}
                </p>
                {item.note ? (
                  <p
                    className={cn(
                      'mt-0.5 text-[10px] font-medium leading-3',
                      isRejected ? 'text-[#dc2626]' : 'text-[#10b981]',
                    )}
                  >
                    {item.note}
                  </p>
                ) : null}
              </div>
              <div
                className={cn(
                  'text-right text-[10px] font-medium leading-3',
                  isRejected ? 'text-[#b91c1c]' : 'text-[#64748b]',
                )}
              >
                <p>{item.date}</p>
                <p>{item.time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PaymentDetailsModal = ({
  payment,
  onOpenReceipt,
  onClose,
}: {
  payment: PaymentDetail;
  onOpenReceipt: () => void;
  onClose: () => void;
}) => {
  const isRejected = payment.status === 'Rejected';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-3 py-3 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-details-title"
    >
      <div className="w-full max-w-[680px] overflow-visible rounded-[10px] bg-white shadow-[0_20px_55px_rgba(15,23,42,0.22)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#e5ebf3] px-5 py-3">
          <div>
            <h2 id="payment-details-title" className="text-[18px] font-bold leading-6 text-[#1f2937]">
              Payment Details
            </h2>
            <p className="mt-1 text-[11px] font-medium leading-4 text-[#94a3b8]">{payment.taskId}</p>
          </div>
          <button
            type="button"
            aria-label="Close payment details"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#1B3061]"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </header>

        <div className="space-y-3 px-5 py-3">
          <section className="flex items-center justify-between gap-4 rounded-[8px] border border-[#dbe4ef] bg-white px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#8491a7]">
                Task Description
              </p>
              <h3 className="mt-1.5 text-[18px] font-bold leading-6 text-[#1f2937]">
                {payment.taskDescription}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#8491a7]">
                Total Amount
              </p>
              <p className={cn('mt-1 text-[22px] font-bold leading-7', isRejected ? 'text-[#111827]' : 'text-[#0457cf]')}>
                {payment.totalAmount}
              </p>
              <div className="mt-1.5 flex justify-end">
                <PaymentStatusBadge status={payment.status} />
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            {[payment.poster, payment.provider].map((person, index) => (
              <article
                key={person.name}
                className="flex items-center gap-3 rounded-[8px] border border-[#dbe4ef] bg-white px-4 py-3"
              >
                <Avatar
                  initials={person.initials}
                  className={cn(person.avatarClass, 'h-9 w-9 text-[10px]')}
                />
                <div>
                  <p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#8491a7]">
                    {index === 0 ? 'Task Poster' : 'Task Provider'}
                  </p>
                  <p className="mt-1 text-[13px] font-bold leading-5 text-[#1f2937]">{person.name}</p>
                  <p className="mt-0.5 text-[10px] font-medium leading-3 text-[#64748b]">{person.id}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
            <PaymentTimeline payment={payment} />
            <div className="rounded-[8px] border border-[#dbe4ef] bg-white p-3">
              <h3 className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#1f2937]">
                Payment Method
              </h3>
              <div className="mt-3 flex min-h-[104px] flex-col items-center justify-center rounded-[8px] bg-[#eef2ff] px-3 text-center">
                <CreditCard size={22} strokeWidth={2.2} className="text-[#0457cf]" />
                <p className="mt-3 text-[11px] font-bold leading-4 text-[#1f2937]">{payment.paymentMethod.card}</p>
                <p className="mt-0.5 text-[10px] font-medium leading-3 text-[#94a3b8]">{payment.paymentMethod.expiry}</p>
                {payment.paymentMethod.note ? (
                  <span className="mt-2 rounded-[4px] border border-[#f87171] bg-white px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                    {payment.paymentMethod.note}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          {payment.rejection ? (
            <section className="rounded-[8px] border border-[#fca5a5] bg-[#fff7f7] px-3 py-2 text-[#b91c1c]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#fee2e2]">
                  <AlertTriangle size={12} strokeWidth={2.3} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[11px] font-bold uppercase leading-4 tracking-[0.05em]">
                      Reason for Rejection
                    </h3>
                    <span className="rounded-[6px] border border-[#fca5a5] bg-white px-2.5 py-0.5 text-[10px] font-bold">
                      {payment.rejection.code}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] font-medium leading-4">{payment.rejection.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#fecaca] pt-1.5 text-[9px] font-medium">
                    <span>{payment.rejection.origin}</span>
                    <span>{payment.rejection.timestamp}</span>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[#e5ebf3] px-5 py-3">
          <button
            type="button"
            onClick={onOpenReceipt}
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#0457cf]"
          >
            <Download size={14} strokeWidth={2.2} />
            {isRejected ? 'Download Invoice / Transaction Log' : 'Download Invoice'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-[8px] border border-[#dbe4ef] bg-white px-5 text-[12px] font-semibold text-[#1f2937] transition-colors hover:bg-[#f8fafc]"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

const PaymentReceiptModal = ({
  receipt,
  onBack,
}: {
  receipt: PaymentReceipt;
  onBack: () => void;
}) => (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#f4f7fb]/92 px-4 py-8 backdrop-blur-[1px]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="payment-receipt-title"
  >
    <section className="w-full max-w-[340px] overflow-hidden rounded-[10px] border border-[#e1e7f0] bg-white text-[#0b1b3f] shadow-[0_16px_45px_rgba(15,23,42,0.14)]">
      <header className="flex h-11 items-center justify-between border-b border-[#edf1f7] px-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#0b1b3f]"
        >
          <ArrowLeft size={13} strokeWidth={2.2} />
          Back
        </button>
        <h2 id="payment-receipt-title" className="text-[11px] font-bold leading-4 text-[#0b1b3f]">
          Payment receipt
        </h2>
        <button
          type="button"
          aria-label="Print receipt"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a97aa] transition-colors hover:bg-[#f1f5f9] hover:text-[#0b1b3f]"
        >
          <Printer size={13} strokeWidth={2.1} />
        </button>
      </header>

      <div className="border-b-[6px] border-[#f1f4f8] px-5 py-5">
        <p className="text-[8px] font-bold uppercase leading-3 tracking-[0.08em] text-[#9aa6b9]">
          {receipt.issuedOn}
        </p>
        <h3 className="mt-3 text-[22px] font-medium leading-6 text-[#14305d]">{receipt.title}</h3>
        <p className="mt-1 text-[27px] font-black leading-8 text-[#061f56]">{receipt.total}</p>
        <p className="mt-1 text-[9px] font-semibold leading-3 text-[#64748b]">Total</p>
      </div>

      <div className="border-b-[6px] border-[#f1f4f8] px-5 py-5">
        <p className="text-[14px] font-semibold leading-5 text-[#0b1b3f]">Task receipt</p>
        <p className="mt-0.5 text-[9px] font-medium leading-3 text-[#9aa6b9]">{receipt.id}</p>
        <div className="mt-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf2ff] text-[#2f6eea]">
            <UserRound size={14} strokeWidth={2.1} />
          </span>
          <span className="text-[10px] font-medium leading-4 text-[#64748b]">{receipt.postedBy}</span>
        </div>
        <div className="mt-5 space-y-4">
          {receipt.receiptLines.map((line) => (
            <div key={line.label} className="flex items-center justify-between gap-4 text-[10px] font-medium">
              <span className="text-[#64748b]">{line.label}</span>
              <span className="font-bold text-[#0b1b3f]">{line.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 text-[11px] font-black">
          <span>Net earnings</span>
          <span>{receipt.netEarnings}</span>
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="text-[14px] font-semibold leading-5 text-[#0b1b3f]">Tax invoice</p>
        <p className="mt-0.5 text-[9px] font-medium leading-3 text-[#9aa6b9]">{receipt.id}</p>
        <div className="mt-5 flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <Check size={24} strokeWidth={2.8} className="text-[#0b3b8f]" />
            <span className="absolute right-0 top-1 h-5 w-1.5 rotate-45 rounded-full bg-[#f59e0b]" />
          </span>
          <span>
            <span className="block text-[10px] font-bold leading-4 text-[#64748b]">{receipt.businessName}</span>
            <span className="block text-[9px] font-medium leading-3 text-[#9aa6b9]">{receipt.abn}</span>
          </span>
        </div>
        <div className="mt-6 space-y-4">
          {receipt.taxLines.map((line) => (
            <div key={line.label} className="flex items-center justify-between gap-4 text-[10px] font-medium">
              <span className="text-[#64748b]">{line.label}</span>
              <span className="font-bold text-[#0b1b3f]">{line.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 text-[11px] font-black">
          <span>Total</span>
          <span>{receipt.taxTotal}</span>
        </div>
        <button
          type="button"
          className="mt-7 flex h-10 w-full items-center justify-center rounded-[8px] bg-[#06184a] text-[10px] font-bold text-white transition-colors hover:bg-[#0b255f]"
        >
          Download PDF receipt
        </button>
      </div>
    </section>
  </div>
);

export default function PaymentPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const selectedPaymentDetail = selectedPaymentId ? paymentDetails[selectedPaymentId] : null;
  const selectedReceipt = selectedReceiptId ? paymentReceipts[selectedReceiptId] : null;

  return (
    <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
      <div className="animate-dashboard-entry space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold leading-7 text-[#202b3d]">Payments Overview</h1>
            <p className="mt-1 text-[11px] font-medium leading-4 text-[#64748b]">
              Monitor revenue, commissions, and transaction flows across the platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DashboardSecondaryButton className="px-3">
              <Download size={13} strokeWidth={2.2} />
              Export CSV
            </DashboardSecondaryButton>
            <DashboardPrimaryButton className="px-4">
              <FileBarChart2 size={13} strokeWidth={2.2} />
              Generate Report
            </DashboardPrimaryButton>
          </div>
        </header>

        <section
          aria-label="Payment metrics"
          className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4"
        >
          {paymentMetrics.map((metric) => (
            <PaymentMetricCard key={metric.title} metric={metric} />
          ))}
        </section>

        <DashboardPanel className="rounded-[8px]">
          <div className="border-b border-[#e6ebf3] px-5 py-4">
            <h2 className="text-[16px] font-bold leading-6 text-[#202b3d]">Transaction History</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <DashboardSearchField
                placeholder="Search transactions..."
                className="h-9 min-w-[280px] flex-1"
              />
              <PaymentDropdown
                label="All Status"
                options={statusFilterOptions}
                className="min-w-[124px]"
              />
              <PaymentDropdown
                label="All Dates"
                options={dateFilterOptions}
                className="min-w-[124px]"
              />
              <PaymentDropdown
                label="Sort by Amount"
                options={sortFilterOptions}
                className="min-w-[136px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="ui-table min-w-[980px] table-fixed">
              <thead>
                <tr className="ui-table-head h-[42px] text-left">
                  <th className="w-[12%] px-5 text-[9px]">Date</th>
                  <th className="w-[12%] px-4 text-[9px]">Task ID</th>
                  <th className="w-[18%] px-4 text-[9px]">Task Poster</th>
                  <th className="w-[20%] px-4 text-[9px]">Task Provider</th>
                  <th className="w-[12%] px-4 text-[9px]">Amount</th>
                  <th className="w-[12%] px-4 text-[9px]">Commission</th>
                  <th className="w-[10%] px-4 text-[9px]">Status</th>
                  <th className="w-[6%] px-5 text-right text-[9px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.taskId} className="ui-table-row h-[54px]">
                    <td className="px-5 text-[11px] font-medium text-[#64748b]">{transaction.date}</td>
                    <td className="px-4 text-[12px] font-bold text-[#1f2937]">{transaction.taskId}</td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <Avatar
                          initials={transaction.poster.initials}
                          className={transaction.poster.avatarClass}
                        />
                        <span className="truncate text-[12px] font-medium text-[#334155]">
                          {transaction.poster.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <Avatar
                          initials={transaction.provider.initials}
                          className={transaction.provider.avatarClass}
                        />
                        <span className="truncate text-[12px] font-medium text-[#334155]">
                          {transaction.provider.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-[12px] font-bold text-[#1f2937]">{transaction.amount}</td>
                    <td className="px-4 text-[12px] font-medium text-[#334155]">{transaction.commission}</td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn('status-badge', statusClass[transaction.status])}>
                          {transaction.status}
                        </span>
                        {transaction.note ? (
                          <span className="text-[9px] font-bold text-[#ef4444]">{transaction.note}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5">
                      <button
                        type="button"
                        aria-label={`View payment ${transaction.taskId}`}
                        onClick={() => setSelectedPaymentId(transaction.taskId)}
                        className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-[#eef2ff] hover:text-[#2563eb]"
                      >
                        <Eye size={14} strokeWidth={2.1} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f7] px-5 py-4">
            <p className="text-[11px] font-medium text-[#64748b]">Showing 1 to 5 of 1,248 entries</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-8 rounded-[5px] border border-[#dbe4ef] px-3 text-[11px] font-medium text-[#94a3b8]"
              >
                Previous
              </button>
              <button
                type="button"
                aria-current="page"
                className="h-8 min-w-8 rounded-[5px] bg-[#2563eb] px-3 text-[11px] font-bold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="h-8 min-w-8 rounded-[5px] border border-[#dbe4ef] px-3 text-[11px] font-medium text-[#475569]"
              >
                2
              </button>
              <button
                type="button"
                className="h-8 min-w-8 rounded-[5px] border border-[#dbe4ef] px-3 text-[11px] font-medium text-[#475569]"
              >
                3
              </button>
              <span className="px-2 text-[11px] font-bold text-[#94a3b8]">...</span>
              <button
                type="button"
                className="h-8 rounded-[5px] border border-[#dbe4ef] px-3 text-[11px] font-medium text-[#475569]"
              >
                Next
              </button>
            </div>
          </footer>
        </DashboardPanel>
      </div>

      {selectedPaymentDetail ? (
        <PaymentDetailsModal
          payment={selectedPaymentDetail}
          onOpenReceipt={() => setSelectedReceiptId(selectedPaymentId)}
          onClose={() => setSelectedPaymentId(null)}
        />
      ) : null}
      {selectedReceipt ? (
        <PaymentReceiptModal
          receipt={selectedReceipt}
          onBack={() => setSelectedReceiptId(null)}
        />
      ) : null}
    </DashboardPageShell>
  );
}
