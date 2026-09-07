import {
  Activity,
  Ban,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileBadge,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserRoundCheck,
  UserRoundCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Header, Sidebar } from '../components';
import UsersFilterToolbar from './UsersFilterToolbar';

type MetricCard = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  change?: string;
  changeTone?: 'positive' | 'negative';
  details?: { label: string; value: string }[];
  action?: string;
};

type SummaryCard = {
  title: string;
  value?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
  stats?: { label: string; value: string; dotClass: string }[];
};

type UserRole = 'Both' | 'Task Doer' | 'Task Poster';

type User = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  mobile: string;
  email: string;
  role: UserRole;
  lastInteraction: string;
};

const metrics: MetricCard[] = [
  {
    title: 'Total Users',
    value: '12,543',
    icon: Users,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
    change: '+12.5%',
    changeTone: 'positive',
    details: [
      { label: 'Normal:', value: '8,230' },
      { label: 'Student:', value: '4,313' },
    ],
  },
  {
    title: 'Role: Both',
    value: '5,120',
    icon: UserRoundCheck,
    iconClass: 'text-[#059669]',
    iconWrapClass: 'bg-[#dcfaee]',
    change: '+2.4%',
    changeTone: 'positive',
  },
  {
    title: 'Role: Task Doer',
    value: '4,215',
    icon: UserRoundCog,
    iconClass: 'text-[#7c3aed]',
    iconWrapClass: 'bg-[#f0e4ff]',
    change: '+5.1%',
    changeTone: 'positive',
  },
  {
    title: 'Role: Task Poster',
    value: '3,208',
    icon: FileBadge,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
    change: '-1.2%',
    changeTone: 'negative',
  },
  {
    title: 'Pending Approvals',
    value: '42',
    icon: Clock3,
    iconClass: 'text-[#d97706]',
    iconWrapClass: 'bg-[#fff0d8]',
    action: 'Verification Requests',
  },
];

const summaries: SummaryCard[] = [
  {
    title: 'Verification Status',
    icon: ShieldCheck,
    iconClass: 'text-[#6d5cff]',
    iconWrapClass: 'bg-[#ece8ff]',
    stats: [
      { label: 'Verified', value: '9,875', dotClass: 'bg-[#16a34a]' },
      { label: 'Unverified', value: '2,668', dotClass: 'bg-[#d18a00]' },
    ],
  },
  {
    title: 'User Activity',
    icon: Activity,
    iconClass: 'text-[#637083]',
    iconWrapClass: 'bg-[#eef2f6]',
    stats: [
      { label: 'Active', value: '8,230', dotClass: 'bg-[#0284c7]' },
      { label: 'Inactive', value: '1,420', dotClass: 'bg-[#9aa4b2]' },
    ],
  },
  {
    title: 'Total Suspended Users',
    value: '412',
    icon: Ban,
    iconClass: 'text-[#ef4444]',
    iconWrapClass: 'bg-[#ffe1e1]',
  },
  {
    title: 'Expired Student Users',
    value: '185',
    icon: FileBadge,
    iconClass: 'text-[#ea7a18]',
    iconWrapClass: 'bg-[#ffe9d7]',
  },
];

const users: User[] = [
  {
    id: '#CUS-0041',
    name: 'Sarah Mitchell',
    initials: 'SM',
    avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    mobile: '+61 412 345 678',
    email: 'sarah.m@example.com',
    role: 'Both',
    lastInteraction: 'Dec 01, 2024',
  },
  {
    id: '#CUS-0042',
    name: 'James Davis',
    initials: 'JD',
    avatarClass: 'bg-[#eedcff] text-[#8b5cf6]',
    mobile: '+61 433 999 111',
    email: 'james.davis@work.com',
    role: 'Task Doer',
    lastInteraction: 'Dec 07, 2024',
  },
  {
    id: '#CUS-0043',
    name: 'Emma Wilson',
    initials: 'EW',
    avatarClass: 'bg-[#cbf7e6] text-[#059669]',
    mobile: '+61 488 222 333',
    email: 'emma.w@agency.com',
    role: 'Task Poster',
    lastInteraction: 'Dec 14, 2024',
  },
  {
    id: '#CUS-0044',
    name: 'Tom Richards',
    initials: 'TR',
    avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    mobile: '+61 411 555 777',
    email: 'tom.r@example.com',
    role: 'Task Poster',
    lastInteraction: 'Dec 19, 2024',
  },
  {
    id: '#CUS-0045',
    name: 'Alice Lee',
    initials: 'AL',
    avatarClass: 'bg-[#ffe0e3] text-[#f43f5e]',
    mobile: '+61 455 123 789',
    email: 'alice.lee@mail.com',
    role: 'Both',
    lastInteraction: 'Dec 20, 2024',
  },
];

const roleStyles: Record<UserRole, string> = {
  Both: 'bg-[#dcf7e9] text-[#047857]',
  'Task Doer': 'bg-[#f2e6ff] text-[#7e22ce]',
  'Task Poster': 'bg-[#eef2ff] text-[#1B3061]',
};

const TrendIcon = ({ tone }: { tone: 'positive' | 'negative' }) =>
  tone === 'positive' ? (
    <TrendingUp size={15} strokeWidth={2.2} />
  ) : (
    <TrendingDown size={15} strokeWidth={2.2} />
  );

export default function UsersPage() {
  return (
    <div className="app-shell flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />

      <main className="dashboard-main flex-1 pl-[var(--layout-sidebar-current)] transition-[padding] duration-300 max-md:pl-0">
        <Header />

        <div className="dashboard-container px-8 pb-10 pt-5 max-sm:px-4">
          <div className="animate-dashboard-entry space-y-6">
            <section
              aria-label="User metrics"
              className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
            >
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <article
                    key={metric.title}
                    className="dashboard-interactive flex min-h-[150px] flex-col justify-between rounded-[10px] border border-[#dde5f1] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-medium leading-4 text-[#596982]">
                        {metric.title}
                      </p>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-[6px] ${metric.iconWrapClass}`}
                      >
                        <Icon className={metric.iconClass} size={15} strokeWidth={2.1} />
                      </span>
                    </div>

                    <div>
                      {!metric.action ? (
                        <div className="flex flex-wrap items-end justify-between gap-2">
                          <p className="text-[25px] font-bold leading-8 text-[#202b3d]">
                            {metric.value}
                          </p>
                          {metric.change ? (
                            <span
                              className={`mb-1 inline-flex items-center gap-1 text-[12px] font-bold ${
                                metric.changeTone === 'negative'
                                  ? 'text-[#f43f5e]'
                                  : 'text-[#059669]'
                              }`}
                            >
                              <TrendIcon tone={metric.changeTone ?? 'positive'} />
                              {metric.change}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {metric.details ? (
                        <div className="mt-5 grid grid-cols-2 gap-3 text-[10px] leading-3 text-[#596982]">
                          {metric.details.map((detail) => (
                            <div key={detail.label}>
                              <p>{detail.label}</p>
                              <p className="mt-0.5 font-medium">{detail.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {metric.action ? (
                        <div className="mt-7 flex items-end justify-between gap-3">
                          <p className="text-[25px] font-bold leading-8 text-[#111827]">
                            {metric.value}
                          </p>
                          <a
                            href="#"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0b63ce]"
                          >
                            {metric.action}
                            <ChevronRight size={13} strokeWidth={2.3} />
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </section>

            <section
              aria-label="User status summaries"
              className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 xl:max-w-[calc(80%-5px)]"
            >
              {summaries.map((summary) => {
                const Icon = summary.icon;
                return (
                  <article
                    key={summary.title}
                    className="dashboard-interactive flex min-h-[150px] flex-col justify-between rounded-[10px] border border-[#dde5f1] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[13px] font-medium leading-4 text-[#596982]">
                        {summary.title}
                      </p>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-[6px] ${summary.iconWrapClass}`}
                      >
                        <Icon className={summary.iconClass} size={15} strokeWidth={2.1} />
                      </span>
                    </div>

                    {summary.stats ? (
                      <div className="grid grid-cols-2 gap-5">
                        {summary.stats.map((stat) => (
                          <div key={stat.label}>
                            <p className="text-[10px] font-bold tracking-[0.14em] text-[#374151]">
                              {stat.label}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <p className="text-[17px] font-bold leading-5 text-[#111827]">
                                {stat.value}
                              </p>
                              <span className={`h-1.5 w-1.5 rounded-full ${stat.dotClass}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[25px] font-bold leading-8 text-[#202b3d]">
                        {summary.value}
                      </p>
                    )}
                  </article>
                );
              })}
            </section>

            <section className="relative overflow-visible rounded-[10px] border border-[#dde5f1] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <UsersFilterToolbar />

              <div className="overflow-x-auto">
                <table className="ui-table min-w-[920px] table-fixed">
                  <thead>
                    <tr className="ui-table-head h-[42px] text-left">
                      <th className="w-[12%] px-5 text-[11px]">ID</th>
                      <th className="w-[17%] px-5 text-[11px]">Name</th>
                      <th className="w-[17%] px-5 text-[11px]">Mobile No</th>
                      <th className="w-[21%] px-5 text-[11px]">Email</th>
                      <th className="w-[13%] px-5 text-[11px]">Role</th>
                      <th className="w-[14%] px-5 text-[11px]">Last Interaction</th>
                      <th className="w-[16%] px-5 text-right text-[11px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="ui-table-row h-[58px]">
                        <td className="px-5 text-[13px] font-medium text-[#49627f]">{user.id}</td>
                        <td className="px-5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${user.avatarClass}`}
                            >
                              {user.initials}
                            </span>
                            <span className="truncate text-[13px] font-bold text-[#1f2937]">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 text-[13px] text-[#49627f]">{user.mobile}</td>
                        <td className="px-5 text-[13px] text-[#49627f]">{user.email}</td>
                        <td className="px-5">
                          <span className={`status-badge ${roleStyles[user.role]}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 text-center text-[13px] text-[#64748b]">
                          {user.lastInteraction}
                        </td>
                        <td className="px-5 text-right">
                          <Link
                            href={`/users/${user.id.replace('#', '')}`}
                            className="inline-flex h-8 items-center justify-center gap-2 rounded-[7px] border border-[#c9d0e8] px-3 text-[12px] font-bold text-[#1B3061] transition-colors hover:bg-[#f3f6ff]"
                          >
                            <Eye size={14} strokeWidth={2.1} />
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf3] px-5 py-4">
                <p className="text-[13px] text-[#64748b]">Showing 1-10 of 248 customers</p>
                <nav className="flex items-center gap-2" aria-label="Users pagination">
                  <button type="button" className="text-[#b0bac9]" aria-label="Previous page">
                    <ChevronLeft size={16} strokeWidth={2.2} />
                  </button>
                  {['1', '2', '3', '...', '25'].map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`flex h-7 min-w-7 items-center justify-center rounded-[4px] px-2 text-[12px] font-semibold ${
                        page === '1'
                          ? 'bg-[#1B3061] text-white'
                          : 'text-[#334155] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button type="button" className="text-[#94a3b8]" aria-label="Next page">
                    <ChevronRight size={16} strokeWidth={2.2} />
                  </button>
                </nav>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
