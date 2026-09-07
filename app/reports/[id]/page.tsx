import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileImage,
  Save,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import {
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  dashboardStatusBadgeClass,
} from '../../components';

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a98ad]">{label}</p>
    <p className="mt-1.5 text-[13px] font-medium text-[#1f2937]">{value}</p>
  </div>
);

const SelectControl = ({ value }: { value: string }) => (
  <button
    type="button"
    className="flex h-10 w-full items-center justify-between rounded-[7px] border border-[#dbe4ef] bg-white px-3 text-left text-[13px] font-medium text-[#1f2937] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe]"
  >
    <span>{value}</span>
    <ChevronDown size={14} className="text-[#64748b]" />
  </button>
);

const ActivityItem = ({ time, text }: { time: string; text: string }) => (
  <li className="relative pb-6 pl-7 last:pb-0">
    <span className="absolute left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#cfe0ff]" />
    <span className="absolute bottom-0 left-[9px] top-4 w-px bg-[#dbe4ef] last:hidden" />
    <p className="text-[11px] font-medium text-[#8a98ad]">{time}</p>
    <p className="mt-1 text-[13px] font-medium leading-5 text-[#1f2937]">{text}</p>
  </li>
);

const ReportsDetailPage = () => (
  <DashboardPageShell>
    <div className="animate-dashboard-entry space-y-5">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[28px] font-bold leading-9 text-[#202b3d]">
            #CMP-1042: App Issues - Payment Failed at Checkout
          </h1>
          <span className={dashboardStatusBadgeClass('warning')}>Pending</span>
          <span className={dashboardStatusBadgeClass('danger')}>Critical</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] font-medium text-[#64748b]">
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={14} strokeWidth={2.1} />
            Filed by John Smith
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} strokeWidth={2.1} />
            Jun 28, 2025 at 10:45 AM
          </span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.95fr)]">
        <div className="space-y-5">
          <DashboardPanel className="p-6">
            <h2 className="border-b border-[#e6ebf3] pb-3 text-[20px] font-bold leading-7 text-[#202b3d]">
              Issue Summary
            </h2>
            <p className="mt-5 max-w-[780px] text-[14px] font-medium leading-6 text-[#64748b]">
              {
                'User reported that the app crashed when trying to complete a payment for a "House Cleaning" task. No charge was made to the user card, but the task status moved to "Payment Pending" and locked the user out of further attempts.'
              }
            </p>

            <div className="mt-7 w-full max-w-[230px] rounded-[8px] border border-[#dbe4ef] bg-[#f8fafc] p-3">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#64748b]">
                <FileImage size={13} strokeWidth={2.1} />
                screenshot_error_01.png
              </p>
              <div className="flex aspect-[4/3] items-center justify-center rounded-[5px] bg-[#294653] p-5">
                <div className="flex h-[118px] w-[76px] flex-col items-center rounded-[12px] bg-[#e9f2f6] p-2 shadow-[0_18px_34px_rgba(15,23,42,0.28)]">
                  <div className="mb-2 h-1 w-6 rounded-full bg-[#9db5c0]" />
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[8px] bg-white px-2 text-center">
                    <span className="rounded-full bg-[#ffe1e1] px-2 py-1 text-[10px] font-bold text-[#ef4444]">
                      Error
                    </span>
                    <span className="text-[9px] font-bold text-[#202b3d]">Payment Failed</span>
                    <span className="h-2 w-10 rounded-full bg-[#dfe5ef]" />
                  </div>
                </div>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel className="p-6">
            <h2 className="border-b border-[#e6ebf3] pb-3 text-[20px] font-bold leading-7 text-[#202b3d]">
              Customer Information
            </h2>
            <div className="mt-5 grid gap-x-16 gap-y-5 sm:grid-cols-2">
              <InfoItem label="Name" value="John Smith" />
              <InfoItem label="Email" value="john.smith@example.com" />
              <InfoItem label="Phone" value="+1 555-0123" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a98ad]">
                  Account Type
                </p>
                <span className="mt-1.5 inline-flex rounded-[4px] bg-[#eef2ff] px-2 py-1 text-[11px] font-bold text-[#14244d]">
                  Premium
                </span>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel className="p-6">
            <h2 className="border-b border-[#e6ebf3] pb-3 text-[20px] font-bold leading-7 text-[#202b3d]">
              Related Task
            </h2>
            <Link
              href="/tasks"
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-[#1B3061] hover:text-[#14244d]"
            >
              <ClipboardList size={15} strokeWidth={2.2} />
              #TSK-4421: House Cleaning
            </Link>
          </DashboardPanel>
        </div>

        <aside className="space-y-5">
          <DashboardPanel className="p-6">
            <h2 className="border-b border-[#e6ebf3] pb-3 text-[20px] font-bold leading-7 text-[#202b3d]">
              Admin Actions
            </h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold text-[#64748b]">Assigned To</span>
                <SelectControl value="Sarah Jenkins" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold text-[#64748b]">Status</span>
                <SelectControl value="Pending" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold text-[#64748b]">
                  Internal Resolution Notes
                </span>
                <textarea
                  placeholder="Add internal notes here..."
                  className="min-h-[118px] w-full resize-none rounded-[7px] border border-[#dbe4ef] bg-white px-3 py-3 text-[13px] font-medium text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
                />
              </label>
              <DashboardPrimaryButton className="h-10 w-full rounded-[7px] text-[13px]">
                <Save size={14} strokeWidth={2.1} />
                Update Complaint
              </DashboardPrimaryButton>
            </div>
          </DashboardPanel>

          <DashboardPanel className="p-6">
            <h2 className="border-b border-[#e6ebf3] pb-3 text-[20px] font-bold leading-7 text-[#202b3d]">
              Activity Log
            </h2>
            <ol className="mt-5">
              <ActivityItem time="Today, 11:00 AM" text="Assigned to Sarah Jenkins by Alex Mercer" />
              <ActivityItem
                time="Today, 10:45 AM"
                text="Complaint filed by John Smith via Mobile App"
              />
            </ol>
          </DashboardPanel>
        </aside>
      </div>
    </div>
  </DashboardPageShell>
);

export default ReportsDetailPage;
