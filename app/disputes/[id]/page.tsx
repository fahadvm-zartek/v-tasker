import Link from 'next/link';
import {
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  FileImage,
  Percent,
} from 'lucide-react';
import { PayoutModal } from './PayoutModal';
import {
  DashboardPageShell,
  DashboardPanel,
  DashboardSelectButton,
  cn,
  dashboardStatusBadgeClass,
} from '../../components';

type DisputeTab = 'poster' | 'doer';

type DisputeProfile = {
  raisedByLabel: string;
  raisedBy: string;
  raisedByEmail: string;
  againstLabel: string;
  against: string;
  againstEmail: string;
  description: string;
  refundName: string;
  providerName: string;
};

const disputeProfiles: Record<DisputeTab, DisputeProfile> = {
  poster: {
    raisedByLabel: 'Raised By (Task Provider)',
    raisedBy: 'David L.',
    raisedByEmail: 'david.l@techsolutions.com',
    againstLabel: 'Against (Task Poster)',
    against: 'Marcus G.',
    againstEmail: 'marcus.g@example.com',
    description:
      'The deliverable provided does not meet the specifications outlined in the original statement of work. Multiple critical bugs were found in the final build, and the UI elements are misaligned across different screen sizes. I requested revisions, but the provider claims the work is complete according to their interpretation of the brief.',
    refundName: 'Marcus G.',
    providerName: 'David L.',
  },
  doer: {
    raisedByLabel: 'Raised By (Task Provider)',
    raisedBy: 'David L.',
    raisedByEmail: 'david.l@techsolutions.com',
    againstLabel: 'Against (Task Poster)',
    against: 'Marcus G.',
    againstEmail: 'marcus.g@example.com',
    description:
      'The client is requesting additional work not specified in the original brief and has refused to release the milestone payment until these unquoted tasks are completed. I have fulfilled all requirements as per the agreed scope and provided all deliverables on time.',
    refundName: 'Marcus G.',
    providerName: 'David L.',
  },
};

const evidenceFiles = [
  { name: 'original_brief_v1.png', size: '2.1 MB', tone: 'from-[#dbeafe] to-[#fef3c7]' },
  { name: 'project_logs.jpg', size: '1.4 MB', tone: 'from-[#e0f2fe] to-[#f1f5f9]' },
  { name: 'chat_history.jpg', size: '4.2 MB', tone: 'from-[#fee2e2] to-[#fef3c7]' },
];

const activityRows = [
  { time: 'Today, 09:15 AM', text: 'Status changed to Under Review by Alex Mercer', active: true },
  { time: 'Yesterday, 16:45 PM', text: 'Dispute assigned to Alex Mercer' },
  { time: 'Oct 24, 14:30 PM', text: 'Dispute filed by Sarah Jenkins. Status set to New.' },
];

const TabLink = ({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'inline-flex h-8 min-w-[118px] items-center justify-center rounded-[6px] px-4 text-[11px] font-bold transition-colors',
      active ? 'bg-white text-[#0457cf] shadow-[0_1px_4px_rgba(15,23,42,0.08)]' : 'text-[#64748b] hover:text-[#1B3061]',
    )}
  >
    {children}
  </Link>
);

const EvidenceCard = ({ file }: { file: (typeof evidenceFiles)[number] }) => (
  <article className="rounded-[7px] border border-[#dbe4ef] bg-white p-2">
    <div className={cn('flex aspect-[1.15] items-center justify-center rounded-[5px] bg-linear-to-br', file.tone)}>
      <FileImage size={28} strokeWidth={1.9} className="text-[#64748b]" />
    </div>
    <p className="mt-2 truncate text-[10px] font-bold text-[#172033]">{file.name}</p>
    <p className="text-[9px] font-medium text-[#64748b]">{file.size}</p>
  </article>
);

export default async function DisputeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = (await searchParams) ?? {};
  const activeTab = tab === 'doer' ? 'doer' : 'poster';
  const dispute = disputeProfiles[activeTab];
  const disputeId = decodeURIComponent(id).replace(/^#/, '');

  return (
    <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
      <div className="animate-dashboard-entry grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <DashboardPanel className="rounded-[8px] p-5">
            <div className="inline-flex rounded-[7px] bg-[#e8eef9] p-1">
              <TabLink href={`/disputes/${disputeId}`} active={activeTab === 'poster'}>
                Poster Dispute
              </TabLink>
              <TabLink href={`/disputes/${disputeId}?tab=doer`} active={activeTab === 'doer'}>
                Doer Dispute
              </TabLink>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <h1 className="text-[20px] font-bold text-[#202b3d]">Dispute Summary</h1>
              <span className={dashboardStatusBadgeClass('warning')}>Under Review</span>
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">Related Task</dt>
                <dd className="mt-1 text-[12px] font-bold text-[#0457cf]">#TSK-4421</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">Date Filed</dt>
                <dd className="mt-1 text-[12px] font-semibold text-[#172033]">Oct 24, 2023 at 14:30 EST</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">{dispute.againstLabel}</dt>
                <dd className="mt-1 text-[12px] font-bold text-[#172033]">{dispute.against}</dd>
                <dd className="text-[11px] font-medium text-[#64748b]">{dispute.againstEmail}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">{dispute.raisedByLabel}</dt>
                <dd className="mt-1 text-[12px] font-bold text-[#172033]">{dispute.raisedBy}</dd>
                <dd className="text-[11px] font-medium text-[#64748b]">{dispute.raisedByEmail}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">Reason Category</dt>
                <dd className="mt-1 text-[12px] font-semibold text-[#172033]">Quality of Work</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72819a]">Complaint Description</dt>
                <dd className="mt-2 rounded-[6px] border border-[#dbe4ef] bg-[#f8fafc] p-4 text-[12px] font-medium leading-5 text-[#334155]">
                  {dispute.description}
                </dd>
              </div>
            </dl>
          </DashboardPanel>

          <DashboardPanel className="rounded-[8px] p-5">
            <h2 className="text-[18px] font-bold text-[#202b3d]">Evidence & Attachments</h2>
            <div className="mt-4 grid grid-cols-3 gap-4 max-sm:grid-cols-1">
              {evidenceFiles.map((file) => (
                <EvidenceCard key={file.name} file={file} />
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel className="rounded-[8px] p-5">
            <h2 className="text-[18px] font-bold text-[#202b3d]">Activity Log</h2>
            <ol className="mt-5 space-y-4">
              {activityRows.map((item) => (
                <li key={item.text} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
                  <span className="relative flex justify-center">
                    <span className={cn('mt-1 h-3 w-3 rounded-full', item.active ? 'bg-[#0457cf]' : 'bg-[#dbe4ef]')} />
                  </span>
                  <div>
                    <p className="text-[10px] font-medium text-[#64748b]">{item.time}</p>
                    <p className="mt-1 text-[12px] font-medium text-[#172033]">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </DashboardPanel>
        </div>

        <DashboardPanel className="h-fit rounded-[8px] p-5">
          <h2 className="border-b border-[#e6ebf3] pb-5 text-[20px] font-bold text-[#202b3d]">Admin Actions</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[10px] font-semibold text-[#64748b]">Current Status</span>
              <DashboardSelectButton className="mt-1 h-10 w-full">Under Review</DashboardSelectButton>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-[#64748b]">Assign Admin</span>
              <DashboardSelectButton className="mt-1 h-10 w-full">Alex Mercer (You)</DashboardSelectButton>
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-[#64748b]">Resolution Notes (Internal)</span>
              <textarea
                placeholder="Add notes for internal record..."
                className="mt-1 h-20 w-full resize-none rounded-[6px] border border-[#dbe4ef] bg-white px-3 py-2 text-[12px] font-medium text-[#172033] outline-hidden placeholder:text-[#94a3b8] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
              />
            </label>
          </div>

          <section className="mt-6">
            <h3 className="text-[13px] font-bold text-[#334155]">Payout Distribution</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3 rounded-[8px] border-2 border-[#60a5fa] bg-[#dbeafe] p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2563eb]">
                  <CircleDollarSign size={18} strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#334155]">Refund Customer</p>
                  <p className="text-[11px] font-medium text-[#475569]">{dispute.refundName}</p>
                </div>
                <Percent size={13} strokeWidth={2.2} className="text-[#334155]" />
                <DashboardSelectButton className="h-8 w-[78px] bg-white font-bold text-[#0457cf]">60.00</DashboardSelectButton>
              </div>
              <div className="flex items-center gap-3 rounded-[8px] border border-[#dbe4ef] bg-white p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b]">
                  <Banknote size={18} strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#334155]">Pay Provider</p>
                  <p className="text-[11px] font-medium text-[#475569]">{dispute.providerName}</p>
                </div>
                <Percent size={13} strokeWidth={2.2} className="text-[#334155]" />
                <DashboardSelectButton className="h-8 w-[78px] bg-white font-bold">20.00</DashboardSelectButton>
              </div>
              <div className="flex items-center gap-3 rounded-[8px] border border-[#dbe4ef] bg-white p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b]">
                  <Percent size={18} strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#334155]">V Tasker Commission</p>
                  <p className="text-[11px] font-medium text-[#475569]">Platform Fee</p>
                </div>
                <Percent size={13} strokeWidth={2.2} className="text-[#334155]" />
                <DashboardSelectButton className="h-8 w-[78px] bg-white font-bold">20.00</DashboardSelectButton>
              </div>
            </div>
          </section>

          <div className="mt-5 space-y-4">
            <PayoutModal refundName={dispute.refundName} providerName={dispute.providerName} />
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#b8c1cc] text-[12px] font-bold text-white"
            >
              <CheckCircle2 size={14} strokeWidth={2.2} />
              Mark as Resolved
            </button>
          </div>
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
