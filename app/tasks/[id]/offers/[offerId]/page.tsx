import Link from 'next/link';
import {
  ChevronDown,
  Clock3,
  MessageSquare,
  ShieldCheck,
  Star,
  Trash2,
  Wrench,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel } from '../../../../components';

const OfferProviderAvatar = () => (
  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[18px] font-bold text-[#1d4ed8]">
    MT
  </span>
);

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string; offerId: string }>;
}) {
  const { id } = await params;
  const normalizedId = decodeURIComponent(id).replace(/^#/, '');
  const displayId = normalizedId.startsWith('TSK-') ? `#${normalizedId}` : '#TSK-4421';

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
          <span>Offer: Mike T.</span>
        </nav>

        <header>
          <h1 className="text-[30px] font-bold leading-9 text-[#172033]">
            Task ID {displayId}: House Cleaning &mdash; 3BR
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#64748b]">
            <span className="inline-flex h-7 items-center gap-2 rounded-full bg-[#dbeafe] px-3 text-[12px] font-bold text-[#2563eb]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              In Progress
            </span>
            <span>Created Oct 24, 2023</span>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <DashboardPanel className="flex min-h-[210px] items-center justify-between rounded-[8px] p-9">
            <div className="flex items-center gap-5">
              <OfferProviderAvatar />
              <div>
                <h2 className="text-[24px] font-bold text-[#172033]">Mike T.</h2>
                <p className="mt-1 text-[14px] font-medium text-[#64748b]">Professional Cleaner</p>
                <div className="mt-3 flex items-center gap-1 text-[13px] font-medium text-[#64748b]">
                  <Star size={15} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} className="text-[#f59e0b]" />
                  <span className="ml-2 font-bold text-[#172033]">4.9</span>
                  <span>(124 reviews)</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-[5px] bg-[#e8eefb] px-3 py-1.5 text-[11px] font-bold text-[#64748b]">Background Checked</span>
                  <span className="rounded-[5px] bg-[#e8eefb] px-3 py-1.5 text-[11px] font-bold text-[#64748b]">Top Rated</span>
                </div>
              </div>
            </div>
            <ShieldCheck size={22} strokeWidth={2} className="text-[#94a3b8]" />
          </DashboardPanel>

          <section className="flex min-h-[210px] flex-col items-center justify-center rounded-[8px] bg-[#2563eb] p-8 text-center text-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-[#bfdbfe]">Bid Amount</p>
            <p className="mt-2 text-[54px] font-bold leading-none">$120</p>
            <dl className="mt-5 space-y-1 text-[12px] font-medium text-[#dbeafe]">
              <div className="flex justify-center gap-1">
                <dt>Service Amount:</dt>
                <dd className="font-bold text-white">$108.00</dd>
              </div>
              <div className="flex justify-center gap-1">
                <dt>Platform Fee (10%):</dt>
                <dd className="font-bold text-white">-$12.00</dd>
              </div>
            </dl>
            <p className="mt-4 text-[13px] font-medium text-[#dbeafe]">Fixed Price &bull; Estimated 4 Hours</p>
          </section>
        </section>

        <DashboardPanel className="rounded-[8px] p-7">
          <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#172033]">
            <MessageSquare size={21} strokeWidth={2.2} className="text-[#2563eb]" />
            Offer Description
          </h2>
          <div className="mt-5 border-t border-[#dbe4ef] pt-5">
            <p className="rounded-[6px] border border-[#d8e2f4] bg-[#eef3ff] px-6 py-5 text-[14px] font-medium leading-6 text-[#64748b]">
              &quot;Hi Elena, I have 5 years of experience in residential cleaning and can bring my own equipment. I&apos;m available to start at your preferred time and will ensure a deep clean of all 3 bedrooms and common areas. Looking forward to helping out!&quot;
            </p>
          </div>
        </DashboardPanel>

        <DashboardPanel className="rounded-[8px]">
          <button type="button" className="flex h-16 w-full items-center justify-between px-7 text-left">
            <span className="flex items-center gap-3 text-[22px] font-bold text-[#172033]">
              <Clock3 size={21} strokeWidth={2.2} className="text-[#2563eb]" />
              View Task Timeline
            </span>
            <ChevronDown size={19} strokeWidth={2.2} className="text-[#94a3b8]" />
          </button>
        </DashboardPanel>

        <DashboardPanel className="rounded-[8px] p-7">
          <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#172033]">
            <Wrench size={21} strokeWidth={2.2} className="text-[#2563eb]" />
            Service Terms
          </h2>
          <ul className="mt-5 space-y-4 border-t border-[#dbe4ef] pt-5 text-[14px] font-medium text-[#334155]">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              Includes all cleaning supplies
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              4-hour service duration
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              100% satisfaction guarantee
            </li>
          </ul>
        </DashboardPanel>

        <DashboardPanel className="flex flex-wrap items-center justify-end gap-4 rounded-[8px] p-5">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[6px] border border-[#dbe4ef] bg-white px-7 text-[13px] font-bold text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f8fafc]"
          >
            <MessageSquare size={15} strokeWidth={2.2} />
            Message Provider
          </button>
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#ef4444] px-7 text-[13px] font-bold text-white transition-colors hover:bg-[#dc2626]"
          >
            <Trash2 size={15} strokeWidth={2.2} />
            Remove Offer
          </button>
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
