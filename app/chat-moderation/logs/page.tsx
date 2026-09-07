'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Ban,
  ChevronDown,
  Download,
  Eye,
  FileText,
  ShieldAlert,
  Timer,
  X,
} from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSelectButton,
} from '../../components';

type LogMetricCard = {
  title: string;
  value: string;
  trendLabel: string;
  trend: string;
  helper?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  trendClass: string;
};

type ModerationLogRow = {
  modId: string;
  contentId: string;
  user: string;
  preview: string;
  riskScore: string;
  riskTone: 'danger' | 'warning' | 'success';
  violation: 'HARD VIOLATION' | 'NONE';
  decision: 'BLOCK' | 'FLAG' | 'ALLOW';
  status: string;
  timestamp: string;
  highlighted?: boolean;
};

type ModerationLogDetail = {
  moderationId: string;
  timestamp: string;
  contentId: string;
  userId: string;
  originalContent: string;
  normalizedContent: string;
  triggeredRule: string;
  riskScore: string;
  hardViolation: string;
  finalDecision: string;
};

const logMetricCards: LogMetricCard[] = [
  {
    title: 'Total Log Entries',
    value: '18,204',
    trendLabel: '+12% this week',
    trend: '+12%',
    helper: 'this week',
    icon: FileText,
    iconClass: 'text-[#1B3061]',
    iconWrapClass: 'bg-[#eaf0ff]',
    trendClass: 'text-[#0f9f68]',
  },
  {
    title: 'Hard Violations',
    value: '61',
    trendLabel: '+3 from yesterday',
    trend: '+3',
    helper: 'from yesterday',
    icon: ShieldAlert,
    iconClass: 'text-[#dc2626]',
    iconWrapClass: 'bg-[#fee2e2]',
    trendClass: 'text-[#dc2626]',
  },
  {
    title: 'Admin-Overridden',
    value: '84',
    trendLabel: '+8.4% vs last week',
    trend: '+8.4%',
    helper: 'vs last week',
    icon: Ban,
    iconClass: 'text-[#3159c8]',
    iconWrapClass: 'bg-[#eaf0ff]',
    trendClass: 'text-[#0f9f68]',
  },
  {
    title: 'Avg. Time to Log',
    value: '0.4s',
    trendLabel: '-0.1s optimization',
    trend: '-0.1s',
    helper: 'optimization',
    icon: Timer,
    iconClass: 'text-[#1B3061]',
    iconWrapClass: 'bg-[#eaf0ff]',
    trendClass: 'text-[#0f9f68]',
  },
];

const moderationLogRows: ModerationLogRow[] = [
  {
    modId: '#ML-9921',
    contentId: 'C-8812A',
    user: 'Rahul Sharma',
    preview: '"buy cheap vi..."',
    riskScore: '82 / 100',
    riskTone: 'danger',
    violation: 'HARD VIOLATION',
    decision: 'BLOCK',
    status: 'Closed',
    timestamp: '10:42 AM',
    highlighted: true,
  },
  {
    modId: '#ML-9920',
    contentId: 'C-8811B',
    user: 'Jane Doe',
    preview: 'Image attachment',
    riskScore: '52 / 100',
    riskTone: 'warning',
    violation: 'NONE',
    decision: 'FLAG',
    status: 'Open -- under review',
    timestamp: '10:15 AM',
  },
  {
    modId: '#ML-9919',
    contentId: 'C-8810C',
    user: 'Mike Smith',
    preview: '"Hello everyone..."',
    riskScore: '12 / 100',
    riskTone: 'success',
    violation: 'NONE',
    decision: 'ALLOW',
    status: 'Auto-cleared',
    timestamp: '09:58 AM',
  },
];

const moderationLogDetail: ModerationLogDetail = {
  moderationId: 'MOD-2026-88301',
  timestamp: 'Aug 31, 2026, 1:20 PM IST',
  contentId: 'CNV-88301',
  userId: 'VTK-10245',
  originalContent: 'Dønt pay thru VTASKER, pay me directly pls',
  normalizedContent: 'dont pay through vtasker pay me directly please',
  triggeredRule: 'PAYMENT_BYPASS (+40)',
  riskScore: '82 / 100',
  hardViolation: 'Yes',
  finalDecision: 'BLOCK',
};

const riskToneClass = {
  danger: 'text-[#c81e1e]',
  warning: 'text-[#d89b00]',
  success: 'text-[#0f9f68]',
};

const violationClass = {
  'HARD VIOLATION': 'bg-[#bf1f2c] text-white',
  NONE: 'bg-[#e5e7eb] text-[#4b5563]',
};

const decisionClass = {
  BLOCK: 'bg-[#ffe0df] text-[#dc2626]',
  FLAG: 'bg-[#fff2cf] text-[#d97706]',
  ALLOW: 'bg-[#dcfce7] text-[#0f9f68]',
};

const FilterSelect = ({ label }: { label: string }) => (
  <DashboardSelectButton className="min-w-[132px] text-[12px]">
    <span className="truncate">{label}</span>
    <ChevronDown size={14} className="shrink-0 text-[#536173]" />
  </DashboardSelectButton>
);

const LogMetricCardView = ({ metric }: { metric: LogMetricCard }) => {
  const Icon = metric.icon;
  const TrendIcon = metric.trend.startsWith('-') ? ArrowDown : ArrowUp;

  return (
    <DashboardMetricCard
      title={metric.title}
      value={metric.value}
      icon={Icon}
      iconClass={metric.iconClass}
      iconWrapClass={metric.iconWrapClass}
    >
      <p className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${metric.trendClass}`}>
        <TrendIcon size={12} strokeWidth={2.4} />
        {metric.trend}
        {metric.helper ? <span className="font-medium text-[#66758b]">{metric.helper}</span> : null}
      </p>
    </DashboardMetricCard>
  );
};

const DetailMetaItem = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#4b5563]">{label}</p>
    <p className={`mt-1.5 text-[11px] font-bold ${accent ? 'text-[#1B3061]' : 'text-[#111827]'}`}>{value}</p>
  </div>
);

const AnalysisRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] py-3 text-[12px]">
    <span className="font-medium text-[#536173]">{label}</span>
    {children}
  </div>
);

const ModerationLogDetailModal = ({
  detail,
  onClose,
}: {
  detail: ModerationLogDetail;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/35 p-4 backdrop-blur-[1px]">
    <section className="flex max-h-[calc(100vh-32px)] w-full max-w-[660px] flex-col overflow-hidden rounded-[8px] border border-[#cfd8e6] bg-white shadow-[0_28px_60px_rgba(15,23,42,0.24)]">
      <header className="flex items-center justify-between border-b border-[#e5ebf4] px-5 py-4">
        <h2 className="text-[16px] font-bold leading-6 text-[#111827]">Moderation Log Detail</h2>
        <button
          type="button"
          aria-label="Close moderation log detail"
          onClick={onClose}
          className="text-[#64748b] transition hover:text-[#111827]"
        >
          <X size={18} strokeWidth={2.2} />
        </button>
      </header>

      <div className="space-y-5 overflow-y-auto px-5 py-5">
        <section className="grid gap-x-12 gap-y-5 rounded-[7px] border border-[#d8e1ee] bg-[#f8fafc] p-4 sm:grid-cols-2">
          <DetailMetaItem label="Moderation ID" value={detail.moderationId} />
          <DetailMetaItem label="Timestamp" value={detail.timestamp} />
          <DetailMetaItem label="Content ID" value={detail.contentId} accent />
          <DetailMetaItem label="User ID" value={detail.userId} accent />
        </section>

        <section>
          <h3 className="text-[11px] font-bold leading-5 text-[#111827]">Original Content</h3>
          <div className="mt-2 rounded-[7px] border border-[#fecaca] bg-[#fff7f6] p-4 font-mono text-[12px] leading-5 text-[#dc2626]">
            {`"${detail.originalContent}"`}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold leading-5 text-[#111827]">Normalized Content</h3>
          <div className="mt-2 rounded-[7px] border border-[#d8dde6] bg-[#eef0f3] p-4 font-mono text-[12px] leading-5 text-[#4b5563]">
            {`"${detail.normalizedContent}"`}
          </div>
        </section>

        <section className="border-t border-[#e5e7eb] pt-4">
          <h3 className="text-[11px] font-bold leading-5 text-[#111827]">Rule Engine Analysis</h3>
          <div className="mt-3">
            <AnalysisRow label="Triggered Rules">
              <span className="rounded-[4px] bg-[#b23b00] px-2.5 py-1.5 text-[10px] font-bold tracking-[0.04em] text-white">
                {detail.triggeredRule}
              </span>
            </AnalysisRow>
            <AnalysisRow label="Risk Score">
              <span className="font-bold text-[#4b5563]">
                <span className="text-[#dc2626]">82</span> / 100
              </span>
            </AnalysisRow>
            <AnalysisRow label="Hard Violation">
              <span className="font-bold text-[#dc2626]">{detail.hardViolation}</span>
            </AnalysisRow>
          </div>
        </section>

        <section className="flex items-center justify-between gap-4">
          <h3 className="text-[15px] font-bold text-[#111827]">Final Decision</h3>
          <span className="inline-flex h-8 items-center gap-2 rounded-[5px] bg-[#c81e1e] px-4 text-[11px] font-bold text-white">
            <Ban size={14} strokeWidth={2.2} />
            {detail.finalDecision}
          </span>
        </section>
      </div>
    </section>
  </div>
);

const ModerationLogsPage = () => {
  const [selectedLog, setSelectedLog] = useState<ModerationLogDetail | null>(null);

  return (
    <DashboardPageShell contentClassName="h-[calc(100vh-62px)] overflow-hidden px-5 py-4">
          <div className="flex h-full min-h-0 flex-col gap-4">
            <header className="flex shrink-0 flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[22px] font-bold leading-7 text-[#111827]">Moderation Logs</h1>
                <p className="mt-1 text-[12px] font-medium text-[#4b5563]">
                  A complete, immutable audit trail of every moderation decision made on VTASKER.
                </p>
              </div>

              <DashboardSelectButton className="rounded-[7px] px-4 text-[12px] font-bold">
                <Download size={13} />
                Export CSV
              </DashboardSelectButton>
            </header>

            <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {logMetricCards.map((metric) => (
                <LogMetricCardView key={metric.title} metric={metric} />
              ))}
            </div>

            <DashboardPanel className="flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 space-y-2 border-b border-[#d8e1ee] bg-[#fbfcfe] px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <DashboardSearchField placeholder="Search ID, User..." className="min-w-[220px] flex-1" />
                  <FilterSelect label="Final Decision: All" />
                  <FilterSelect label="Violations: All" />
                  <FilterSelect label="Risk Level: All" />
                  <FilterSelect label="Date Range: Last 7 Days" />
                  <button type="button" className="ml-auto h-8 px-4 text-[12px] font-bold text-[#66758b]">
                    Reset
                  </button>
                  <DashboardPrimaryButton className="px-6 text-[12px]">
                    Apply
                  </DashboardPrimaryButton>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#536173]">
                  <span>Active:</span>
                  {['Hard Violation: Yes', 'Last 7 days'].map((chip) => (
                    <span key={chip} className="rounded-full border border-[#c8d0dc] bg-[#eef1f5] px-2.5 py-0.5 text-[10px] font-bold text-[#374151]">
                      {chip} x
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden shrink-0 grid-cols-[120px_120px_minmax(110px,0.8fr)_minmax(160px,1fr)_120px_150px_110px_170px_120px_80px] bg-[#f4f6f8] lg:grid">
                {['Mod ID', 'Content ID', 'User', 'Content Preview', 'Risk Score', 'Violations', 'Decision', 'Status', 'Timestamp', 'Action'].map((heading) => (
                  <div key={heading} className="px-4 py-3 text-[10px] font-bold text-[#4b5563]">
                    {heading}
                  </div>
                ))}
              </div>

              <div className="min-h-0 flex-1 divide-y divide-[#dfe7f2] overflow-hidden">
                {moderationLogRows.map((row) => (
                  <div
                    key={row.modId}
                    className={`grid gap-2 px-4 py-3 text-[12px] lg:grid-cols-[120px_120px_minmax(110px,0.8fr)_minmax(160px,1fr)_120px_150px_110px_170px_120px_80px] lg:items-center lg:gap-0 ${
                      row.highlighted ? 'bg-[#fff5f5]' : 'bg-white'
                    }`}
                  >
                    <div className="font-medium text-[#536173]">{row.modId}</div>
                    <div className="font-medium text-[#536173]">{row.contentId}</div>
                    <div className="font-bold text-[#111827]">{row.user}</div>
                    <div className="font-medium text-[#4b5563]">{row.preview}</div>
                    <div className={`font-bold ${riskToneClass[row.riskTone]}`}>{row.riskScore}</div>
                    <div>
                      <span className={`inline-flex h-5 items-center rounded-full px-2.5 text-[9px] font-bold ${violationClass[row.violation]}`}>
                        {row.violation}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex h-5 items-center rounded-[4px] px-2.5 text-[9px] font-medium ${decisionClass[row.decision]}`}>
                        {row.decision}
                      </span>
                    </div>
                    <div className={row.status.startsWith('Open') ? 'font-medium text-[#c2410c]' : 'font-medium text-[#4b5563]'}>
                      {row.status}
                    </div>
                    <div className="font-medium text-[#66758b]">{row.timestamp}</div>
                    <div>
                      <button
                        type="button"
                        aria-label={`View ${row.modId}`}
                        onClick={() => setSelectedLog(moderationLogDetail)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] text-[#1B3061] transition hover:bg-[#eef2ff]"
                      >
                        <Eye size={15} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#dfe7f2] px-4 py-3">
                <p className="text-[12px] font-medium text-[#536173]">Showing 1 to 3 of 18,204 entries</p>
                <nav className="flex items-center gap-2 text-[12px] font-medium text-[#536173]" aria-label="Moderation logs pagination">
                  <button type="button" className="h-7 rounded-[4px] border border-[#d9e2ef] px-3 text-[#a0a8b4]">Prev</button>
                  <button type="button" className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#1B3061] bg-[#eef2ff] font-bold text-[#1B3061]">1</button>
                  <button type="button" className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#d9e2ef]">2</button>
                  <button type="button" className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#d9e2ef]">3</button>
                  <span className="px-1">...</span>
                  <button type="button" className="h-7 rounded-[4px] border border-[#d9e2ef] px-3">Next</button>
                </nav>
              </div>
            </DashboardPanel>
          </div>

      {selectedLog ? <ModerationLogDetailModal detail={selectedLog} onClose={() => setSelectedLog(null)} /> : null}
    </DashboardPageShell>
  );
};

export default ModerationLogsPage;
