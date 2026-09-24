'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Clock3,
  Loader2,
  MessageSquare,
  Star,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel } from '../../../../../../components';
import type { NormalizedOffer, NormalizedMessage } from '../../../../../../services/offerService';

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-[8px] px-5 py-4 shadow-lg text-white text-[13px] font-medium max-w-[360px] ${type === 'success' ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`}
  >
    <span className="flex-1">{message}</span>
    <button type="button" onClick={onClose} className="shrink-0 opacity-80 hover:opacity-100">
      <X size={15} strokeWidth={2.2} />
    </button>
  </div>
);

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

const DeleteOfferModal = ({
  onClose,
  onConfirm,
  isDeleting,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 py-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-offer-title"
      className="w-full max-w-[520px] overflow-hidden rounded-[12px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
    >
      <div className="flex gap-3 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fee2e2] text-[#dc2626]">
          <AlertTriangle size={20} strokeWidth={2.1} />
        </span>
        <div>
          <h2 id="delete-offer-title" className="text-[18px] font-bold leading-6 text-[#111827]">Remove Offer</h2>
          <p className="mt-3 text-[12px] font-medium leading-5 text-[#374151]">
            Are you sure you want to remove this offer? This action cannot be undone.
          </p>
        </div>
      </div>
      <footer className="flex items-center justify-end gap-3 bg-[#f5f7fb] px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="h-9 rounded-[6px] px-4 text-[12px] font-bold text-[#374151] transition-colors hover:bg-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#dc2626] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} strokeWidth={2.2} />}
          Remove Offer
        </button>
      </footer>
    </section>
  </div>
);

// ─── Offer Provider Avatar ────────────────────────────────────────────────────

const OfferProviderAvatar = ({ initials }: { initials: string }) => (
  <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-2 border-[#e2e8f0] bg-[#dbeafe] text-[18px] font-bold text-[#334155]">
    {initials}
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string; offerId: string }>;
}) {
  const { id, offerId } = use(params);
  const router = useRouter();

  const normalizedId = decodeURIComponent(id).replace(/^#/, '');
  const displayId = `#${normalizedId}`;

  // Live data state
  const [messages, setMessages] = useState<NormalizedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedOfferId, setLoadedOfferId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [liveOffer, setLiveOffer] = useState<NormalizedOffer | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ─── Fetch offer data ───────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLoadError('');
      setLiveOffer(null);
      setMessages([]);
      setMessagesError('');
      setIsLoadingMessages(true);
      try {
        const { fetchOfferById } = await import('../../../../../../services/offerService');
        const offer = await fetchOfferById(offerId);
        if (!offer) throw new Error('Offer not found.');
        if (!cancelled) setLiveOffer(offer);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load offer details.');
      } finally {
        if (!cancelled) {
          setLoadedOfferId(offerId);
          setIsLoading(false);
        }
      }
      if (cancelled) return;

      // Load offer messages
      setIsLoadingMessages(true);
      try {
        const { fetchOfferMessages } = await import('../../../../../../services/offerService');
        const msgs = await fetchOfferMessages(offerId);
        if (!cancelled) setMessages(msgs);
      } catch {
        if (!cancelled) setMessagesError('Unable to load messages.');
      } finally {
        if (!cancelled) setIsLoadingMessages(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [offerId]);

  // ─── Delete offer handler ───────────────────────────────────────────────────

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      const { deleteOffer } = await import('../../../../../../services/offerService');
      await deleteOffer(offerId);
      showToast('Offer removed successfully.', 'success');
      setTimeout(() => router.push(`/tasks/${normalizedId}`), 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to remove offer.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }, [offerId, normalizedId, router, showToast]);

  if (isLoading || loadedOfferId !== offerId) {
    return (
      <DashboardPageShell contentClassName="px-5 pb-8 pt-5">
        <div role="status" aria-live="polite" aria-busy="true" className="space-y-5">
          <span className="sr-only">Loading offer details</span>
          <div aria-hidden="true" className="animate-pulse space-y-5">
            <div className="h-4 w-48 rounded bg-slate-200" />
            <div className="h-8 w-2/3 rounded bg-slate-200" />
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="h-[210px] rounded-[8px] bg-slate-200" />
              <div className="h-[210px] rounded-[8px] bg-slate-200" />
            </section>
            <div className="h-40 rounded-[8px] bg-slate-200" />
            <div className="h-14 rounded-[8px] bg-slate-200" />
          </div>
        </div>
      </DashboardPageShell>
    );
  }

  if (loadError || !liveOffer) {
    return (
      <DashboardPageShell contentClassName="px-5 pb-8 pt-5">
        <DashboardPanel className="space-y-3 rounded-[8px] p-5">
          <p role="alert" className="text-[13px] font-medium leading-5 text-[#dc2626]">{loadError || 'Offer not found.'}</p>
          <Link href={`/tasks/${normalizedId}`} className="text-[12px] font-medium text-[#2563eb]">Back to task details</Link>
        </DashboardPanel>
      </DashboardPageShell>
    );
  }

  const raw = liveOffer.raw;
  const providerName = liveOffer.name;
  const providerInitials = liveOffer.initials;
  const providerRating = Number.parseFloat(liveOffer.rating);
  const taskTitle = typeof raw.task_title === 'string' ? raw.task_title : '';
  const offerDescription = liveOffer.description || 'No description provided.';
  const breadcrumbLabel = `Offer: ${providerName}`;
  const statusMap: Record<string, string> = { PENDING: 'Pending', ACCEPTED: 'Accepted', REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn' };
  const offerStatus = raw.status ? (statusMap[liveOffer.status] ?? liveOffer.status) : 'N/A';
  const rawCreated = raw.created_at ?? raw.date_created;
  const createdAt = typeof rawCreated === 'string' ? new Date(rawCreated) : null;
  const createdDate = createdAt && !Number.isNaN(createdAt.getTime()) ? `Created ${createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : '';
  const hasAmount = (keys: string[]) => keys.some((key) => raw[key] !== undefined && raw[key] !== null && String(raw[key]).trim() !== '');
  const bid = hasAmount(['price', 'bid', 'amount', 'total_price', 'total_amount', 'service_amount', 'serviceAmount']) ? liveOffer.bid : 'N/A';
  const serviceAmount = hasAmount(['service_amount', 'serviceAmount', 'subtotal', 'base_amount']) ? liveOffer.serviceAmount : 'N/A';
  const platformFee = hasAmount(['commission', 'commission_amount', 'commissionAmount', 'platform_fee', 'fee', 'admin_fee']) ? liveOffer.commission : 'N/A';
  const serviceTerms = Array.isArray(raw.service_terms) ? raw.service_terms.filter((term): term is string => typeof term === 'string') : typeof raw.service_terms === 'string' && raw.service_terms.trim() ? [raw.service_terms] : [];

  // Status badge
  const statusBadgeClass =
    offerStatus === 'Accepted' ? 'bg-[#dcfce7] text-[#16a34a]' :
    offerStatus === 'Rejected' ? 'bg-[#fee2e2] text-[#dc2626]' :
    offerStatus === 'Withdrawn' ? 'bg-[#f1f5f9] text-[#64748b]' :
    'bg-[#dbeafe] text-[#2563eb]';

  return (
    <DashboardPageShell contentClassName="px-5 pb-8 pt-5">
      <div className="animate-dashboard-entry space-y-5">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]" aria-label="Breadcrumb">
          <Link href="/tasks" className="transition-colors hover:text-[#1B3061]">
            Tasks
          </Link>
          <span aria-hidden="true">&gt;</span>
          <Link href={`/tasks/${normalizedId}`} className="transition-colors hover:text-[#1B3061]">
            {displayId}
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>{breadcrumbLabel}</span>
        </nav>

        <header>
          <h1 className="text-[26px] font-bold leading-8 text-[#111827]">
            Task ID {displayId}{taskTitle ? `: ${taskTitle}` : ''}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#64748b]">
            <span className={`inline-flex h-7 items-center gap-2 rounded-full px-3 text-[12px] font-medium ${statusBadgeClass}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {offerStatus}
            </span>
            <span>{createdDate}</span>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <DashboardPanel className="flex min-h-[210px] items-center justify-between rounded-[8px] px-6 py-5">
            <div className="flex items-center gap-4">
              <OfferProviderAvatar initials={providerInitials} />
              <div>
                <h2 className="text-[20px] font-bold leading-6 text-[#172033]">{providerName}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] leading-5 text-[#64748b]">
                  {Number.isFinite(providerRating) ? <>
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill={index < Math.round(providerRating) ? '#f59e0b' : 'none'} strokeWidth={1.5} className="text-[#f59e0b]" />)}
                    </span>
                    <span className="font-bold text-[#172033]">{providerRating.toFixed(1)}</span>
                    {liveOffer.rating.match(/\((\d+)\)/) && <span className="font-normal">({liveOffer.rating.match(/\((\d+)\)/)?.[1]} reviews)</span>}
                  </> : <span>No rating available</span>}
                </div>
              </div>
            </div>
          </DashboardPanel>

          <section className="flex min-h-[210px] flex-col items-center justify-center rounded-[8px] bg-[#2563eb] p-5 text-center text-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <p className="text-[13px] font-normal uppercase leading-5 tracking-[0.08em] text-[#bfdbfe]">Bid Amount</p>
            <p className="mt-2 text-[48px] font-bold leading-none tracking-tight">{bid.replace(/\.00$/, '')}</p>
            <dl className="mt-4 space-y-0.5 text-[11px] font-normal leading-4 text-[#dbeafe]">
              <div className="flex justify-center gap-1">
                <dt>Service Amount:</dt>
                <dd className="font-semibold text-white">{serviceAmount}</dd>
              </div>
              <div className="flex justify-center gap-1">
                <dt>Platform Fee:</dt>
                <dd className="font-semibold text-white">{platformFee}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[13px] font-normal leading-5 text-[#bfdbfe]">{liveOffer.availability || 'Availability not provided'}</p>
          </section>
        </section>

        <DashboardPanel className="rounded-[8px] p-5">
          <h2 className="flex items-center gap-3 text-[18px] font-bold leading-6 text-[#172033]">
            <MessageSquare size={21} strokeWidth={2.2} className="text-[#2563eb]" />
            Offer Description
          </h2>
          <div className="mt-4 border-t border-[#dbe4ef] pt-4">
            <p className="rounded-[6px] border border-[#d8e2f4] bg-[#eef3ff] px-4 py-3 text-[12px] font-medium leading-5 text-[#64748b]">
              &quot;{offerDescription}&quot;
            </p>
          </div>
        </DashboardPanel>

        {/* Messages thread */}
        {isLoadingMessages && <DashboardPanel className="rounded-[8px] p-5"><p role="status" className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]"><Loader2 size={15} className="animate-spin" />Loading messages...</p></DashboardPanel>}
        {!isLoadingMessages ? (
          <DashboardPanel className="rounded-[8px] p-5">
            <h2 className="flex items-center gap-3 text-[18px] font-bold leading-6 text-[#172033]">
              <MessageSquare size={21} strokeWidth={2.2} className="text-[#2563eb]" />
              Offer Messages
            </h2>
            <div className="mt-5 space-y-4 border-t border-[#dbe4ef] pt-5">
              {messagesError ? <p role="alert" className="text-[12px] text-[#64748b]">{messagesError}</p> : messages.length === 0 ? <p className="text-[12px] font-medium text-[#64748b]">No messages available.</p> : null}
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8edf4] text-[11px] font-bold text-[#334155]">
                    {msg.senderInitials}
                  </span>
                  <div className={i % 2 === 1 ? 'text-right' : ''}>
                    <div
                      className={`max-w-[480px] rounded-[12px] px-4 py-3 text-[13px] font-medium leading-5 ${
                        i % 2 === 1
                          ? 'rounded-br-[4px] bg-[#2563eb] text-white'
                          : 'rounded-bl-[4px] bg-[#eef2ff] text-[#172033]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-[#94a3b8]">
                      {msg.timestamp}
                      {i % 2 === 1 ? <BadgeCheck size={10} className="ml-1 inline text-[#2563eb]" /> : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        ) : null}

        <DashboardPanel className="rounded-[8px]">
          <button
            type="button"
            onClick={() => setIsTimelineOpen((v) => !v)}
            className="flex h-12 w-full items-center justify-between px-5 text-left"
          >
            <span className="flex items-center gap-3 text-[18px] font-bold leading-6 text-[#172033]">
              <Clock3 size={21} strokeWidth={2.2} className="text-[#2563eb]" />
              View Task Timeline
            </span>
            {isTimelineOpen ? (
              <ChevronUp size={19} strokeWidth={2.2} className="text-[#94a3b8]" />
            ) : (
              <ChevronDown size={19} strokeWidth={2.2} className="text-[#94a3b8]" />
            )}
          </button>
          {isTimelineOpen ? (
            <div className="border-t border-[#dbe4ef] px-5 py-4">
              <p className="text-[13px] font-medium text-[#64748b]">
                View the full task history on the{' '}
                <Link href={`/tasks/${normalizedId}`} className="text-[#2563eb] underline underline-offset-2">
                  task details page
                </Link>.
              </p>
            </div>
          ) : null}
        </DashboardPanel>

        <DashboardPanel className="rounded-[8px] p-5">
          <h2 className="flex items-center gap-3 text-[18px] font-bold leading-6 text-[#172033]">
            <Wrench size={21} strokeWidth={2.2} className="text-[#2563eb]" />
            Service Terms
          </h2>
          <ul className="mt-4 space-y-3 border-t border-[#dbe4ef] pt-4 text-[12px] font-medium leading-5 text-[#334155]">
            {serviceTerms.length ? serviceTerms.map((term, index) => <li key={index} className="flex items-center gap-3"><span className="h-2 w-2 shrink-0 rounded-full bg-[#10b981]" />{term}</li>) : <li>No service terms provided.</li>}
          </ul>
        </DashboardPanel>

        <DashboardPanel className="flex flex-wrap items-center justify-end gap-4 rounded-[8px] p-5">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-[#dbe4ef] bg-white px-4 text-[12px] font-bold text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f8fafc]"
          >
            <MessageSquare size={15} strokeWidth={2.2} />
            Message Provider
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#ef4444] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#dc2626]"
          >
            <Trash2 size={15} strokeWidth={2.2} />
            Remove Offer
          </button>
        </DashboardPanel>
      </div>

      {isDeleteOpen ? (
        <DeleteOfferModal
          onClose={() => setIsDeleteOpen(false)}
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
