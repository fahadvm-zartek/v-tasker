import Link from 'next/link';
import {
  CalendarDays,
  Download,
  ExternalLink,
  Gift,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  Send,
  Truck,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel, cn, dashboardStatusBadgeClass } from '../../../components';

type ClaimStatus = 'Pending' | 'In Transit' | 'Completed' | 'Delivered';

type ClaimDetail = {
  claimId: string;
  status: ClaimStatus;
  recipient: string;
  address: string[];
  milestone: string;
  reward: string;
  account: string;
  email: string;
  phone: string;
  value: string;
  voucherCode: string;
  provider: string;
  tracking: string;
  method: string;
  estimatedDelivery: string;
  completedAt: string;
};

const claimDetails: Record<string, ClaimDetail> = {
  'CLM-8824': {
    claimId: 'CLM-8824',
    status: 'Pending',
    recipient: 'John Doe',
    address: ['123 Maple St', 'Sydney NSW 2000', 'Australia'],
    milestone: 'Gold Driver',
    reward: 'Premium Gear Pack',
    account: 'CST-84920',
    email: 'j.doe@example.com',
    phone: '+1 (555) 123-4567',
    value: '$50.00 USD',
    voucherCode: 'FV-2023-A7B9',
    provider: 'Shiprocket',
    tracking: '',
    method: 'Express Courier (2-3 Business Days)',
    estimatedDelivery: '',
    completedAt: '',
  },
  'CLM-8825': {
    claimId: 'CLM-8825',
    status: 'In Transit',
    recipient: 'John Doe',
    address: ['123 Innovation Drive', 'Suite 400', 'Tech City, CA 94016'],
    milestone: 'Milestone 2 Achieved (200 Tasks Completed)',
    reward: 'Premium Fuel Voucher',
    account: 'CST-84920',
    email: 'j.doe@example.com',
    phone: '+1 (555) 123-4567',
    value: '$50.00 USD',
    voucherCode: 'FV-2023-A7B9',
    provider: 'Express Courier',
    tracking: 'TRK-994829103',
    method: 'Express Courier (2-3 Business Days)',
    estimatedDelivery: 'Oct 23, 2023',
    completedAt: 'Oct 23, 2023, 04:15 PM',
  },
  'CLM-8826': {
    claimId: 'CLM-8826',
    status: 'Delivered',
    recipient: 'Robert Jones',
    address: ['42 River Road', 'Brisbane QLD 4000', 'Australia'],
    milestone: 'Bronze Member',
    reward: 'Company T-Shirt',
    account: 'CST-20184',
    email: 'robert.jones@example.com',
    phone: '+1 (555) 987-1200',
    value: '$25.00 USD',
    voucherCode: 'TS-2023-BR21',
    provider: 'Australia Post',
    tracking: 'AUS-77421-BNE',
    method: 'Standard Parcel (3-5 Business Days)',
    estimatedDelivery: 'Oct 21, 2023',
    completedAt: 'Oct 21, 2023, 11:40 AM',
  },
};

const statusTone: Record<ClaimStatus, 'warning' | 'success' | 'info'> = {
  Pending: 'warning',
  'In Transit': 'info',
  Completed: 'success',
  Delivered: 'success',
};

const Field = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block">
    <span className="text-[11px] font-semibold text-[#334155]">
      {label} {required ? <span className="text-[#ef4444]">*</span> : null}
    </span>
    {children}
  </label>
);

const TimelineItem = ({ active, title, meta }: { active?: boolean; title: string; meta: string }) => (
  <li className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
    <span className="relative flex justify-center">
      <span
        className={cn(
          'mt-1 flex h-4 w-4 rounded-full border-2 bg-white',
          active ? 'border-[#10b981] bg-[#10b981]' : 'border-[#d6deeb]',
        )}
      />
    </span>
    <div>
      <p className={cn('text-[13px] font-bold', active ? 'text-[#172033]' : 'text-[#334155]')}>{title}</p>
      <p className={cn('mt-1 text-[11px] font-medium', active ? 'text-[#10b981]' : 'text-[#64748b]')}>{meta}</p>
    </div>
  </li>
);

export default async function RewardClaimDetailPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const normalizedClaimId = decodeURIComponent(claimId).replace(/^#/, '');
  const claim = claimDetails[normalizedClaimId] ?? claimDetails['CLM-8824'];
  const isPending = claim.status === 'Pending';

  return (
    <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
      <div className="animate-dashboard-entry space-y-5">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]" aria-label="Breadcrumb">
          <Link href="/rewards-platform" className="transition-colors hover:text-[#1B3061]">
            Rewards Platform
          </Link>
          <span aria-hidden="true">&gt;</span>
          <Link href="/rewards-platform" className="transition-colors hover:text-[#1B3061]">
            Pending Claims
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>Claim #{claim.claimId}</span>
        </nav>

        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] font-bold leading-8 text-[#202b3d]">
              {isPending ? 'Fulfill Reward' : `Reward Fulfillment Detail - #${claim.claimId}`}
            </h1>
            <span className={dashboardStatusBadgeClass(statusTone[claim.status])}>{claim.status}</span>
          </div>
          {isPending ? null : (
            <Link
              href="/rewards-platform"
              aria-label="Close reward fulfillment detail"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#eef2ff] hover:text-[#172033]"
            >
              <X size={18} strokeWidth={2.2} />
            </Link>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <DashboardPanel className="relative rounded-[8px] p-6">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#eef4ff]" />
            <h2 className="relative flex items-center gap-2 text-[18px] font-bold text-[#202b3d]">
              <User size={17} strokeWidth={2.3} className="text-[#0457cf]" />
              Recipient Details
            </h2>

            <dl className="relative mt-6 space-y-5">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">NAME</dt>
                <dd className="mt-2 text-[13px] font-semibold text-[#172033]">{claim.recipient}</dd>
              </div>
              <div className="border-t border-[#edf1f7] pt-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">SHIPPING ADDRESS</dt>
                <dd className="mt-2 flex gap-2 text-[13px] font-medium leading-5 text-[#334155]">
                  <MapPin size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#64748b]" />
                  <span>{claim.address.join('\n')}</span>
                </dd>
              </div>
              <div className="border-t border-[#edf1f7] pt-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">MILESTONE REACHED</dt>
                <dd className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fff7e6] px-3 py-2 text-[13px] font-bold text-[#92400e]">
                  <Trophy size={15} strokeWidth={2.2} />
                  {claim.milestone}
                </dd>
              </div>
              <div className="rounded-[6px] bg-[#eef3ff] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#72819a]">REWARD ITEM</dt>
                <dd className="mt-2 text-[13px] font-bold text-[#0457cf]">{claim.reward}</dd>
              </div>
            </dl>
          </DashboardPanel>

          <DashboardPanel className="rounded-[8px] p-6">
            <h2 className="flex items-center gap-2 text-[18px] font-bold text-[#202b3d]">
              <Truck size={18} strokeWidth={2.3} className="text-[#2563eb]" />
              {isPending ? 'Fulfillment Configuration' : 'Fulfillment Summary'}
            </h2>

            {isPending ? (
              <>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Shipment Provider" required>
                    <input
                      type="text"
                      defaultValue={claim.provider}
                      className="mt-2 h-12 w-full rounded-[7px] border border-[#dbe4ef] bg-white px-4 text-[13px] font-medium text-[#172033] outline-hidden focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
                    />
                  </Field>
                  <Field label="Tracking Number">
                    <input
                      type="text"
                      placeholder="e.g. TRK-998234-AU"
                      className="mt-2 h-12 w-full rounded-[7px] border border-[#dbe4ef] bg-white px-4 text-[13px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
                    />
                  </Field>
                  <Field label="Estimated Delivery Date">
                    <div className="relative mt-2">
                      <CalendarDays size={15} strokeWidth={2.2} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a98ad]" />
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        className="h-12 w-full rounded-[7px] border border-[#dbe4ef] bg-white px-10 text-[13px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10"
                      />
                    </div>
                  </Field>
                  <Field label="Notes">
                    <textarea
                      placeholder="e.g. The Shipment contains the following things..."
                      className="mt-2 h-24 w-full resize-none rounded-[7px] border border-[#dbe4ef] bg-white px-4 py-3 text-[13px] font-medium text-[#172033] outline-hidden placeholder:text-[#9aa6b7] focus:border-[#0457cf] focus:ring-2 focus:ring-[#0457cf]/10 sm:col-span-2"
                    />
                  </Field>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center rounded-[7px] bg-[#eef3ff] px-4 py-5 text-center text-[#9aa6b7]">
                  <PackageCheck size={26} strokeWidth={1.9} />
                  <p className="mt-2 text-[12px] font-medium">Ensure physical items are packed securely before confirming shipment.</p>
                </div>

                <footer className="mt-6 flex justify-end gap-3 border-t border-[#edf1f7] pt-5">
                  <Link
                    href="/rewards-platform"
                    className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#dbe4ef] bg-white px-5 text-[12px] font-semibold text-[#475569] transition-colors hover:bg-[#f8fafc]"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#0457cf] px-5 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(4,87,207,0.2)] transition-colors hover:bg-[#0347a8]"
                  >
                    <Send size={14} strokeWidth={2.3} />
                    Mark as Shipped
                  </button>
                </footer>
              </>
            ) : (
              <>
                <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.95fr)]">
                  <div className="space-y-5">
                    <section className="rounded-[8px] border border-[#dbe4ef] bg-white p-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-[7px] bg-[#eef3ff] text-[#0457cf]">
                          <Gift size={24} strokeWidth={2.2} />
                        </span>
                        <div>
                          <h3 className="text-[20px] font-bold text-[#202b3d]">{claim.reward}</h3>
                          <p className="mt-1 text-[13px] font-medium text-[#64748b]">{claim.milestone}</p>
                        </div>
                      </div>
                      <dl className="mt-5 grid grid-cols-2 border-t border-[#dbe4ef] pt-4">
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#8a98ad]">VALUE</dt>
                          <dd className="mt-2 text-[14px] font-semibold text-[#172033]">{claim.value}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#8a98ad]">VOUCHER CODE</dt>
                          <dd className="mt-2 inline-flex rounded-[5px] bg-[#eef3ff] px-3 py-1.5 text-[13px] font-bold text-[#475569]">
                            {claim.voucherCode}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="rounded-[8px] border border-[#dbe4ef] bg-white p-5">
                      <h3 className="border-b border-[#dbe4ef] pb-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#8a98ad]">
                        RECIPIENT INFORMATION
                      </h3>
                      <div className="mt-5 flex items-start gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[14px] font-bold text-[#2563eb]">
                          JD
                        </span>
                        <div>
                          <p className="text-[20px] font-bold text-[#202b3d]">{claim.recipient}</p>
                          <p className="mt-1 text-[13px] font-medium text-[#64748b]">{claim.account}</p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3 text-[13px] font-medium text-[#334155]">
                        <p className="flex items-center gap-3">
                          <Mail size={15} strokeWidth={2.2} className="text-[#64748b]" />
                          {claim.email}
                        </p>
                        <p className="flex items-center gap-3">
                          <Phone size={15} strokeWidth={2.2} className="text-[#64748b]" />
                          {claim.phone}
                        </p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-5">
                    <section className="rounded-[8px] border border-[#dbe4ef] bg-white p-5">
                      <h3 className="flex items-center justify-between border-b border-[#dbe4ef] pb-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#8a98ad]">
                        SHIPPING DETAILS
                        <Truck size={15} strokeWidth={2.2} className="text-[#64748b]" />
                      </h3>
                      <dl className="mt-4 space-y-4">
                        <div>
                          <dt className="text-[11px] font-medium text-[#8a98ad]">Delivery Address</dt>
                          <dd className="mt-1 text-[13px] font-medium leading-5 text-[#172033]">
                            {claim.address.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-medium text-[#8a98ad]">Method</dt>
                          <dd className="mt-1 text-[13px] font-medium text-[#172033]">{claim.method}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-medium text-[#8a98ad]">Tracking Number</dt>
                          <dd className="mt-1">
                            <a href="#" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0457cf]">
                              {claim.tracking}
                              <ExternalLink size={12} strokeWidth={2.2} />
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="rounded-[8px] border border-[#dbe4ef] bg-white p-5">
                      <h3 className="border-b border-[#dbe4ef] pb-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#8a98ad]">
                        FULFILLMENT TIMELINE
                      </h3>
                      <ol className="mt-5 space-y-5">
                        <TimelineItem active title="Reward Claimed" meta="User initiated claim" />
                        <TimelineItem active title="Order Processed" meta="Approved by system" />
                        <TimelineItem active title="Shipped" meta="Handed to carrier" />
                      </ol>
                    </section>
                  </div>
                </div>

                <footer className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f7] pt-5">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[#dbe4ef] bg-white px-4 text-[12px] font-semibold text-[#172033] transition-colors hover:bg-[#f8fafc]"
                  >
                    <Download size={14} strokeWidth={2.2} />
                    Download Invoice
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[#dbe4ef] bg-white px-4 text-[12px] font-semibold text-[#172033] transition-colors hover:bg-[#f8fafc]"
                    >
                      <MessageSquare size={14} strokeWidth={2.2} />
                      Contact User
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#2563eb] px-4 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(37,99,235,0.22)] transition-colors hover:bg-[#1d4ed8]"
                    >
                      <ExternalLink size={14} strokeWidth={2.2} />
                      Update Status
                    </button>
                  </div>
                </footer>
              </>
            )}
          </DashboardPanel>
        </section>
      </div>
    </DashboardPageShell>
  );
}
