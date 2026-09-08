import {
  AlertTriangle,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  ListFilter,
  PackageOpen,
  PlayCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  DashboardPageShell,
  DashboardPanel,
  DashboardPrimaryButton,
  DashboardSearchField,
  DashboardSelectButton,
  cn,
} from '../components';

type MetricTone = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'slate';

type TaskMetric = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
  action?: string;
};

type TaskStatus = 'In Progress' | 'Pending' | 'Dispute' | 'Cancelled';

type TaskRow = {
  serial: string;
  id: string;
  title: string;
  poster: {
    name: string;
    initials: string;
    avatarClass: string;
  };
  doer: {
    name: string;
    initials: string;
    avatarClass: string;
    note?: string;
  };
  category: string;
  service: string;
  status: TaskStatus;
  dateCreated: string;
};

const metricToneClasses: Record<MetricTone, { value: string; icon: string; iconWrap: string }> = {
  blue: {
    value: 'text-[#2563eb]',
    icon: 'text-[#2563eb]',
    iconWrap: 'bg-[#eef4ff]',
  },
  green: {
    value: 'text-[#10b981]',
    icon: 'text-[#10b981]',
    iconWrap: 'bg-[#e8fbf2]',
  },
  amber: {
    value: 'text-[#f59e0b]',
    icon: 'text-[#f59e0b]',
    iconWrap: 'bg-[#fff7e6]',
  },
  purple: {
    value: 'text-[#a855f7]',
    icon: 'text-[#a855f7]',
    iconWrap: 'bg-[#f6edff]',
  },
  red: {
    value: 'text-[#ef4444]',
    icon: 'text-[#ef4444]',
    iconWrap: 'bg-[#fff0f0]',
  },
  slate: {
    value: 'text-[#475569]',
    icon: 'text-[#64748b]',
    iconWrap: 'bg-[#f1f5f9]',
  },
};

const taskMetrics: TaskMetric[] = [
  { title: 'Total Tasks', value: '1,284', icon: ClipboardList, tone: 'blue' },
  { title: 'Active', value: '342', icon: PlayCircle, tone: 'green' },
  { title: 'Pending', value: '198', icon: Clock3, tone: 'amber' },
  { title: 'Tasks With No Offers', value: '156', icon: PackageOpen, tone: 'purple', action: 'View All' },
  { title: 'Disputes', value: '24', icon: AlertTriangle, tone: 'red' },
  { title: 'Completed', value: '744', icon: CheckCircle2, tone: 'slate' },
];

const taskRows: TaskRow[] = [
  {
    serial: '1',
    id: '#TSK-4421',
    title: 'House Cleaning - 3BR',
    poster: {
      name: 'Sarah J.',
      initials: 'SJ',
      avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    },
    doer: {
      name: 'Mike T.',
      initials: 'MT',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    category: 'In Person',
    service: 'Residential Cleaning',
    status: 'In Progress',
    dateCreated: '12 Jun 2025',
  },
  {
    serial: '2',
    id: '#TSK-4422',
    title: 'Lawn Mowing - Weekly',
    poster: {
      name: 'David J.',
      initials: 'DJ',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    doer: {
      name: 'Unassigned',
      initials: '',
      avatarClass: '',
      note: '3 Offers',
    },
    category: 'In Person',
    service: 'Gardening and Lawn Care',
    status: 'Pending',
    dateCreated: '12 Jun 2025',
  },
  {
    serial: '3',
    id: '#TSK-4423',
    title: 'Bathroom Deep Clean',
    poster: {
      name: 'John Doe',
      initials: 'JD',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    doer: {
      name: 'Sarah Jenkins',
      initials: 'SJ',
      avatarClass: 'bg-[#e5e7eb] text-[#64748b]',
    },
    category: 'In Person',
    service: 'Deep Cleaning',
    status: 'Dispute',
    dateCreated: '15 Jun 2025',
  },
  {
    serial: '4',
    id: '#TSK-4424',
    title: 'Cancelled Cleaning Visit',
    poster: {
      name: 'Elena Rodriguez',
      initials: 'ER',
      avatarClass: 'bg-[#eef2ff] text-[#1B3061]',
    },
    doer: {
      name: 'Mike T.',
      initials: 'MT',
      avatarClass: 'bg-[#e5e7eb] text-[#334155]',
    },
    category: 'In Person',
    service: 'Residential Cleaning',
    status: 'Cancelled',
    dateCreated: '13 Jun 2025',
  },
];

const statusClass: Record<TaskStatus, string> = {
  'In Progress': 'bg-[#dbeafe] text-[#2563eb]',
  Pending: 'bg-[#fff0d7] text-[#d97706]',
  Dispute: 'bg-[#ffe1e1] text-[#dc2626]',
  Cancelled: 'bg-[#fee2e2] text-[#dc2626]',
};

const TaskMetricCard = ({ metric }: { metric: TaskMetric }) => {
  const Icon = metric.icon;
  const tone = metricToneClasses[metric.tone];

  return (
    <article className="dashboard-interactive flex min-h-[82px] flex-col justify-between rounded-[8px] border border-[#dde5f1] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#374151]">
          {metric.title}
        </p>
        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', tone.iconWrap)}>
          <Icon size={15} strokeWidth={2.15} className={tone.icon} />
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className={cn('text-[27px] font-bold leading-8', tone.value)}>{metric.value}</p>
        {metric.action ? (
          <a href="#" className="mb-0.5 text-[11px] font-bold leading-4 text-[#2563eb]">
            {metric.action}
          </a>
        ) : null}
      </div>
    </article>
  );
};

const Avatar = ({
  initials,
  className,
}: {
  initials: string;
  className: string;
}) => (
  <span
    className={cn(
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold',
      className,
    )}
  >
    {initials}
  </span>
);

const TasksPage = () => (
  <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
    <div className="animate-dashboard-entry space-y-5">
      <section
        aria-label="Task metrics"
        className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5"
      >
        {taskMetrics.map((metric) => (
          <TaskMetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <DashboardPanel className="rounded-[8px]">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e6ebf3] px-4 py-4">
          <DashboardSearchField
            placeholder="Search tasks title/customer/provider..."
            className="h-9 min-w-[300px] flex-1"
          />
          <DashboardSelectButton className="h-9 min-w-[88px]">
            Suburbs: All
          </DashboardSelectButton>
          <DashboardSelectButton className="h-9 min-w-[82px]">
            States: All
          </DashboardSelectButton>
          <DashboardSelectButton className="h-9 min-w-[84px]">
            Status: All
          </DashboardSelectButton>
          <DashboardSelectButton className="h-9 min-w-[82px]">
            Tasks: All
          </DashboardSelectButton>
          <DashboardSelectButton className="h-9 min-w-[126px]">
            <span>Date Created:</span>
            <CalendarDays size={13} strokeWidth={2.2} className="text-[#64748b]" />
          </DashboardSelectButton>
          <DashboardPrimaryButton className="h-9 px-4">
            <ListFilter size={13} strokeWidth={2.3} />
            Filter
          </DashboardPrimaryButton>
        </div>

        <div className="overflow-x-auto">
          <table className="ui-table min-w-[1080px] table-fixed">
            <thead>
              <tr className="ui-table-head h-[42px] text-left">
                <th className="w-[6%] px-5 text-[10px]">SL NO.</th>
                <th className="w-[9%] px-4 text-[10px]">Task ID</th>
                <th className="w-[17%] px-4 text-[10px]">Task Title</th>
                <th className="w-[12%] px-4 text-[10px]">Poster</th>
                <th className="w-[15%] px-4 text-[10px]">Doer</th>
                <th className="w-[9%] px-4 text-[10px]">Category</th>
                <th className="w-[15%] px-4 text-[10px]">Service</th>
                <th className="w-[10%] px-4 text-[10px]">Status</th>
                <th className="w-[11%] px-4 text-[10px]">Date Created</th>
                <th className="w-[7%] px-5 text-right text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {taskRows.map((task) => (
                <tr key={task.id} className="ui-table-row h-[58px]">
                  <td className="px-5 text-[13px] font-medium text-[#111827]">{task.serial}</td>
                  <td className="px-4 text-[12px] font-medium text-[#334155]">{task.id}</td>
                  <td className="px-4 text-[12px] font-bold text-[#1f2937]">{task.title}</td>
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <Avatar initials={task.poster.initials} className={task.poster.avatarClass} />
                      <span className="truncate text-[12px] font-medium text-[#334155]">
                        {task.poster.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4">
                    {task.doer.note ? (
                      <span className="text-[12px] font-medium italic text-[#334155]">
                        {task.doer.name}{' '}
                        <span className="not-italic text-[#10b981]">({task.doer.note})</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar initials={task.doer.initials} className={task.doer.avatarClass} />
                        <span className="truncate text-[12px] font-medium text-[#334155]">
                          {task.doer.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4">
                    <span className="status-badge bg-[#fff0d7] text-[#d97706]">{task.category}</span>
                  </td>
                  <td className="px-4 text-[12px] font-medium text-[#475569]">{task.service}</td>
                  <td className="px-4">
                    <span className={cn('status-badge', statusClass[task.status])}>{task.status}</span>
                  </td>
                  <td className="px-4 text-[12px] font-medium text-[#475569]">{task.dateCreated}</td>
                  <td className="px-5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/tasks/${task.id.replace('#', '')}?status=${encodeURIComponent(task.status)}`}
                        aria-label={`View ${task.id}`}
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#eef2ff]',
                          task.status === 'Dispute' ? 'text-[#ef4444]' : 'text-[#2563eb]',
                        )}
                      >
                        <Eye size={14} strokeWidth={2.1} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Bookmark ${task.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-[#f1f5f9] hover:text-[#1B3061]"
                      >
                        <Bookmark size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </div>
  </DashboardPageShell>
);

export default TasksPage;
