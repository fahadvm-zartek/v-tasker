'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  Info,
  Lock,
  MessageCircle,
  Paperclip,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel, cn } from '../../components';

type TaskDetailStatus = 'inProgress' | 'dispute' | 'cancelled';
type TaskDetailTab = 'offers' | 'questions';
type TimelineTone = 'done' | 'active' | 'danger' | 'pending';

type TimelineItem = {
  title: string;
  time: string;
  detail: string;
  tone: TimelineTone;
  note?: string;
};

type ProviderOffer = {
  name: string;
  slug: string;
  initials: string;
  rating: string;
  bid: string;
  serviceAmount: string;
  commission: string;
  otherFees: string;
  payout: string;
  state?: 'accepted' | 'dispute';
};

type TaskQuestion = {
  author: string;
  initials: string;
  question: string;
  timestamp: string;
  likes?: number;
  reply?: {
    author: string;
    initials: string;
    text: string;
    timestamp: string;
    moderated?: boolean;
  };
};

const defaultTimeline: TimelineItem[] = [
  {
    title: 'Task Posted',
    time: 'Jun 12, 9:00 AM',
    detail: 'Customer published the request.',
    tone: 'done',
  },
  {
    title: 'Offer Received',
    time: 'Jun 12, 10:15 AM',
    detail: '3 providers submitted bids.',
    tone: 'done',
  },
  {
    title: 'Provider Assigned',
    time: 'Jun 12, 11:30 AM',
    detail: 'Mike T. was selected.',
    tone: 'done',
  },
  {
    title: 'In Progress',
    time: 'Today, 2:00 PM',
    detail: 'Mike T. has started the cleaning session.',
    tone: 'active',
    note: 'Mike T. has started the cleaning session.',
  },
  {
    title: 'Completed',
    time: 'Pending',
    detail: '',
    tone: 'pending',
  },
];

const disputeTimeline: TimelineItem[] = [
  {
    title: 'Task Posted',
    time: 'Jun 12, 9:00 AM',
    detail: 'Customer published the request.',
    tone: 'done',
  },
  {
    title: 'Offer Received',
    time: 'Jun 12, 10:15 AM',
    detail: '3 providers submitted bids.',
    tone: 'done',
  },
  {
    title: 'In Progress',
    time: 'Pending',
    detail: '',
    tone: 'pending',
  },
  {
    title: 'Completed',
    time: 'Pending',
    detail: '',
    tone: 'pending',
  },
];

const cancelledTimeline: TimelineItem[] = [
  {
    title: 'Task Posted',
    time: 'Jun 12, 9:00 AM',
    detail: 'Customer published the request.',
    tone: 'done',
  },
  {
    title: 'Offer Received',
    time: 'Jun 12, 10:15 AM',
    detail: '3 providers submitted bids.',
    tone: 'done',
  },
  {
    title: 'Cancelled',
    time: 'Jun 13, 2:50 PM',
    detail: '',
    tone: 'danger',
  },
];

const taskStatusConfig: Record<TaskDetailStatus, {
  label: string;
  badgeClassName: string;
  dotClassName: string;
  timeline: TimelineItem[];
  showViewerCount: boolean;
}> = {
  inProgress: {
    label: 'In Progress',
    badgeClassName: 'bg-[#dbeafe] text-[#2563eb]',
    dotClassName: 'bg-[#2563eb]',
    timeline: defaultTimeline,
    showViewerCount: true,
  },
  dispute: {
    label: 'Open / In Dispute',
    badgeClassName: 'border border-[#fecaca] bg-[#fee2e2] text-[#dc2626]',
    dotClassName: 'bg-[#dc2626]',
    timeline: disputeTimeline,
    showViewerCount: false,
  },
  cancelled: {
    label: 'Cancelled',
    badgeClassName: 'bg-[#fee2e2] text-[#dc2626]',
    dotClassName: 'bg-[#dc2626]',
    timeline: cancelledTimeline,
    showViewerCount: false,
  },
};

const getTaskDetailStatus = (id: string, statusParam?: string | null): TaskDetailStatus => {
  const requestedStatus = statusParam?.toLowerCase() ?? '';

  if (requestedStatus.includes('dispute')) {
    return 'dispute';
  }

  if (requestedStatus.includes('cancelled')) {
    return 'cancelled';
  }

  const normalizedId = decodeURIComponent(id).replace(/^#/, '');

  if (normalizedId === 'TSK-4423') {
    return 'dispute';
  }

  if (normalizedId === 'TSK-4424') {
    return 'cancelled';
  }

  return 'inProgress';
};

const providerOffers: ProviderOffer[] = [
  {
    name: 'Mike T.',
    slug: 'mike-t',
    initials: 'MT',
    rating: '4.9 (124)',
    bid: '$120',
    serviceAmount: '$100.00',
    commission: '-$10.00',
    otherFees: '-$5.00',
    payout: '$105.00',
    state: 'accepted',
  },
  {
    name: 'Sarah J.',
    slug: 'sarah-j',
    initials: 'SJ',
    rating: '4.7 (89)',
    bid: '$135',
    serviceAmount: '$112.50',
    commission: '-$13.50',
    otherFees: '-$9.00',
    payout: '$112.50',
  },
  {
    name: 'John D.',
    slug: 'john-d',
    initials: 'JD',
    rating: '4.5 (42)',
    bid: '$110',
    serviceAmount: '$91.67',
    commission: '-$11.00',
    otherFees: '-$7.33',
    payout: '$91.67',
  },
];

const taskQuestions: TaskQuestion[] = [
  {
    author: 'Samantha Taylor',
    initials: 'ST',
    question: 'Do you have green waste bins on site, or do I need to take the cuttings with me to the tip?',
    timestamp: '2 HOURS AGO',
    likes: 1,
    reply: {
      author: 'Marcus G.',
      initials: 'MG',
      text: "I have one green bin, but if there's a lot of waste, you might need to take the overflow. Happy to adjust the budget if you need to tip it. Also i can pay directly !",
      timestamp: '1 HOUR AGO',
      moderated: true,
    },
  },
  {
    author: 'Maria Rivera',
    initials: 'MR',
    question: 'Is there parking available for a large van, or should I plan for street parking?',
    timestamp: '30 MINS AGO',
  },
  {
    author: 'David Lawson',
    initials: 'DL',
    question: "Are the hedges taller than 3 meters? Just checking if I'll need my extension ladder.",
    timestamp: '4 HOURS AGO',
  },
];

const TimelineMarker = ({ tone }: { tone: TimelineTone }) => {
  if (tone === 'done') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
        <Check size={14} strokeWidth={2.4} />
      </span>
    );
  }

  if (tone === 'active') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbeafe] text-[#2563eb]">
        <Circle size={8} fill="currentColor" strokeWidth={0} />
      </span>
    );
  }

  if (tone === 'danger') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#fecaca] bg-[#fff1f1] text-[#dc2626]">
        <X size={13} strokeWidth={2.4} />
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5e0ee] text-[#cbd5e1]">
      <Circle size={8} strokeWidth={2} />
    </span>
  );
};

const ProviderAvatar = ({ initials }: { initials: string }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8edf4] text-[11px] font-bold text-[#334155]">
    {initials}
  </span>
);

const DeleteTaskConfirmationModal = ({
  displayId,
  onClose,
}: {
  displayId: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 py-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
      className="w-full max-w-[630px] overflow-hidden rounded-[12px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
    >
      <div className="flex gap-6 px-9 pb-7 pt-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[#fee2e2] text-[#dc2626]">
          <AlertTriangle size={30} strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <h2 id="delete-task-title" className="text-[26px] font-bold leading-8 text-[#111827]">
            Delete Task
          </h2>
          <p className="mt-4 max-w-[460px] text-[22px] font-medium leading-8 text-[#374151]">
            Are you sure you want to delete Task {displayId}? This action cannot be undone and all associated offers and discussions will be permanently removed.
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-end gap-7 bg-[#f5f7fb] px-9 py-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center justify-center rounded-[6px] px-5 text-[16px] font-bold text-[#374151] transition-colors hover:bg-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#dc2626] px-7 text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(220,38,38,0.18)] transition-colors hover:bg-[#b91c1c]"
        >
          <Trash2 size={18} strokeWidth={2.2} />
          Delete Permanently
        </button>
      </footer>
    </section>
  </div>
);

const FeeAdjustmentReviewModal = ({
  displayId,
  onClose,
}: {
  displayId: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6 backdrop-blur-[1px]">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="fee-adjustment-review-title"
      className="w-full max-w-[1080px] overflow-hidden rounded-[10px] border border-[#d8e0ec] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
    >
      <header className="flex h-[94px] items-center justify-between border-b border-[#e4eaf2] px-9">
        <h2 id="fee-adjustment-review-title" className="text-[27px] font-bold leading-8 text-[#172033]">
          Fee Adjustment Review
        </h2>
        <button
          type="button"
          aria-label="Close fee adjustment review"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#f4f6f9] hover:text-[#172033]"
        >
          <X size={28} strokeWidth={1.8} />
        </button>
      </header>

      <div className="space-y-7 px-9 py-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,0.55fr)]">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#64748b]">Task ID</p>
            <p className="mt-2 text-[18px] font-medium leading-6 text-[#0057d9]">{displayId}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#64748b]">Service</p>
            <p className="mt-2 text-[18px] font-medium leading-6 text-[#111827]">House Cleaning &mdash; 3BR</p>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#64748b]">Provider</p>
            <div className="mt-2 flex items-center gap-3">
              <ProviderAvatar initials="MT" />
              <p className="text-[18px] font-bold text-[#111827]">Mike T.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[6px] border border-[#d9e2f2] bg-[#eef3ff] px-6 py-5">
          <p className="flex items-center gap-2 text-[15px] font-medium text-[#64748b]">
            <Info size={16} strokeWidth={2.1} />
            Adjustment Reason
          </p>
          <p className="mt-3 text-[18px] font-medium italic leading-7 text-[#1f2937]">
            &quot;Encountered unexpected mold in the primary bathroom requiring specialized cleaning solutions and an additional 45 minutes of labor.&quot;
          </p>
        </div>

        <div>
          <h3 className="text-[16px] font-medium text-[#111827]">Price Breakdown Comparison</h3>
          <div className="mt-4 grid gap-7 lg:grid-cols-2">
            <section className="rounded-[10px] border border-[#dbe4ef] bg-white px-7 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <h4 className="border-b border-[#e6ebf3] pb-5 text-[15px] font-medium uppercase tracking-[0.12em] text-[#64748b]">
                Current Bid
              </h4>
              <dl className="space-y-4 py-5 text-[17px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748b]">Service Amount</dt>
                  <dd className="font-medium text-[#334155]">$100.00</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-[#dbe4ef] pb-4">
                  <dt className="text-[#64748b]">Commission (10%)</dt>
                  <dd className="font-medium text-[#64748b]">-$10.00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-[#111827]">Provider Payout</dt>
                  <dd className="font-medium text-[#111827]">$90.00</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[10px] border border-[#93c5fd] bg-[#f8fbff] px-7 py-6 shadow-[inset_4px_0_0_#3b82f6]">
              <div className="flex items-start justify-between gap-4 border-b border-[#dbeafe] pb-5">
                <h4 className="text-[15px] font-bold uppercase leading-5 tracking-[0.08em] text-[#3b82f6]">
                  Requested Payment Increase
                </h4>
                <span className="rounded-full bg-[#dbeafe] px-5 py-2 text-[13px] font-medium text-[#2563eb]">
                  + $15.00
                </span>
              </div>
              <dl className="space-y-4 py-5 text-[17px]">
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-[#111827]">Service Amount</dt>
                  <dd className="font-bold text-[#111827]">$115.00</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-[#dbe4ef] pb-4">
                  <dt className="text-[#64748b]">Commission (10%)</dt>
                  <dd className="font-medium text-[#64748b]">-$11.50</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-[#3b82f6]">Provider Payout</dt>
                  <dd className="font-bold text-[#3b82f6]">$103.50</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>

      <footer className="flex justify-end border-t border-[#e4eaf2] bg-white px-9 py-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#2563eb] px-7 text-[16px] font-medium text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-colors hover:bg-[#1d4ed8]"
        >
          <CheckCircle2 size={19} strokeWidth={2.2} />
          Approve Adjustment
        </button>
      </footer>
    </section>
  </div>
);

const ProviderOfferCard = ({
  offer,
  taskId,
  onReviewFeeAdjustment,
}: {
  offer: ProviderOffer;
  taskId: string;
  onReviewFeeAdjustment: () => void;
}) => (
  <article
    className={cn(
      'relative flex min-h-[310px] flex-col rounded-[10px] border bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
      offer.state === 'accepted' ? 'border-[#22c55e]' : offer.state === 'dispute' ? 'border-[#ef4444]' : 'border-[#dce4ef]',
    )}
  >
    {offer.state ? (
      <span
        className={cn(
          'absolute right-3 top-2 rounded-[4px] px-2 py-1 text-[9px] font-bold uppercase text-white',
          offer.state === 'accepted' ? 'bg-[#22c55e]' : 'bg-[#dc2626]',
        )}
      >
        {offer.state === 'accepted' ? 'Accepted' : 'Dispute'}
      </span>
    ) : null}

    <div className="flex items-center gap-3">
      <ProviderAvatar initials={offer.initials} />
      <div>
        <h3 className="text-[13px] font-bold leading-4 text-[#172033]">{offer.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#64748b]">
          <Star size={11} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
          {offer.rating}
        </p>
      </div>
    </div>

    <div className="mt-5 flex items-end justify-between border-t border-[#edf1f6] pt-4">
      <span className="text-[11px] font-medium text-[#64748b]">Total Bid</span>
      <span className="text-[20px] font-bold text-[#172033]">{offer.bid}</span>
    </div>

    <dl className="mt-3 space-y-1.5 rounded-[5px] border border-[#dbe4ef] bg-[#fbfcfe] px-3 py-3 text-[11px]">
      <div className="flex justify-between gap-3">
        <dt className="text-[#64748b]">Service Amt:</dt>
        <dd className="font-medium text-[#172033]">{offer.serviceAmount}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-[#64748b]">Commission (10%):</dt>
        <dd className="font-medium text-[#ef4444]">{offer.commission}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-[#64748b]">Other Fees:</dt>
        <dd className="font-medium text-[#ef4444]">{offer.otherFees}</dd>
      </div>
      <div className="flex justify-between gap-3 border-t border-[#e6ebf3] pt-1.5">
        <dt className="font-bold text-[#172033]">Provider Payout:</dt>
        <dd className="font-bold text-[#172033]">{offer.payout}</dd>
      </div>
    </dl>

    {offer.state === 'accepted' ? (
      <div className="mt-3 flex items-center justify-between rounded-[4px] border border-[#facc15] bg-[#fef9c3] px-2 py-1.5 text-[9px] font-bold text-[#b45309]">
        <span>Fee Adj. Requested</span>
        <button
          type="button"
          onClick={onReviewFeeAdjustment}
          className="text-[#dc2626] underline underline-offset-2"
        >
          Review
        </button>
      </div>
    ) : null}

    <Link
      href={`/tasks/${taskId}/offers/${offer.slug}`}
      className="mt-auto inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dbe4ef] bg-white text-[12px] font-bold text-[#2563eb] transition-colors hover:bg-[#f8fbff]"
    >
      {offer.state ? 'View Details' : 'View Offer'}
    </Link>
  </article>
);

const QuestionAvatar = ({ initials }: { initials: string }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[12px] font-bold text-[#2563eb]">
    {initials}
  </span>
);

const QuestionsSection = () => (
  <DashboardPanel className="overflow-hidden rounded-[8px]">
    <header className="flex h-16 items-center border-b border-[#e6ebf3] px-7">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#172033]">
        Questions
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#172033] px-2 text-[11px] font-bold text-white">
          {taskQuestions.length}
        </span>
      </h2>
    </header>

    <div className="divide-y divide-[#e6ebf3] px-7">
      {taskQuestions.map((item) => (
        <article key={item.author} className="py-6">
          <div className="flex items-start gap-4">
            <QuestionAvatar initials={item.initials} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[13px] font-bold text-[#334155]">{item.author}</h3>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[#64748b]">{item.question}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase text-[#94a3b8]">{item.timestamp}</span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] font-bold uppercase text-[#94a3b8]">
                <button type="button" className="transition-colors hover:text-[#2563eb]">
                  REPLY
                </button>
                {item.likes ? <span>1</span> : null}
              </div>

              {item.reply ? (
                <div className="mt-4 border-l border-[#cbd5e1] pl-5">
                  <div className="flex items-start gap-3">
                    <ProviderAvatar initials={item.reply.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[13px] font-bold text-[#334155]">{item.reply.author}</h4>
                          {item.reply.moderated ? (
                            <span className="rounded-[4px] bg-[#eaf2ff] px-2 py-0.5 text-[9px] font-bold uppercase text-[#2563eb]">
                              MODERATED
                            </span>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-[10px] font-bold uppercase text-[#94a3b8]">{item.reply.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[12px] font-medium italic leading-5 text-[#64748b]">{item.reply.text}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  </DashboardPanel>
);

const DisputeDetails = () => (
  <div className="mt-2 rounded-[8px] border border-[#fecaca] bg-[#fff1f1] p-4 text-[#7f1d1d]">
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-[12px] font-bold text-[#dc2626]">
        <AlertTriangle size={15} strokeWidth={2.2} />
        Dispute #DIS-5022
      </p>
      <span className="rounded-full border border-[#fca5a5] bg-[#fee2e2] px-2 py-0.5 text-[9px] font-bold uppercase text-[#dc2626]">
        REVIEWING
      </span>
    </div>
    <h4 className="mt-5 text-[11px] font-bold text-[#334155]">Reason for Dispute</h4>
    <p className="mt-2 text-[12px] font-medium leading-5 text-[#334155]">
      Provider reported a mismatch between the task description and the actual requirements upon arrival. Mike T. claims the 3BR cleaning requires significantly more time than estimated.
    </p>
    <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-2 border-t border-[#fecaca] pt-4 text-[11px] font-medium text-[#475569]">
      <span className="font-bold text-[#334155]">Date Raised</span>
      <span>June 13, 2023 at 10:45 AM</span>
    </div>
    <button
      type="button"
      className="mt-4 h-10 w-full rounded-[6px] bg-[#b91c1c] text-[12px] font-bold text-white transition-colors hover:bg-[#991b1b]"
    >
      Resolve Dispute
    </button>
  </div>
);

const CancellationDetails = ({ displayId }: { displayId: string }) => (
  <div className="mt-2 rounded-[8px] border border-[#fecaca] bg-[#fee2e2] p-4 text-[#7f1d1d]">
    <p className="flex items-center gap-2 text-[12px] font-bold text-[#dc2626]">
      <AlertTriangle size={15} strokeWidth={2.2} />
      Task Cancelled - {displayId}
    </p>
    <h4 className="mt-5 text-[11px] font-bold text-[#dc2626]">Reason</h4>
    <p className="mt-2 text-[12px] font-medium leading-5 text-[#7f1d1d]">
      Customer requested cancellation due to unexpected severe scheduling conflict. Provider agreed to terms.
    </p>
    <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-2 border-t border-[#fecaca] pt-4 text-[11px] font-medium text-[#7f1d1d]">
      <span className="font-bold text-[#991b1b]">Date Cancelled</span>
      <span>Jun 13, 2023 at 2:30 PM</span>
    </div>
  </div>
);

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [isFeeAdjustmentOpen, setIsFeeAdjustmentOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskDetailTab>('offers');
  const normalizedId = decodeURIComponent(id).replace(/^#/, '');
  const displayId = normalizedId.startsWith('TSK-') ? `#${normalizedId}` : '#TSK-4421';
  const taskStatus = getTaskDetailStatus(id, searchParams.get('status'));
  const status = taskStatusConfig[taskStatus];
  const firstOfferState: ProviderOffer['state'] = taskStatus === 'dispute'
    ? 'dispute'
    : taskStatus === 'inProgress'
      ? 'accepted'
      : undefined;
  const offersForStatus = providerOffers.map((offer, index) => ({
    ...offer,
    state: index === 0 ? firstOfferState : undefined,
  }));

  return (
    <DashboardPageShell contentClassName="px-3 pb-8 pt-5 sm:px-4">
      <div className="animate-dashboard-entry space-y-5">
        <header className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <nav className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]" aria-label="Breadcrumb">
                <Link href="/tasks" className="transition-colors hover:text-[#1B3061]">
                  Tasks
                </Link>
                <span aria-hidden="true">&gt;</span>
                <span>{displayId}</span>
              </nav>

              <div className="mt-3 flex min-w-0 items-center gap-3">
                <Link
                  href="/tasks"
                  aria-label="Back to tasks"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#dbe4ef] bg-white text-[#64748b] transition-colors hover:text-[#1B3061]"
                >
                  <ArrowLeft size={16} strokeWidth={2.2} />
                </Link>
                <h1 className="min-w-0 text-[26px] font-bold leading-8 text-[#111827]">
                  {displayId}: House Cleaning &mdash; 3BR
                </h1>
                <span className={cn('inline-flex h-7 shrink-0 items-center gap-2 rounded-full px-3 text-[12px] font-medium', status.badgeClassName)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', status.dotClassName)} />
                  {status.label}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 pl-11 text-[12px] font-medium text-[#64748b]">
                <span>Customer: <a href="#" className="text-[#2563eb]">Elena Rodriguez</a></span>
                <span className="text-[#cbd5e1]">-</span>
                <span>Location: <span className="text-[#334155]">124 Maple St, Downtown</span></span>
                <span className="text-[#cbd5e1]">-</span>
                <span>Budget: <span className="text-[#334155]">$100.00</span></span>
                {status.showViewerCount ? (
                  <>
                    <span className="text-[#cbd5e1]">-</span>
                    <span>TOTAL TASK VIEWERS: <span className="text-[#334155]">142 views</span></span>
                  </>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDeleteTaskOpen(true)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] bg-[#dc2626] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#b91c1c]"
            >
              <Trash2 size={13} strokeWidth={2.2} />
              Delete Task
            </button>
          </div>

          <div className="border-b border-[#dbe4ef]">
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={() => setActiveTab('offers')}
                className={cn(
                  'px-1 pb-3 text-[12px] transition-colors',
                  activeTab === 'offers'
                    ? 'border-b-2 border-[#2563eb] font-bold text-[#2563eb]'
                    : 'font-medium text-[#475569] hover:text-[#2563eb]',
                )}
              >
                Offers (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={cn(
                  'px-1 pb-3 text-[12px] transition-colors',
                  activeTab === 'questions'
                    ? 'border-b-2 border-[#2563eb] font-bold text-[#2563eb]'
                    : 'font-medium text-[#475569] hover:text-[#2563eb]',
                )}
              >
                Questions
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'offers' ? (
        <div className="grid gap-5 xl:grid-cols-[370px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <DashboardPanel className="rounded-[8px] p-6">
              <h2 className="text-[18px] font-bold text-[#111827]">Status Timeline</h2>
              <div className="mt-6 space-y-5 border-t border-[#edf1f6] pt-5">
                {status.timeline.map((item, index) => (
                  <div key={item.title} className="relative flex gap-4">
                    {index < status.timeline.length - 1 ? (
                      <span className="absolute left-[13px] top-8 h-[calc(100%+12px)] w-px bg-[#e6edf5]" aria-hidden="true" />
                    ) : null}
                    <TimelineMarker tone={item.tone} />
                    <div className="min-w-0 flex-1">
                      <h3 className={cn('text-[13px] font-bold', item.tone === 'pending' ? 'text-[#94a3b8]' : item.tone === 'active' ? 'text-[#2563eb]' : 'text-[#172033]')}>
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium text-[#64748b]">{item.time}</p>
                      {item.detail ? <p className="mt-2 text-[12px] font-medium text-[#475569]">{item.detail}</p> : null}
                      {item.note ? (
                        <div className="mt-3 rounded-[6px] bg-[#eaf2ff] px-4 py-3 text-[12px] font-medium leading-5 text-[#2563eb]">
                          {item.note}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel className="rounded-[8px] p-6">
              <h2 className="text-[14px] font-bold text-[#111827]">Administrative Details</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="text-[11px] font-bold text-[#334155]">Completion Docs</h3>
                  <div className="mt-2 flex h-11 items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] text-[11px] font-medium text-[#64748b]">
                    <Paperclip size={13} strokeWidth={2.1} />
                    No documents uploaded yet.
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-[#334155]">
                    {taskStatus === 'cancelled' ? 'Cancellation Details' : 'Dispute Info'}
                  </h3>
                  {taskStatus === 'dispute' ? (
                    <DisputeDetails />
                  ) : taskStatus === 'cancelled' ? (
                    <CancellationDetails displayId={displayId} />
                  ) : (
                    <div className="mt-2 rounded-[6px] border border-[#d4f5de] bg-[#ecfdf3] px-4 py-4 text-[12px] font-medium text-[#16a34a]">
                      No active disputes.
                    </div>
                  )}
                </div>
              </div>
            </DashboardPanel>
          </aside>

          <section className="space-y-5">
            <DashboardPanel className="rounded-[8px] p-6">
              <h2 className="text-[19px] font-bold text-[#111827]">Provider Offers (3)</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                {offersForStatus.map((offer) => (
                  <ProviderOfferCard
                    key={offer.name}
                    offer={offer}
                    taskId={normalizedId}
                    onReviewFeeAdjustment={() => setIsFeeAdjustmentOpen(true)}
                  />
                ))}
              </div>
            </DashboardPanel>

            <DashboardPanel className="rounded-[8px]">
              <header className="flex h-16 items-center justify-between border-b border-[#e6ebf3] px-6">
                <h2 className="text-[18px] font-bold text-[#111827]">Offer Discussion</h2>
                <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[#dbe4ef] bg-[#f8fafc] px-3 text-[11px] font-medium text-[#475569]">
                  <Eye size={13} strokeWidth={2.1} />
                  Admin Observing
                </span>
              </header>

              {taskStatus === 'dispute' ? (
                <div className="border-b border-[#fde68a] bg-[#fffbeb] px-6 py-4">
                  <p className="flex items-center gap-2 text-[13px] font-bold text-[#b45309]">
                    <AlertTriangle size={15} strokeWidth={2.2} />
                    Offer Dispute Active
                  </p>
                  <p className="mt-1 pl-7 text-[12px] font-medium leading-5 text-[#b45309]">
                    Mike T. has raised a dispute regarding the task. Task remains open, but this offer is flagged for review.
                  </p>
                </div>
              ) : null}

              <div className="min-h-[300px] px-6 py-8">
                <div className="mb-8 text-center">
                  <span className="rounded-full bg-[#eef2f6] px-3 py-1 text-[11px] font-medium text-[#94a3b8]">Today</span>
                </div>

                <div className="flex items-end gap-3">
                  <ProviderAvatar initials="MT" />
                  <div>
                    <div className="max-w-[530px] rounded-[14px] rounded-bl-[4px] bg-[#eef2ff] px-5 py-4 text-[13px] font-medium leading-5 text-[#172033]">
                      Hi Mike, thanks for the bid. Can you confirm if you bring your own cleaning supplies?
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-[#94a3b8]">02:15 PM</p>
                  </div>
                </div>

                <div className="mt-7 flex items-end justify-end gap-3">
                  <div>
                    <div className="max-w-[560px] rounded-[14px] rounded-br-[4px] bg-[#2563eb] px-5 py-4 text-[13px] font-medium leading-5 text-white">
                      Yes, I provided all professional-grade cleaning supplies and equipment. Looking forward to helping out!
                    </div>
                    <p className="mt-1 text-right text-[10px] font-medium text-[#94a3b8]">02:20 PM <BadgeCheck size={10} className="inline text-[#2563eb]" /></p>
                  </div>
                  <ProviderAvatar initials="SJ" />
                </div>

                {taskStatus === 'cancelled' ? (
                  <div className="mt-7 text-center">
                    <span className="inline-flex items-center gap-2 rounded-[6px] border border-[#fecaca] bg-[#fee2e2] px-4 py-2 text-[12px] font-medium text-[#dc2626]">
                      <AlertTriangle size={13} strokeWidth={2.2} />
                      This task has been cancelled. Further communication is disabled.
                    </span>
                  </div>
                ) : null}
              </div>

              <footer className="flex items-center justify-center gap-3 border-t border-[#e6ebf3] bg-[#f8fafc] px-6 py-4 text-[12px] font-medium text-[#64748b]">
                <Lock size={14} strokeWidth={2.2} />
                Administrators can view communications but cannot interact directly in this channel.
                <MessageCircle className="sr-only" size={1} />
              </footer>
            </DashboardPanel>
          </section>
        </div>
        ) : null}

        {activeTab === 'questions' ? <QuestionsSection /> : null}
      </div>
      {isFeeAdjustmentOpen ? (
        <FeeAdjustmentReviewModal
          displayId={displayId}
          onClose={() => setIsFeeAdjustmentOpen(false)}
        />
      ) : null}
      {isDeleteTaskOpen ? (
        <DeleteTaskConfirmationModal
          displayId={displayId}
          onClose={() => setIsDeleteTaskOpen(false)}
        />
      ) : null}
    </DashboardPageShell>
  );
}
