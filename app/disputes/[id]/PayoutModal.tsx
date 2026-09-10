'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CircleDollarSign,
  Landmark,
  Percent,
  UserRound,
  X,
} from 'lucide-react';
import {
  DashboardPrimaryButton,
  DashboardSecondaryButton,
  cn,
} from '../../components';

type PayoutModalProps = {
  refundName: string;
  providerName: string;
};

type DistributionRowProps = {
  title: string;
  description: string;
  amount: string;
  icon: typeof UserRound;
  tone: 'refund' | 'provider' | 'commission';
};

const rowToneClasses = {
  refund: {
    border: 'border-l-[#10b981]',
    iconWrap: 'bg-[#dcfce7] text-[#059669]',
  },
  provider: {
    border: 'border-l-[#60a5fa]',
    iconWrap: 'bg-[#dbeafe] text-[#2563eb]',
  },
  commission: {
    border: 'border-l-[#3b82f6]',
    iconWrap: 'bg-[#dbeafe] text-[#2563eb]',
  },
};

const DistributionRow = ({
  title,
  description,
  amount,
  icon: Icon,
  tone,
}: DistributionRowProps) => (
  <article
    className={cn(
      'flex items-center gap-3 rounded-[7px] border border-l-4 border-[#dbe4ef] bg-white px-3 py-3',
      rowToneClasses[tone].border,
    )}
  >
    <span
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        rowToneClasses[tone].iconWrap,
      )}
    >
      <Icon size={15} strokeWidth={2.1} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[12px] font-bold text-[#172033]">{title}</p>
      <p className="mt-0.5 truncate text-[10px] font-medium text-[#64748b]">{description}</p>
    </div>
    <p className="text-[12px] font-bold text-[#172033]">{amount}</p>
  </article>
);

export const PayoutModal = ({ refundName, providerName }: PayoutModalProps) => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  return (
    <>
      <DashboardPrimaryButton
        onClick={() => setIsPayoutModalOpen(true)}
        className="h-11 w-full bg-[#10b981] text-[13px] hover:bg-[#059669]"
      >
        INITIATE PAYOUT
      </DashboardPrimaryButton>

      {isPayoutModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4 py-6"
        >
          <div className="w-full max-w-[420px] overflow-hidden rounded-[8px] border border-[#dbe4ef] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
            <header className="flex items-start justify-between border-b border-[#e6ebf3] px-5 py-4">
              <div>
                <h2 id="payout-modal-title" className="text-[17px] font-bold text-[#202b3d]">
                  Distribution Summary
                </h2>
                <p className="mt-1 text-[10px] font-medium text-[#64748b]">
                  Final payout calculation for Task #TSK-4421
                </p>
              </div>
              <button
                type="button"
                aria-label="Close payout modal"
                onClick={() => setIsPayoutModalOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#172033]"
              >
                <X size={15} strokeWidth={2.2} />
              </button>
            </header>

            <div className="space-y-4 px-5 py-4">
              <section className="flex items-center justify-between rounded-[7px] border border-[#dbe4ef] bg-white p-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#72819a]">TOTAL DISPUTE AMOUNT</p>
                  <p className="mt-1 text-[20px] font-bold text-[#172033]">$120.00</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#2563eb]">
                  <CircleDollarSign size={18} strokeWidth={2.2} />
                </span>
              </section>

              <section>
                <p className="mb-2 text-[10px] font-bold uppercase text-[#72819a]">BREAKDOWN</p>
                <div className="space-y-2">
                  <DistributionRow
                    title="Customer Refund"
                    description={`${refundName} - 80% of Net`}
                    amount="$80.00"
                    icon={UserRound}
                    tone="refund"
                  />
                  <DistributionRow
                    title="Provider Payout"
                    description={`${providerName} - 20% of Net`}
                    amount="$20.00"
                    icon={Landmark}
                    tone="provider"
                  />
                  <DistributionRow
                    title="VTasker Commission"
                    description="VTasker - 20% of Net"
                    amount="$20.00"
                    icon={Percent}
                    tone="commission"
                  />
                </div>
              </section>

              <div className="flex items-center justify-between border-t border-[#e6ebf3] pt-3">
                <p className="text-[11px] font-medium text-[#64748b]">Processing Fees</p>
                <p className="text-[12px] font-bold text-[#172033]">$0.00</p>
              </div>
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
              <DashboardSecondaryButton onClick={() => setIsPayoutModalOpen(false)} className="h-8 px-4">
                Back to Dispute
              </DashboardSecondaryButton>
              <DashboardPrimaryButton className="h-8 bg-[#2563eb] px-4 hover:bg-[#1d4ed8]">
                Confirm & Process Payout
                <ArrowRight size={13} strokeWidth={2.2} />
              </DashboardPrimaryButton>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
};
