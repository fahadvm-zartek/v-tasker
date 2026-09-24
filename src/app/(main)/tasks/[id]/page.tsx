'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Paperclip,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel, cn } from '../../../../components';
import type { TaskDetail, NormalizedQuestion } from '../../../../services/taskService';
import type { NormalizedOffer, NormalizedMessage } from '../../../../services/offerService';

// ─── Types ─────────────────────────────────────────────────────────────────────

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
  raw?: Record<string, unknown>;
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

// ─── Modals ───────────────────────────────────────────────────────────────────

const DeleteTaskConfirmationModal = ({
  displayId,
  onClose,
  onConfirm,
  isDeleting,
}: {
  displayId: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 py-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
      className="w-full max-w-[630px] overflow-hidden rounded-[12px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
    >
      <div className="flex gap-3 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fee2e2] text-[#dc2626]">
          <AlertTriangle size={20} strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <h2 id="delete-task-title" className="text-[18px] font-bold leading-6 text-[#111827]">
            Delete Task
          </h2>
          <p className="mt-3 max-w-[460px] text-[12px] font-medium leading-5 text-[#374151]">
            Are you sure you want to delete Task {displayId}? This action cannot be undone and all associated offers and discussions will be permanently removed.
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-end gap-3 bg-[#f5f7fb] px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="inline-flex h-9 items-center justify-center rounded-[6px] px-4 text-[12px] font-bold text-[#374151] transition-colors hover:bg-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#dc2626] px-4 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(220,38,38,0.18)] transition-colors hover:bg-[#b91c1c] disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} strokeWidth={2.2} />}
          Delete Permanently
        </button>
      </footer>
    </section>
  </div>
);

const FeeAdjustmentReviewModal = ({
  offer,
  service,
  displayId,
  onClose,
  onApprove,
  isApproving,
}: {
  offer: ProviderOffer | null;
  service: string;
  displayId: string;
  onClose: () => void;
  onApprove: () => void;
  isApproving: boolean;
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
            <p className="mt-2 text-[18px] font-medium leading-6 text-[#111827]">{service || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#64748b]">Provider</p>
            <div className="mt-2 flex items-center gap-3">
              <ProviderAvatar initials={offer?.initials || 'NA'} />
              <p className="text-[18px] font-bold text-[#111827]">{offer?.name || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[6px] border border-[#d9e2f2] bg-[#eef3ff] px-6 py-5">
          <p className="flex items-center gap-2 text-[15px] font-medium text-[#64748b]">
            <Info size={16} strokeWidth={2.1} />
            Adjustment Reason
          </p>
          <p className="mt-3 text-[18px] font-medium italic leading-7 text-[#1f2937]">
            {displayApiValue((offer?.raw?.fee_adjustment as Record<string, unknown> | undefined)?.reason, 'No adjustment reason provided.')}
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
                  <dd className="font-medium text-[#334155]">{offer?.serviceAmount || 'N/A'}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-[#dbe4ef] pb-4">
                  <dt className="text-[#64748b]">Commission</dt>
                  <dd className="font-medium text-[#64748b]">{offer?.commission || 'N/A'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-[#111827]">Provider Payout</dt>
                  <dd className="font-medium text-[#111827]">{offer?.payout || 'N/A'}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[10px] border border-[#93c5fd] bg-[#f8fbff] px-7 py-6 shadow-[inset_4px_0_0_#3b82f6]">
              <div className="flex items-start justify-between gap-4 border-b border-[#dbeafe] pb-5">
                <h4 className="text-[15px] font-bold uppercase leading-5 tracking-[0.08em] text-[#3b82f6]">
                  Requested Payment Increase
                </h4>
                <span className="rounded-full bg-[#dbeafe] px-5 py-2 text-[13px] font-medium text-[#2563eb]">
                  {displayApiValue((offer?.raw?.fee_adjustment as Record<string, unknown> | undefined)?.amount)}
                </span>
              </div>
              <dl className="space-y-4 py-5 text-[17px]">
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-[#111827]">Service Amount</dt>
                  <dd className="font-bold text-[#111827]">{displayApiValue((offer?.raw?.fee_adjustment as Record<string, unknown> | undefined)?.service_amount)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-dashed border-[#dbe4ef] pb-4">
                  <dt className="text-[#64748b]">Commission</dt>
                  <dd className="font-medium text-[#64748b]">{displayApiValue((offer?.raw?.fee_adjustment as Record<string, unknown> | undefined)?.commission)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-bold text-[#3b82f6]">Provider Payout</dt>
                  <dd className="font-bold text-[#3b82f6]">{displayApiValue((offer?.raw?.fee_adjustment as Record<string, unknown> | undefined)?.payout)}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>

      <footer className="flex justify-end border-t border-[#e4eaf2] bg-white px-9 py-6">
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#2563eb] px-7 text-[16px] font-medium text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {isApproving ? <Loader2 size={19} className="animate-spin" /> : <CheckCircle2 size={19} strokeWidth={2.2} />}
          Approve Adjustment
        </button>
      </footer>
    </section>
  </div>
);

// ─── Offer Card ───────────────────────────────────────────────────────────────

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
        <dt className="text-[#64748b]">Commission:</dt>
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

    {offer.raw?.fee_adjustment && typeof offer.raw.fee_adjustment === 'object' ? (
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

// ─── Questions Section ────────────────────────────────────────────────────────

const QuestionAvatar = ({ initials }: { initials: string }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[12px] font-bold text-[#2563eb]">
    {initials}
  </span>
);

const QuestionsSection = ({ questions }: { questions: TaskQuestion[] }) => (
  <DashboardPanel className="overflow-hidden rounded-[8px]">
    <header className="flex h-16 items-center border-b border-[#e6ebf3] px-7">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#172033]">
        Questions
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#172033] px-2 text-[11px] font-bold text-white">
          {questions.length}
        </span>
      </h2>
    </header>

    {questions.length === 0 ? (
      <div className="flex items-center justify-center py-12 text-[13px] font-medium text-[#94a3b8]">
        No questions yet.
      </div>
    ) : (
      <div className="divide-y divide-[#e6ebf3] px-7">
        {questions.map((item) => (
          <article key={item.author + item.timestamp} className="py-6">
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
                  {item.likes ? <span>{item.likes}</span> : null}
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
    )}
  </DashboardPanel>
);

// ─── Dispute / Cancellation Panels ────────────────────────────────────────────

const DisputeDetails = ({
  disputeId,
  reason,
  status,
  dateRaised,
  onResolve,
  isResolving,
}: {
  disputeId?: string;
  reason?: string;
  status?: string;
  dateRaised?: string;
  onResolve?: () => void;
  isResolving?: boolean;
}) => (
  <div className="mt-2 rounded-[8px] border border-[#fecaca] bg-[#fff1f1] p-4 text-[#7f1d1d]">
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-[12px] font-bold text-[#dc2626]">
        <AlertTriangle size={15} strokeWidth={2.2} />
        Dispute {disputeId || 'N/A'}
      </p>
      <span className="rounded-full border border-[#fca5a5] bg-[#fee2e2] px-2 py-0.5 text-[9px] font-bold uppercase text-[#dc2626]">
        {status || 'N/A'}
      </span>
    </div>
    <h4 className="mt-5 text-[11px] font-bold text-[#334155]">Reason for Dispute</h4>
    <p className="mt-2 text-[12px] font-medium leading-5 text-[#334155]">
      {reason || 'No reason provided.'}
    </p>
    <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-2 border-t border-[#fecaca] pt-4 text-[11px] font-medium text-[#475569]">
      <span className="font-bold text-[#334155]">Date Raised</span>
      <span>{dateRaised || 'N/A'}</span>
    </div>
    <button
      type="button"
      onClick={onResolve}
      disabled={isResolving}
      className="mt-4 h-10 w-full rounded-[6px] bg-[#b91c1c] text-[12px] font-bold text-white transition-colors hover:bg-[#991b1b] disabled:opacity-50"
    >
      {isResolving ? 'Resolving…' : 'Resolve Dispute'}
    </button>
  </div>
);

const CancellationDetails = ({
  displayId,
  reason,
  dateCancelled,
}: {
  displayId: string;
  reason?: string;
  dateCancelled?: string;
}) => (
  <div className="mt-2 rounded-[8px] border border-[#fecaca] bg-[#fee2e2] p-4 text-[#7f1d1d]">
    <p className="flex items-center gap-2 text-[12px] font-bold text-[#dc2626]">
      <AlertTriangle size={15} strokeWidth={2.2} />
      Task Cancelled - {displayId}
    </p>
    <h4 className="mt-5 text-[11px] font-bold text-[#dc2626]">Reason</h4>
    <p className="mt-2 text-[12px] font-medium leading-5 text-[#7f1d1d]">
      {reason || 'No cancellation reason provided.'}
    </p>
    <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-2 border-t border-[#fecaca] pt-4 text-[11px] font-medium text-[#7f1d1d]">
      <span className="font-bold text-[#991b1b]">Date Cancelled</span>
      <span>{dateCancelled || 'N/A'}</span>
    </div>
  </div>
);

// ─── Chat / Offer Discussion ──────────────────────────────────────────────────

const ChatMessage = ({
  message,
  isRight,
}: {
  message: NormalizedMessage;
  isRight: boolean;
}) => (
  isRight ? (
    <div className="mt-7 flex items-end justify-end gap-3">
      <div>
        <div className="max-w-[560px] rounded-[14px] rounded-br-[4px] bg-[#2563eb] px-5 py-4 text-[13px] font-medium leading-5 text-white">
          {message.text}
        </div>
        <p className="mt-1 text-right text-[10px] font-medium text-[#94a3b8]">
          {message.timestamp} <BadgeCheck size={10} className="inline text-[#2563eb]" />
        </p>
      </div>
      <ProviderAvatar initials={message.senderInitials} />
    </div>
  ) : (
    <div className="flex items-end gap-3 mt-7 first:mt-0">
      <ProviderAvatar initials={message.senderInitials} />
      <div>
        <div className="max-w-[530px] rounded-[14px] rounded-bl-[4px] bg-[#eef2ff] px-5 py-4 text-[13px] font-medium leading-5 text-[#172033]">
          {message.text}
        </div>
        <p className="mt-1 text-[10px] font-medium text-[#94a3b8]">{message.timestamp}</p>
      </div>
    </div>
  )
);

// ─── Toast notification ───────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div
    className={cn(
      'fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-[8px] px-5 py-4 shadow-lg text-white text-[13px] font-medium max-w-[360px]',
      type === 'success' ? 'bg-[#16a34a]' : 'bg-[#dc2626]',
    )}
  >
    <span className="flex-1">{message}</span>
    <button type="button" onClick={onClose} className="shrink-0 opacity-80 hover:opacity-100">
      <X size={15} strokeWidth={2.2} />
    </button>
  </div>
);

// ─── Section loading state ────────────────────────────────────────────────────

const SectionLoader = () => (
  <div role="status" aria-busy="true" className="space-y-3 py-6">
    <span className="sr-only">Loading task details</span>
    <div aria-hidden="true" className="animate-pulse space-y-3">
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
    </div>
  </div>
);

const displayApiValue = (value: unknown, empty = 'N/A'): string =>
  typeof value === 'string' && value.trim() ? value : typeof value === 'number' && Number.isFinite(value) ? String(value) : empty;

const getStatusCapsuleClass = (status: string): string => {
  const normalized = String(status ?? '').toLowerCase().replace(/[\s_-]+/g, '');
  switch (normalized) {
    case 'inprogress':
      return 'bg-[#dbeafe] text-[#2563eb]';
    case 'dispute':
    case 'disputed':
      return 'bg-[#ffe1e1] text-[#dc2626]';
    case 'pending':
      return 'bg-[#fff0d7] text-[#d97706]';
    case 'open':
      return 'bg-[#dcfce7] text-[#15803d]';
    default:
      return 'bg-[#fff0d7] text-[#d97706]';
  }
};

const formatTaskLocation = (task: TaskDetail | null): string => {
  if (!task) return '';
  const parts = [task.address, task.suburb, task.state]
    .map((part) => (part !== undefined && part !== null ? String(part).trim() : ''))
    .filter((part) => part !== '' && part !== 'undefined' && part !== 'null' && part !== 'N/A');
  return parts.join(', ');
};

const buildTimeline = (task: TaskDetail | null): TimelineItem[] =>
  Array.isArray(task?.statusTimeline) ? task.statusTimeline : [];

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // UI state
  const [isFeeAdjustmentOpen, setIsFeeAdjustmentOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<ProviderOffer | null>(null);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskDetailTab>('offers');

  // Loading / action state
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isResolvingDispute, setIsResolvingDispute] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // API data state
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [liveOffers, setLiveOffers] = useState<NormalizedOffer[] | null>(null);
  const [liveQuestions, setLiveQuestions] = useState<NormalizedQuestion[] | null>(null);
  const [chatMessages, setChatMessages] = useState<NormalizedMessage[]>([]);
  const [liveDispute, setLiveDispute] = useState<{ id: string; reason: string; status: string; dateRaised: string } | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [loadedTaskId, setLoadedTaskId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingDispute, setIsLoadingDispute] = useState(true);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const normalizedId = decodeURIComponent(id).replace(/^#/, '');

  // Derive display ID
  const displayId = taskDetail?.displayId ?? (normalizedId.startsWith('TSK-') ? `#${normalizedId}` : `#${normalizedId}`);
  const taskApiId = taskDetail?.id ?? normalizedId;

  // Determine status from real API data
  const rawStatus = taskDetail?.status ?? '';
  const actualStatus = rawStatus || 'N/A';
  const taskStatus = liveDispute ? 'dispute' : ['CANCELLED', 'CANCELED'].includes(rawStatus.toUpperCase()) ? 'cancelled' : '';
  const offersForStatus: ProviderOffer[] = liveOffers ?? [];

  const displayQuestions: TaskQuestion[] = liveQuestions ?? [];

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    const taskId = decodeURIComponent(id).replace(/^#/, '');

    const loadAll = async () => {
      setIsLoadingTask(true);
      setTaskDetail(null);
      setLiveOffers(null);
      setLiveQuestions(null);
      setChatMessages([]);
      setLiveDispute(null);
      setApiError(null);
      setSectionErrors({});
      setIsLoadingOffers(true);
      setIsLoadingQuestions(true);
      setIsLoadingMessages(true);
      setIsLoadingDispute(true);
      const { fetchTaskById } = await import('../../../../services/taskService');
      const { fetchOffersByTask, fetchOfferMessages, normalizeOffer } = await import('../../../../services/offerService');
      const { fetchTaskQuestions } = await import('../../../../services/taskService');
      const { fetchDisputesPage } = await import('../../../../services/disputeService');
      const { fetchChatRoomsPage, fetchChatRoomMessages } = await import('../../../../services/chatModerationService');

      // Load task detail
      setIsLoadingTask(true);
      let detail: TaskDetail | null = null;
      try {
        detail = await fetchTaskById(taskId);
        if (!cancelled) setTaskDetail(detail);
      } catch (err) {
        if (!cancelled) setApiError(err instanceof Error ? err.message : 'Failed to load task details');
      } finally {
        if (!cancelled) { setLoadedTaskId(id); setIsLoadingTask(false); }
      }

      if (cancelled || !detail) return;

      // Load offers
      setIsLoadingOffers(true);
      let offersData: NormalizedOffer[] = [];
      try {
        offersData = await fetchOffersByTask(taskId);
        // Fallback: check if task detail raw payload contains offers
        if ((!offersData || offersData.length === 0) && detail?.raw) {
          const rawObj = detail.raw as Record<string, unknown>;
          const rawOffers = (rawObj.offers ?? rawObj.offers_list ?? rawObj.offer_set) as unknown;
          if (Array.isArray(rawOffers) && rawOffers.length > 0) {
            offersData = rawOffers.map((o, i) => normalizeOffer(o as Record<string, unknown>, i)).filter(Boolean) as NormalizedOffer[];
          }
        }
        if (!cancelled) setLiveOffers(offersData);
      } catch {
        if (!cancelled) { setLiveOffers([]); setSectionErrors((errors) => ({ ...errors, offers: 'Unable to load offers.' })); }
      } finally {
        if (!cancelled) setIsLoadingOffers(false);
      }

      // Load questions
      setIsLoadingQuestions(true);
      try {
        const questionsData = await fetchTaskQuestions(taskId);
        if (!cancelled) setLiveQuestions(questionsData);
      } catch {
        if (!cancelled) { setLiveQuestions([]); setSectionErrors((errors) => ({ ...errors, questions: 'Unable to load questions.' })); }
      } finally {
        if (!cancelled) setIsLoadingQuestions(false);
      }

      // Load disputes
      try {
        const disputeData = await fetchDisputesPage({ task: taskId, pageSize: 1 });
        if (!cancelled && disputeData.disputes.length > 0) {
          const d = disputeData.disputes[0];
          setLiveDispute({
            id: d.id,
            reason: d.raw?.reason as string ?? '',
            status: d.status,
            dateRaised: d.date,
          });
        }
      } catch {
        if (!cancelled) setSectionErrors((errors) => ({ ...errors, dispute: 'Unable to load dispute information.' }));
      } finally {
        if (!cancelled) setIsLoadingDispute(false);
      }

      // Load chat rooms and messages, with fallback to offer messages
      try {
        let loadedMsgs: NormalizedMessage[] = [];
        const roomData = await fetchChatRoomsPage({ task: taskId, pageSize: 1 });
        if (!cancelled && roomData.rooms.length > 0) {
          const roomId = String(roomData.rooms[0].raw?.id ?? '');
          if (roomId) {
            const msgs = await fetchChatRoomMessages(roomId);
            if (Array.isArray(msgs)) {
              const { normalizeMessage } = await import('../../../../services/offerService');
              loadedMsgs = (msgs as unknown[]).map((m, i) => {
                if (typeof m === 'object' && m !== null) {
                  return normalizeMessage(m as Record<string, unknown>, i);
                }
                return null;
              }).filter(Boolean) as NormalizedMessage[];
            }
          }
        }

        // If no chat room messages, fallback to offer messages (e.g. GET /api/offers/10/messages/)
        if (loadedMsgs.length === 0) {
          const offerIdsToTry = (offersData ?? []).map((o) => o.id);
          for (const offerIdCandidate of offerIdsToTry) {
            if (!offerIdCandidate) continue;
            try {
              const offerMsgs = await fetchOfferMessages(offerIdCandidate);
              if (Array.isArray(offerMsgs) && offerMsgs.length > 0) {
                loadedMsgs = offerMsgs;
                break;
              }
            } catch {
              // Try next candidate
            }
          }
        }

        if (!cancelled) {
          setChatMessages(loadedMsgs);
        }
      } catch {
        if (!cancelled) setSectionErrors((errors) => ({ ...errors, messages: 'Unable to load discussion.' }));
      } finally {
        if (!cancelled) setIsLoadingMessages(false);
      }
    };

    void loadAll().catch(() => {
      if (!cancelled) { setApiError('Unable to load task details.'); setLoadedTaskId(id); setIsLoadingTask(false); }
    });
    return () => { cancelled = true; };
  }, [id]);

  // ─── Action Handlers ────────────────────────────────────────────────────────

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      const { deleteTask } = await import('../../../../services/taskService');
      await deleteTask(taskApiId);
      showToast('Task deleted successfully.', 'success');
      setTimeout(() => router.push('/tasks'), 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteTaskOpen(false);
    }
  }, [taskApiId, router, showToast]);

  const handleApproveAdjustment = useCallback(async () => {
    setIsApproving(true);
    try {
      const { increaseBudget } = await import('../../../../services/taskService');
      await increaseBudget(taskApiId, {});
      showToast('Budget adjustment approved.', 'success');
      setIsFeeAdjustmentOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve adjustment.', 'error');
    } finally {
      setIsApproving(false);
    }
  }, [taskApiId, showToast]);

  const handleResolveDispute = useCallback(async () => {
    if (!liveDispute) return;
    setIsResolvingDispute(true);
    try {
      const { resolveDispute } = await import('../../../../services/disputeService');
      await resolveDispute(liveDispute.id.replace(/^#DIS-/, ''), { status: 'RESOLVED', resolution: 'Resolved by admin', admin_notes: '' });
      showToast('Dispute resolved.', 'success');
      setLiveDispute(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resolve dispute.', 'error');
    } finally {
      setIsResolvingDispute(false);
    }
  }, [liveDispute, showToast]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  const taskTitle = taskDetail?.title || '';
  const taskPosterName = taskDetail?.poster?.name || '';
  const taskPosterLink = taskDetail?.poster?.id ? `/users/${taskDetail.poster.id}` : '#';
  const taskLocation = formatTaskLocation(taskDetail);
  const taskBudget = taskDetail?.budget || '';
  const taskViewsDisplay = taskDetail?.raw?.views_count != null || taskDetail?.raw?.views != null ? `${taskDetail.viewsCount} views` : '';

  const disputeDisplayed = liveDispute ?? null;
  const timelineItems = buildTimeline(taskDetail);
  const hasOffers = liveOffers && liveOffers.length > 0;

  if (isLoadingTask || loadedTaskId !== id) {
    return <DashboardPageShell contentClassName="px-3 pb-8 pt-5 sm:px-4"><SectionLoader /><div className="grid gap-5 xl:grid-cols-[370px_minmax(0,1fr)]"><DashboardPanel className="p-6"><SectionLoader /></DashboardPanel><DashboardPanel className="p-6"><SectionLoader /></DashboardPanel></div></DashboardPageShell>;
  }
  if (apiError || !taskDetail) {
    return <DashboardPageShell contentClassName="px-3 pb-8 pt-5 sm:px-4"><DashboardPanel className="space-y-3 p-6"><p role="alert" className="text-[13px] font-medium text-[#64748b]">{apiError || 'No task details available.'}</p><Link href="/tasks" className="text-[12px] text-[#2563eb]">Back to tasks</Link></DashboardPanel></DashboardPageShell>;
  }

  return (
    <DashboardPageShell contentClassName="px-3 pb-8 pt-5 sm:px-4">
      <div className="animate-dashboard-entry space-y-5">
        {/* API Error Banner */}
        {apiError && !isLoadingTask ? (
          <div className="rounded-[8px] border border-[#fecaca] bg-[#fee2e2] px-5 py-4 text-[13px] font-medium text-[#dc2626]">
            <span className="font-bold">Error:</span> {apiError}
          </div>
        ) : null}

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
                  {isLoadingTask ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin text-[#2563eb]" />
                      Loading task details…
                    </span>
                  ) : (
                    `${displayId}: ${taskTitle}`
                  )}
                </h1>
                {!isLoadingTask && actualStatus ? (
                  <span className={cn('inline-flex h-7 shrink-0 items-center gap-2 rounded-full px-3 text-[12px] font-medium', getStatusCapsuleClass(actualStatus))}>
                    <span className="h-1.5 w-1.5 rounded-full fill-current" />
                    {actualStatus}
                  </span>
                ) : null}
              </div>

              {!isLoadingTask ? (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 pl-11 text-[12px] font-medium text-[#64748b]">
                  {taskPosterName ? (
                    <span>Customer: <Link href={taskPosterLink} className="text-[#2563eb]">{taskPosterName}</Link></span>
                  ) : null}
                  {taskLocation ? (
                    <>
                      {taskPosterName ? <span className="text-[#cbd5e1]">-</span> : null}
                      <span>Location: <span className="text-[#334155]">{taskLocation}</span></span>
                    </>
                  ) : null}
                  {taskBudget ? (
                    <>
                      {taskPosterName || taskLocation ? <span className="text-[#cbd5e1]">-</span> : null}
                      <span>Budget: <span className="text-[#334155]">{taskBudget}</span></span>
                    </>
                  ) : null}
                  {taskViewsDisplay ? (
                    <>
                      <span className="text-[#cbd5e1]">-</span>
                      <span>TOTAL TASK VIEWERS: <span className="text-[#334155]">{taskViewsDisplay}</span></span>
                    </>
                  ) : null}
                </div>
              ) : null}
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
                Offers ({offersForStatus.length})
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
                Questions ({displayQuestions.length})
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'offers' ? (
        <div className="grid gap-5 xl:grid-cols-[370px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <DashboardPanel className="rounded-[8px] p-6">
              <h2 className="text-[18px] font-bold text-[#111827]">Status Timeline</h2>
              {isLoadingTask ? (
                <SectionLoader />
              ) : (
                <div className="mt-6 space-y-5 border-t border-[#edf1f6] pt-5">
                  {timelineItems.length === 0 && <p className="text-[12px] font-medium text-[#64748b]">No timeline available.</p>}
                  {timelineItems.map((item, index) => (
                    <div key={item.title} className="relative flex gap-4">
                      {index < timelineItems.length - 1 ? (
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
              )}
            </DashboardPanel>

            <DashboardPanel className="rounded-[8px] p-6">
              <h2 className="text-[14px] font-bold text-[#111827]">Administrative Details</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="text-[11px] font-bold text-[#334155]">Completion Docs</h3>
                  <div className="mt-2 flex h-11 items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] text-[11px] font-medium text-[#64748b]">
                    <Paperclip size={13} strokeWidth={2.1} />
                    {Array.isArray(taskDetail.raw.completion_documents) && taskDetail.raw.completion_documents.length > 0 ? `${taskDetail.raw.completion_documents.length} completion documents available.` : 'No completion documents provided.'}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-[#334155]">
                    {taskStatus === 'cancelled' ? 'Cancellation Details' : 'Dispute Info'}
                  </h3>
                  {isLoadingDispute ? <SectionLoader /> : sectionErrors.dispute ? <p role="alert" className="text-[12px] text-[#64748b]">{sectionErrors.dispute}</p> : taskStatus === 'dispute' ? (
                    <DisputeDetails
                      disputeId={disputeDisplayed?.id ? (disputeDisplayed.id.startsWith('#') ? disputeDisplayed.id : `#${disputeDisplayed.id}`) : 'Dispute'}
                      reason={disputeDisplayed?.reason}
                      status={disputeDisplayed?.status || 'N/A'}
                      dateRaised={disputeDisplayed?.dateRaised}
                      onResolve={handleResolveDispute}
                      isResolving={isResolvingDispute}
                    />
                  ) : taskStatus === 'cancelled' ? (
                    <CancellationDetails displayId={displayId} reason={displayApiValue(taskDetail.raw.cancellation_reason, '')} dateCancelled={displayApiValue(taskDetail.raw.cancelled_at, '')} />
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
              <h2 className="text-[19px] font-bold text-[#111827]">
                Provider Offers ({offersForStatus.length})
              </h2>
              {isLoadingOffers ? (
                <SectionLoader />
              ) : sectionErrors.offers ? <p role="alert" className="py-6 text-[12px] text-[#64748b]">{sectionErrors.offers}</p> : offersForStatus.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#64748b]">
                  <p className="text-[13px] font-medium">No offers submitted yet.</p>
                </div>
              ) : (
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  {offersForStatus.map((offer) => (
                    <ProviderOfferCard
                      key={offer.name + offer.slug}
                      offer={offer}
                      taskId={normalizedId}
                      onReviewFeeAdjustment={() => { setSelectedOffer(offer); setIsFeeAdjustmentOpen(true); }}
                    />
                  ))}
                </div>
              )}
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
                    A dispute has been raised regarding this task.
                  </p>
                </div>
              ) : null}

              <div className="min-h-[220px] px-6 py-8">
                {isLoadingOffers || isLoadingMessages ? <SectionLoader /> : sectionErrors.messages ? <p role="alert" className="text-[12px] text-[#64748b]">{sectionErrors.messages}</p> : !hasOffers ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-[#64748b]">
                    <MessageCircle size={32} className="mb-2 text-[#94a3b8]" />
                    <p className="text-[14px] font-medium">No Offer Discussion available.</p>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-[#64748b]">
                    <MessageCircle size={32} className="mb-2 text-[#94a3b8]" />
                    <p className="text-[14px] font-medium">No messages in offer discussion yet.</p>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, i) => (
                      <ChatMessage key={msg.id} message={msg} isRight={i % 2 === 1} />
                    ))}
                  </>
                )}

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
              </footer>
            </DashboardPanel>
          </section>
        </div>
        ) : null}

        {activeTab === 'questions' ? (
          isLoadingQuestions ? (
            <DashboardPanel className="rounded-[8px] p-6">
              <SectionLoader />
            </DashboardPanel>
          ) : (
            sectionErrors.questions ? <p role="alert" className="text-[12px] text-[#64748b]">{sectionErrors.questions}</p> : <QuestionsSection questions={displayQuestions} />
          )
        ) : null}
      </div>

      {isFeeAdjustmentOpen ? (
        <FeeAdjustmentReviewModal
          offer={selectedOffer}
          service={taskDetail.subcategory || taskDetail.category}
          displayId={displayId}
          onClose={() => setIsFeeAdjustmentOpen(false)}
          onApprove={handleApproveAdjustment}
          isApproving={isApproving}
        />
      ) : null}
      {isDeleteTaskOpen ? (
        <DeleteTaskConfirmationModal
          displayId={displayId}
          onClose={() => setIsDeleteTaskOpen(false)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      ) : null}

      {toast ? (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      ) : null}
    </DashboardPageShell>
  );
}
