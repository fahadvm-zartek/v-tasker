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
import { useEffect, useState } from 'react';
import {
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPagination,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSecondaryButton,
  DashboardTableShell,
  cn,
} from '../../../components';
import { fetchAllWallets, fetchWithdrawalsPage, approveWithdrawal, rejectWithdrawal } from '../../../services/paymentService';

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
  id?: string;
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
      { title: 'Escrow Lock', date: 'Oct 24, 2023', time: '02:46 PM', state: 'pending' },
      { title: 'Funds Captured', date: 'Oct 24, 2023', time: '06:10 PM', state: 'pending' },
      { title: 'Disbursed to Provider', date: 'Oct 24, 2023', time: '06:12 PM', state: 'pending' },
      { title: 'Payout Settled (Bank)', date: 'Oct 25, 2023', time: '10:00 AM', state: 'pending' },
    ],
    paymentMethod: {
      card: 'Visa ending in 4242',
      expiry: '12/26',
    },
  },
};

const paymentReceipts: Record<string, PaymentReceipt> = {
  '#TSK-8824': {
    id: '#REC-8824',
    issuedOn: 'Oct 24, 2023',
    title: 'Premium Site Inspection',
    total: '$150.00 AUD',
    postedBy: 'Sarah Mitchell',
    receiptLines: [
      { label: 'Base Fee', value: '$136.36' },
      { label: 'GST (10%)', value: '$13.64' },
      { label: 'Gross Total', value: '$150.00 AUD' },
    ],
    netEarnings: '$135.00 AUD',
    businessName: 'V-Tasker Platform Ltd.',
    abn: '12 345 678 910',
    taxLines: [
      { label: 'Platform Commission (10%)', value: '$15.00 AUD' },
      { label: 'Tax Included in Commission', value: '$1.36 AUD' },
    ],
    taxTotal: '$15.00 AUD',
  },
};

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [receiptTaskId, setReceiptTaskId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [walletRes, withdrawalRes] = await Promise.all([
        fetchAllWallets().catch(() => null),
        fetchWithdrawalsPage({ search, pageSize: 20 }).catch(() => null),
      ]);

      if (walletRes) setWallets(Array.isArray(walletRes) ? walletRes : (walletRes as any).results || []);
      if (withdrawalRes && withdrawalRes.withdrawals) {
        setWithdrawals(withdrawalRes.withdrawals);
      }
    } catch (err) {
      console.error('Failed to load payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await approveWithdrawal(id);
      await loadData();
    } catch (err: any) {
      alert(`Error approving withdrawal: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await rejectWithdrawal(id, reason);
      await loadData();
    } catch (err: any) {
      alert(`Error rejecting withdrawal: ${err?.message || 'Unknown error'}`);
    }
  };

  const totalWalletBalance = wallets.reduce((acc: number, w: any) => acc + (parseFloat(w.balance) || 0), 0);
  const totalGross = totalWalletBalance > 0 ? `$${totalWalletBalance.toFixed(2)}` : '$125,400';

  const paymentMetrics: PaymentMetric[] = [
    { title: 'Gross Revenue', value: totalGross, trend: '+12.5% this month', trendDirection: 'up', trendTone: 'positive', icon: ReceiptText, tone: 'blue' },
    { title: 'Commission', value: '$18,810', trend: '+8.2% this month', trendDirection: 'up', trendTone: 'positive', icon: Percent, tone: 'blue' },
    { title: 'Net Revenue', value: '$106,590', trend: '+14.1% this month', trendDirection: 'up', trendTone: 'positive', icon: WalletCards, tone: 'green' },
    { title: 'Rejection Rate', value: '3.2%', trend: '+0.5% this month', trendDirection: 'up', trendTone: 'negative', icon: Ban, tone: 'red' },
    { title: 'Cancellations', value: '$4,250', trend: '+2.4% this month', trendDirection: 'up', trendTone: 'negative', icon: CircleDollarSign, tone: 'amber' },
    { title: 'Refunds', value: '$1,890', trend: '-1.1% this month', trendDirection: 'down', trendTone: 'positive', icon: RefreshCcw, tone: 'rose' },
  ];

  const mappedTransactions: Transaction[] = withdrawals.map((w: any) => {
    const name = w.user?.full_name || w.user_name || 'User';
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    return {
      id: String(w.id),
      date: w.created_at ? new Date(w.created_at).toLocaleDateString() : 'N/A',
      taskId: w.task ? `#TSK-${w.task}` : `#WDR-${w.id}`,
      poster: { name, initials, avatarClass: 'bg-[#eef2ff] text-[#1B3061]' },
      provider: { name: w.bank_name || 'Withdrawal Account', initials: 'BK', avatarClass: 'bg-[#e5e7eb] text-[#334155]' },
      amount: w.amount ? `$${parseFloat(w.amount).toFixed(2)}` : '$0.00',
      commission: '$0.00',
      status: w.status === 'APPROVED' ? 'Paid' : w.status === 'REJECTED' ? 'Rejected' : 'Pending',
    };
  });

  const defaultTransactions: Transaction[] = [
    { date: '24 Oct 2024', taskId: '#TSK-8824', poster: { name: 'Sarah Mitchell', initials: 'SM', avatarClass: 'bg-[#eef2ff] text-[#1B3061]' }, provider: { name: 'Alexander Sterling', initials: 'AS', avatarClass: 'bg-[#e5e7eb] text-[#334155]' }, amount: '$150.00', commission: '$15.00', status: 'Paid' },
    { date: '24 Oct 2024', taskId: '#TSK-8823', poster: { name: 'James Davis', initials: 'JD', avatarClass: 'bg-[#dbeafe] text-[#2563eb]' }, provider: { name: 'Maria Garcia', initials: 'MG', avatarClass: 'bg-[#e5e7eb] text-[#334155]' }, amount: '$85.50', commission: '$8.55', status: 'Pending', note: '30 Days' },
    { date: '23 Oct 2024', taskId: '#TSK-8819', poster: { name: 'Robert Chen', initials: 'RC', avatarClass: 'bg-[#e5e7eb] text-[#64748b]' }, provider: { name: 'Emma Wilson', initials: 'EW', avatarClass: 'bg-[#e5e7eb] text-[#334155]' }, amount: '$420.00', commission: '$42.00', status: 'Processing' },
    { date: '23 Oct 2024', taskId: '#TSK-8795', poster: { name: 'Olivia Thompson', initials: 'OT', avatarClass: 'bg-[#e5e7eb] text-[#64748b]' }, provider: { name: 'William Baker', initials: 'WB', avatarClass: 'bg-[#eef2ff] text-[#2563eb]' }, amount: '$65.00', commission: '$6.50', status: 'Refunded' },
    { date: '23 Oct 2024', taskId: '#TSK-8790', poster: { name: 'David Kim', initials: 'DK', avatarClass: 'bg-[#e5e7eb] text-[#64748b]' }, provider: { name: 'Sophia Lee', initials: 'SL', avatarClass: 'bg-[#e5e7eb] text-[#334155]' }, amount: '$115.00', commission: '$11.50', status: 'Rejected' },
  ];

  const displayTransactions = mappedTransactions.length > 0 ? mappedTransactions : defaultTransactions;
  const filteredTransactions = selectedStatus === 'All' ? displayTransactions : displayTransactions.filter(t => t.status === selectedStatus);

  const activeDetail = selectedTransactionId ? (paymentDetails[selectedTransactionId] || paymentDetails['#TSK-8824']) : null;
  const activeReceipt = receiptTaskId ? (paymentReceipts[receiptTaskId] || paymentReceipts['#TSK-8824']) : null;

  return (
    <DashboardPageShell contentClassName="px-0 pb-10 pt-0">
      <div className="animate-dashboard-entry">
        <DashboardPageHeader title="Payments & Earnings" className="border-b border-[#dfe6f0] pb-2 pt-4" />

        <section aria-label="Payment metrics" className="mt-5 grid grid-cols-6 gap-4 max-2xl:grid-cols-3 max-md:grid-cols-1">
          {paymentMetrics.map((metric) => {
            const tone = metricToneClasses[metric.tone];
            const TrendIcon = metric.trendDirection === 'up' ? TrendingUp : TrendingDown;
            const trendColor = metric.trendTone === 'positive' ? 'text-[#10b981]' : 'text-[#ef4444]';

            return (
              <div key={metric.title} className="rounded-[8px] border border-[#dbe4ef] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">{metric.title}</span>
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', tone.iconWrap)}>
                    <metric.icon size={16} strokeWidth={2.1} className={tone.icon} />
                  </span>
                </div>
                <p className="mt-2 text-[22px] font-bold text-[#172033]">{metric.value}</p>
                <p className={cn('mt-1 flex items-center gap-1 text-[10px] font-bold', trendColor)}>
                  <TrendIcon size={12} strokeWidth={2.2} />
                  {metric.trend}
                </p>
              </div>
            );
          })}
        </section>

        <DashboardTableShell className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf3] px-4 py-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#202b3d]">Transaction & Withdrawal History</h2>
              <p className="mt-1 text-[11px] font-medium text-[#64748b]">Monitor escrow payouts, withdraw requests, and platform commission.</p>
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
              placeholder="Search Task ID, Poster, Provider..." 
              className="min-w-[280px] flex-1" 
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-[#72819a]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 rounded-[6px] border border-[#dbe4ef] bg-white px-2 text-[11px] font-medium text-[#172033]"
              >
                {statusFilterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="ui-table min-w-[1040px] table-fixed">
              <thead>
                <tr className="ui-table-head h-[42px] text-left">
                  {['DATE', 'TASK ID', 'TASK POSTER', 'TASK PROVIDER', 'TOTAL AMOUNT', 'COMMISSION (10%)', 'STATUS', 'ACTION'].map((heading) => (
                    <th key={heading} className={cn('px-4 text-[10px]', heading === 'ACTION' ? 'text-right' : '')}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[12px] font-medium text-[#64748b]">Loading payments & withdrawals...</td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, idx) => (
                    <tr key={idx} className="ui-table-row h-[58px]">
                      <td className="px-4 text-[11px] font-medium text-[#64748b]">{tx.date}</td>
                      <td className="px-4 text-[11px] font-bold text-[#1B3061]">{tx.taskId}</td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold', tx.poster.avatarClass)}>
                            {tx.poster.initials}
                          </span>
                          <span className="text-[11px] font-semibold text-[#172033]">{tx.poster.name}</span>
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold', tx.provider.avatarClass)}>
                            {tx.provider.initials}
                          </span>
                          <span className="text-[11px] font-semibold text-[#172033]">{tx.provider.name}</span>
                        </div>
                      </td>
                      <td className="px-4 text-[11px] font-bold text-[#172033]">{tx.amount}</td>
                      <td className="px-4 text-[11px] font-medium text-[#64748b]">{tx.commission}</td>
                      <td className="px-4">
                        <span className={cn('rounded-[4px] px-2 py-0.5 text-[9px] font-bold', statusClass[tx.status])}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {tx.status === 'Pending' && tx.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveWithdrawal(tx.id!)}
                                className="inline-flex h-7 items-center justify-center rounded-[4px] bg-[#10b981] px-2 text-[10px] font-bold text-white hover:bg-[#059669]"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectWithdrawal(tx.id!)}
                                className="inline-flex h-7 items-center justify-center rounded-[4px] bg-[#ef4444] px-2 text-[10px] font-bold text-white hover:bg-[#dc2626]"
                              >
                                Reject
                              </button>
                            </>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setSelectedTransactionId(tx.taskId)}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-[4px] border border-[#dbe4ef] px-2 text-[10px] font-bold text-[#1B3061] hover:bg-[#f8fafc]"
                          >
                            <Eye size={12} />
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setReceiptTaskId(tx.taskId)}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-[4px] border border-[#dbe4ef] px-2 text-[10px] font-bold text-[#64748b] hover:bg-[#f8fafc]"
                          >
                            <FileBarChart2 size={12} />
                            Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-[#e6ebf3] px-4 py-4 text-[11px] font-medium text-[#64748b]">
            <span>Showing {filteredTransactions.length} transaction entries</span>
            <DashboardPagination pages={['1']} label="Payment pagination" />
          </footer>
        </DashboardTableShell>

        {/* Payment Detail Modal */}
        {activeDetail ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4">
            <div className="w-full max-w-[540px] overflow-hidden rounded-[8px] border border-[#dbe4ef] bg-white shadow-xl">
              <header className="flex items-center justify-between border-b border-[#e6ebf3] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#202b3d]">Transaction Detail - {activeDetail.taskId}</h3>
                  <p className="text-[11px] font-medium text-[#64748b]">{activeDetail.taskDescription}</p>
                </div>
                <button type="button" onClick={() => setSelectedTransactionId(null)} className="text-[#64748b] hover:text-[#172033]">
                  <X size={18} />
                </button>
              </header>
              <div className="p-5 space-y-4 text-[12px]">
                <div className="flex justify-between border-b border-[#e6ebf3] pb-3">
                  <span className="font-bold text-[#64748b]">Total Amount:</span>
                  <span className="font-bold text-[#172033]">{activeDetail.totalAmount}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#72819a]">POSTER</p>
                    <p className="font-bold text-[#172033]">{activeDetail.poster.name}</p>
                    <p className="text-[10px] text-[#64748b]">{activeDetail.poster.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#72819a]">PROVIDER</p>
                    <p className="font-bold text-[#172033]">{activeDetail.provider.name}</p>
                    <p className="text-[10px] text-[#64748b]">{activeDetail.provider.id}</p>
                  </div>
                </div>
              </div>
              <footer className="border-t border-[#e6ebf3] bg-[#f8fafc] px-5 py-3 text-right">
                <DashboardSecondaryButton onClick={() => setSelectedTransactionId(null)}>Close</DashboardSecondaryButton>
              </footer>
            </div>
          </div>
        ) : null}

        {/* Receipt Modal */}
        {activeReceipt ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4">
            <div className="w-full max-w-[480px] overflow-hidden rounded-[8px] border border-[#dbe4ef] bg-white shadow-xl">
              <header className="flex items-center justify-between border-b border-[#e6ebf3] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#202b3d]">Payment Receipt {activeReceipt.id}</h3>
                  <p className="text-[11px] font-medium text-[#64748b]">Issued on {activeReceipt.issuedOn}</p>
                </div>
                <button type="button" onClick={() => setReceiptTaskId(null)} className="text-[#64748b] hover:text-[#172033]">
                  <X size={18} />
                </button>
              </header>
              <div className="p-5 space-y-3 text-[12px]">
                {activeReceipt.receiptLines.map((line, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#f1f5f9] pb-2">
                    <span className="text-[#64748b]">{line.label}</span>
                    <span className="font-bold text-[#172033]">{line.value}</span>
                  </div>
                ))}
              </div>
              <footer className="border-t border-[#e6ebf3] bg-[#f8fafc] px-5 py-3 flex justify-between">
                <DashboardSecondaryButton onClick={() => window.print()} className="gap-1">
                  <Printer size={13} /> Print
                </DashboardSecondaryButton>
                <DashboardSecondaryButton onClick={() => setReceiptTaskId(null)}>Close</DashboardSecondaryButton>
              </footer>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardPageShell>
  );
}
