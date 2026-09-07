import Link from 'next/link';
import {
  Ban,
  X,
} from 'lucide-react';
import { Header, Sidebar } from '../../../components';

const moderationLogDetail = {
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

const DetailMetaItem = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4b5563]">{label}</p>
    <p className={`mt-2 text-[13px] font-bold ${accent ? 'text-[#004fb8]' : 'text-[#111827]'}`}>{value}</p>
  </div>
);

const AnalysisRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] py-4 text-[14px]">
    <span className="font-medium text-[#536173]">{label}</span>
    {children}
  </div>
);

const ModerationLogDetailPage = () => (
  <div className="app-shell flex min-h-screen bg-[#f7f8fa]">
    <Sidebar />

    <main className="dashboard-main flex-1 pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
      <Header />

      <div className="relative min-h-[calc(100vh-62px)] overflow-hidden px-6 py-6">
        <div className="pointer-events-none select-none opacity-25 blur-[2px]">
          <h1 className="text-[28px] font-bold text-[#1f2937]">Live Chat Stream</h1>
          <p className="mt-2 text-[14px] font-medium text-[#64748b]">Monitoring active conversations for policy violations.</p>
          <div className="mt-8 grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 rounded-[8px] border border-[#dfe7f2] bg-white" />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#111827]/35 px-4 py-12 backdrop-blur-[1px]">
          <section className="w-full max-w-[680px] overflow-hidden rounded-[10px] border border-[#cfd8e6] bg-white shadow-[0_28px_60px_rgba(15,23,42,0.28)]">
            <header className="flex items-center justify-between border-b border-[#e5ebf4] px-6 py-5">
              <h2 className="text-[21px] font-bold leading-7 text-[#111827]">Moderation Log Detail</h2>
              <Link href="/chat-moderation/logs" aria-label="Close moderation log detail" className="text-[#64748b] transition hover:text-[#111827]">
                <X size={22} strokeWidth={2.2} />
              </Link>
            </header>

            <div className="space-y-8 px-6 py-6">
              <section className="grid gap-x-16 gap-y-6 rounded-[8px] border border-[#d8e1ee] bg-[#f8fafc] p-5 sm:grid-cols-2">
                <DetailMetaItem label="Moderation ID" value={moderationLogDetail.moderationId} />
                <DetailMetaItem label="Timestamp" value={moderationLogDetail.timestamp} />
                <DetailMetaItem label="Content ID" value={moderationLogDetail.contentId} accent />
                <DetailMetaItem label="User ID" value={moderationLogDetail.userId} accent />
              </section>

              <section>
                <h3 className="text-[13px] font-bold leading-5 text-[#111827]">Original Content</h3>
                <div className="mt-3 rounded-[8px] border border-[#fecaca] bg-[#fff7f6] p-5 font-mono text-[14px] leading-6 text-[#dc2626]">
                  {`"${moderationLogDetail.originalContent}"`}
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-bold leading-5 text-[#111827]">Normalized Content</h3>
                <div className="mt-3 rounded-[8px] border border-[#d8dde6] bg-[#eef0f3] p-5 font-mono text-[14px] leading-6 text-[#4b5563]">
                  {`"${moderationLogDetail.normalizedContent}"`}
                </div>
              </section>

              <section className="border-t border-[#e5e7eb] pt-6">
                <h3 className="text-[13px] font-bold leading-5 text-[#111827]">Rule Engine Analysis</h3>
                <div className="mt-4">
                  <AnalysisRow label="Triggered Rules">
                    <span className="rounded-[4px] bg-[#b23b00] px-3 py-2 text-[12px] font-bold tracking-[0.04em] text-white">
                      {moderationLogDetail.triggeredRule}
                    </span>
                  </AnalysisRow>
                  <AnalysisRow label="Risk Score">
                    <span className="font-bold text-[#4b5563]">
                      <span className="text-[#dc2626]">82</span> / 100
                    </span>
                  </AnalysisRow>
                  <AnalysisRow label="Hard Violation">
                    <span className="font-bold text-[#dc2626]">{moderationLogDetail.hardViolation}</span>
                  </AnalysisRow>
                </div>
              </section>

              <section className="flex items-center justify-between gap-4">
                <h3 className="text-[17px] font-bold text-[#111827]">Final Decision</h3>
                <span className="inline-flex h-9 items-center gap-2 rounded-[5px] bg-[#c81e1e] px-4 text-[12px] font-bold text-white">
                  <Ban size={15} strokeWidth={2.2} />
                  {moderationLogDetail.finalDecision}
                </span>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
);

export default ModerationLogDetailPage;
