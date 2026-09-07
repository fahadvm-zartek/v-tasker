import {
  ChevronDown,
} from 'lucide-react';
import { Header, Sidebar } from '../../../components';

type SummaryCard = {
  label: string;
  value: string;
  tone?: 'default' | 'danger';
};

type TimelineEntry = {
  time: string;
  conversationId: string;
  message: string;
  decision: 'Allow' | 'Flag';
  score: number;
  scoreLabel: string;
  risk: 'Low Risk' | 'Medium Risk';
  note: string;
  rules: Array<{
    name: string;
    points: string;
  }>;
  showLog?: boolean;
};

const userSummaryCards: SummaryCard[] = [
  { label: 'Msgs Reviewed', value: '42' },
  { label: 'Flagged', value: '4' },
  { label: 'Blocked', value: '1' },
  { label: 'Highest Risk Score', value: '82', tone: 'danger' },
];

const conversationTimeline: TimelineEntry[] = [
  {
    time: 'Today, 10:02 AM',
    conversationId: 'CNV-88240',
    message: 'Please contact me on WhatsApp.',
    decision: 'Allow',
    score: 25,
    scoreLabel: '25 / 100',
    risk: 'Low Risk',
    note: 'Below the 31-point Flag threshold',
    rules: [{ name: 'SOCIAL_MEDIA', points: '+25' }],
  },
  {
    time: 'Today, 11:47 AM',
    conversationId: 'CNV-88266',
    message: 'Message me on WhatsApp and I will give you my phone number.',
    decision: 'Flag',
    score: 60,
    scoreLabel: '60 / 100',
    risk: 'Medium Risk',
    note: 'Two contact-related rules triggered together',
    rules: [
      { name: 'SOCIAL_MEDIA', points: '+25' },
      { name: 'PHONE_CONTACT_REQUEST', points: '+35' },
    ],
    showLog: true,
  },
];

const riskStyles = {
  'Low Risk': 'bg-[#dcfce7] text-[#0f9f68]',
  'Medium Risk': 'bg-[#ffedd5] text-[#d97706]',
};

const decisionStyles = {
  Allow: 'bg-[#dcfce7] text-[#0f9f68]',
  Flag: 'bg-[#fff0d0] text-[#d97706]',
};

const ActionButton = ({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'green' | 'orange' | 'red' }) => {
  const styles = {
    default: 'border-[#cbd5e1] text-[#536173]',
    green: 'border-[#99f6e4] bg-[#ecfdf5] text-[#0f9f68]',
    orange: 'border-[#fed7aa] bg-[#fff7ed] text-[#d97706]',
    red: 'border-[#fecaca] bg-[#fff5f5] text-[#dc2626]',
  };

  return (
    <button type="button" className={`h-9 rounded-[4px] border px-5 text-[12px] font-medium ${styles[tone]}`}>
      {children}
    </button>
  );
};

const TimelineCard = ({ entry }: { entry: TimelineEntry }) => (
  <section className="rounded-[8px] border border-[#d5deeb] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase text-[#005bd8]">Rahul Sharma</p>
        <p className="mt-1 text-[11px] font-medium text-[#66758b]">
          {entry.time} · {entry.conversationId}
        </p>
      </div>
      <span className={`inline-flex h-6 items-center rounded-[4px] px-3 text-[10px] font-bold uppercase ${decisionStyles[entry.decision]}`}>
        {entry.decision}
      </span>
    </div>

    <p className="mt-4 text-[13px] font-medium leading-6 text-[#1f2937]">{`"${entry.message}"`}</p>

    <div className="mt-5 flex flex-wrap items-center gap-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#1f2937]">
        {entry.score}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[14px] font-bold text-[#111827]">{entry.scoreLabel}</span>
          <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${riskStyles[entry.risk]}`}>{entry.risk}</span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-[#64748b]">{entry.note}</p>
      </div>
    </div>

    <div className="mt-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#64748b]">Triggered Rules</p>
      <div className="mt-2 space-y-2">
        {entry.rules.map((rule) => (
          <div key={rule.name} className="flex h-9 items-center justify-between rounded-[3px] border border-[#d7dce5] bg-[#f1f3f6] px-4 text-[11px] font-medium">
            <span className="text-[#1f2937]">{rule.name}</span>
            <span className="font-bold text-[#1f2937]">{rule.points}</span>
          </div>
        ))}
      </div>
    </div>

    <button type="button" className="mt-4 flex items-center gap-1 text-[12px] font-medium text-[#005bd8]">
      View Detection Details
      <ChevronDown size={13} />
    </button>

    <div className="mt-7 border-t border-[#e5ebf4] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] font-medium text-[#64748b]">Admin Action</p>
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton tone="green">Allow</ActionButton>
          <ActionButton tone={entry.decision === 'Flag' ? 'orange' : 'default'}>Flag</ActionButton>
          <ActionButton tone="red">Block</ActionButton>
        </div>
      </div>
    </div>

    {entry.showLog ? (
      <button type="button" className="mt-5 text-[12px] font-medium text-[#005bd8]">
        View Moderation Log &gt;
      </button>
    ) : null}
  </section>
);

const ChatModerationHistoryPage = () => (
  <div className="app-shell flex min-h-screen bg-[#f7f8fa]">
    <Sidebar />

    <main className="dashboard-main flex-1 pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
      <Header />

      <div className="dashboard-container max-w-[760px] px-4 pb-12 pt-4">
        <section className="rounded-[8px] border border-[#d5deeb] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c7d7ff] text-[13px] font-bold text-[#4867b1]">
              RS
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[15px] font-bold leading-5 text-[#111827]">Rahul Sharma</h1>
                <span className="rounded-[4px] bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#0f9f68]">Active account</span>
              </div>
              <p className="mt-1 text-[11px] font-medium tracking-[0.06em] text-[#64748b]">VTK-10245 · +91 98xxxxx210</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 max-sm:grid-cols-2">
            {userSummaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-[7px] border p-4 ${card.tone === 'danger' ? 'border-[#f4caca] bg-[#fff7f7]' : 'border-[#d5deeb] bg-white'}`}
              >
                <p className={`text-[22px] font-bold leading-7 ${card.tone === 'danger' ? 'text-[#dc2626]' : 'text-[#111827]'}`}>{card.value}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4b5563]">{card.label}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.08em] text-[#536173]">Conversation Timeline</p>

        <div className="mt-5 space-y-4">
          {conversationTimeline.map((entry) => (
            <TimelineCard key={entry.conversationId} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default ChatModerationHistoryPage;
