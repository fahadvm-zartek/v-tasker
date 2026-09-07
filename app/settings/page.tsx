import {
  CircleDollarSign,
  Clock3,
  Info,
  Mail,
  Percent,
  Save,
  ShieldCheck,
  TrendingUp,
  UserRound,
  WalletCards,
} from 'lucide-react';
import {
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSecondaryButton,
} from '../components';
import LogoutButton from './LogoutButton';

type SettingInputProps = {
  id: string;
  label: string;
  defaultValue: string;
  suffix: string;
};

const SettingInput = ({ id, label, defaultValue, suffix }: SettingInputProps) => (
  <label htmlFor={id} className="block">
    <span className="text-[12px] font-semibold leading-4 text-[#33415c]">{label}</span>
    <div className="mt-2 flex h-11 items-center rounded-[7px] border border-[#cfd8e6] bg-white px-3 transition-colors focus-within:border-[#1B3061] focus-within:ring-4 focus-within:ring-[#1B3061]/10">
      <input
        id={id}
        name={id}
        defaultValue={defaultValue}
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#162033] outline-none"
      />
      <span className="ml-2 text-[13px] font-medium text-[#8794aa]">{suffix}</span>
    </div>
  </label>
);

type SettingsCardProps = {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  children: React.ReactNode;
  footerAlign?: 'between' | 'end';
};

const SettingsCard = ({ title, icon: Icon, children, footerAlign = 'end' }: SettingsCardProps) => (
  <DashboardPanel>
    <div className="flex min-h-[72px] items-center justify-between border-b border-[#e4e9f1] px-6 max-sm:px-4">
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f1f5fb] text-[#1B3061]">
          <Icon size={19} strokeWidth={2.2} />
        </span>
        <h2 className="text-[18px] font-bold leading-6 text-[#111827]">{title}</h2>
      </div>
      {title === 'Commission Settings' ? (
        <span className="rounded-full bg-[#dffbed] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#00a86b]">
          Active System
        </span>
      ) : null}
    </div>

    <div className="px-6 py-6 max-sm:px-4">{children}</div>

    <div
      className={`flex min-h-[72px] items-center gap-4 border-t border-[#e4e9f1] bg-[#fbfcfe] px-6 max-sm:flex-col max-sm:items-stretch max-sm:px-4 ${
        footerAlign === 'between' ? 'justify-between' : 'justify-end'
      }`}
    >
      <DashboardSecondaryButton className="h-10 rounded-[7px] px-5 text-[13px]">
        Cancel
      </DashboardSecondaryButton>
      <DashboardPrimaryButton className="h-10 rounded-[7px] px-6 text-[13px]">
        <Save size={14} strokeWidth={2.1} />
        Save Changes
      </DashboardPrimaryButton>
    </div>
  </DashboardPanel>
);

const ProgressRow = ({
  label,
  value,
  widthClass,
  colorClass,
}: {
  label: string;
  value: string;
  widthClass: string;
  colorClass: string;
}) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-4">
      <span className="text-[13px] font-medium text-[#52617a]">{label}</span>
      <span className="text-[13px] font-bold text-[#162033]">{value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-[#eef2f8]">
      <div className={`h-full rounded-full ${widthClass} ${colorClass}`} />
    </div>
  </div>
);

const AdminProfileCard = () => (
  <DashboardPanel className="p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1B3061] text-[14px] font-bold text-white">
          AU
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#66758e]">Admin Profile</p>
          <h2 className="mt-1 truncate text-[18px] font-bold leading-6 text-[#111827]">Admin User</h2>
          <p className="mt-1 truncate text-[13px] font-medium leading-5 text-[#64748b]">
            admin@alwaysvalentines.com
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e8f8ef] px-3 py-1 text-[11px] font-bold text-[#049669]">
        <ShieldCheck size={12} strokeWidth={2.2} />
        Active
      </span>
    </div>

    <div className="mt-5 grid gap-3 border-t border-[#e4e9f1] pt-5">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-[13px] font-medium text-[#64748b]">
          <UserRound size={15} strokeWidth={2} />
          Role
        </span>
        <span className="text-[13px] font-bold text-[#162033]">System Administrator</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-[13px] font-medium text-[#64748b]">
          <Mail size={15} strokeWidth={2} />
          Last login
        </span>
        <span className="text-[13px] font-bold text-[#162033]">Today, 10:42 AM</span>
      </div>
    </div>

    <LogoutButton />
  </DashboardPanel>
);

export default function SettingsPage() {
  return (
    <DashboardPageShell>
          <div>
            <h1 className="text-[24px] font-bold leading-8 text-[#111827]">Platform Configuration</h1>
            <p className="mt-1 text-[13px] font-medium leading-5 text-[#64748b]">
              Manage system-wide settings, commission rates, and content filters.
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div className="space-y-5">
              <SettingsCard title="Commission Settings" icon={Percent}>
                <div className="grid gap-5 md:grid-cols-2">
                  <SettingInput
                    id="standard-user-commission"
                    label="Standard User Commission (%)"
                    defaultValue="15.0"
                    suffix="%"
                  />
                  <SettingInput
                    id="student-user-commission"
                    label="Student-Verified User Commission (%)"
                    defaultValue="8.5"
                    suffix="%"
                  />
                </div>

                <div className="mt-7 flex gap-3 rounded-[7px] border-l-4 border-[#2f75ff] bg-[#eaf2ff] px-4 py-4">
                  <Info size={18} strokeWidth={2.2} className="mt-0.5 shrink-0 text-[#2f75ff]" />
                  <p className="text-[13px] font-medium leading-5 text-[#23314d]">
                    Changes to commission percentages apply only to{' '}
                    <strong className="font-bold text-[#111827]">future transactions</strong>. Current escrowed funds or
                    ongoing tasks will maintain the rates set at the time of agreement.
                  </p>
                </div>
              </SettingsCard>

              <SettingsCard title="Cancellation Settings" icon={Clock3}>
                <div className="grid gap-5 md:grid-cols-2">
                  <SettingInput
                    id="standard-cancellation-fee"
                    label="Standard Cancellation Fee (%)"
                    defaultValue="5.0"
                    suffix="%"
                  />
                  <SettingInput
                    id="provider-cancellation-fee"
                    label="Provider-Initiated Cancellation Fee (%)"
                    defaultValue="10.0"
                    suffix="%"
                  />
                </div>

                <div className="mt-5">
                  <SettingInput id="grace-period-hours" label="Grace Period (Hours)" defaultValue="3" suffix="Hrs" />
                  <p className="mt-2 text-[11px] font-medium leading-4 text-[#8a98ad]">
                    Time window after booking where no fee is charged.
                  </p>
                </div>
              </SettingsCard>
            </div>

            <aside className="space-y-5">
              <AdminProfileCard />

              <section className="relative overflow-hidden rounded-[10px] bg-[#1B3061] p-6 text-white shadow-[0_8px_22px_rgba(27,48,97,0.16)]">
                <div className="relative z-10">
                  <p className="text-[13px] font-medium leading-5 text-[#d7def0]">Total Monthly Revenue</p>
                  <p className="mt-2 text-[29px] font-bold leading-9">$42,890.00</p>
                  <p className="mt-5 flex items-center gap-2 text-[12px] font-semibold text-[#47dfad]">
                    <TrendingUp size={14} strokeWidth={2.1} />
                    +12.4% from last month
                  </p>
                </div>
                <WalletCards
                  size={94}
                  strokeWidth={1.8}
                  className="absolute -bottom-2 right-1 text-white/14"
                />
              </section>

              <section className="rounded-[10px] border border-[#dce4ef] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
                <div className="mb-7 flex items-center gap-3">
                  <CircleDollarSign size={17} strokeWidth={2.1} className="text-[#52617a]" />
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#66758e]">
                    Commission Impact
                  </h2>
                </div>

                <div className="space-y-7">
                  <ProgressRow
                    label="Standard Revenue"
                    value="$34,200"
                    widthClass="w-[80%]"
                    colorClass="bg-[#1B3061]"
                  />
                  <ProgressRow
                    label="Student Revenue"
                    value="$8,690"
                    widthClass="w-[22%]"
                    colorClass="bg-[#E68A2E]"
                  />
                </div>
              </section>
            </aside>
          </div>
    </DashboardPageShell>
  );
}
