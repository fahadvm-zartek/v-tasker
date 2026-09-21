'use client';

import { AlertTriangle, Bookmark, CheckCircle2, ClipboardList, Clock3, Eye, PackageOpen, PlayCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DashboardPageShell, DashboardPagination, DashboardPanel, cn } from '../../../components';
import { fetchTasksPage } from '../../../services/taskService';
import type { TaskMetrics, TaskSummary } from '../../../services/taskService';

type MetricTone = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'slate';
type TaskMetric = { title: string; key: keyof TaskMetrics; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; tone: MetricTone };

const EMPTY_METRICS: TaskMetrics = { totalTasks: 'N/A', active: 'N/A', pending: 'N/A', noOffers: 'N/A', disputes: 'N/A', completed: 'N/A' };
const PAGE_SIZE = 10;
const metricToneClasses = {
  blue: { value: 'text-[#2563eb]', icon: 'text-[#2563eb]', iconWrap: 'bg-[#eef4ff]' },
  green: { value: 'text-[#10b981]', icon: 'text-[#10b981]', iconWrap: 'bg-[#e8fbf2]' },
  amber: { value: 'text-[#f59e0b]', icon: 'text-[#f59e0b]', iconWrap: 'bg-[#fff7e6]' },
  purple: { value: 'text-[#a855f7]', icon: 'text-[#a855f7]', iconWrap: 'bg-[#f6edff]' },
  red: { value: 'text-[#ef4444]', icon: 'text-[#ef4444]', iconWrap: 'bg-[#fff0f0]' },
  slate: { value: 'text-[#475569]', icon: 'text-[#64748b]', iconWrap: 'bg-[#f1f5f9]' },
} satisfies Record<MetricTone, { value: string; icon: string; iconWrap: string }>;
const metricDefinitions: TaskMetric[] = [
  { title: 'Total Tasks', key: 'totalTasks', icon: ClipboardList, tone: 'blue' },
  { title: 'Active', key: 'active', icon: PlayCircle, tone: 'green' },
  { title: 'Pending', key: 'pending', icon: Clock3, tone: 'amber' },
  { title: 'Tasks With No Offers', key: 'noOffers', icon: PackageOpen, tone: 'purple' },
  { title: 'Disputes', key: 'disputes', icon: AlertTriangle, tone: 'red' },
  { title: 'Completed', key: 'completed', icon: CheckCircle2, tone: 'slate' },
];
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics>(EMPTY_METRICS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchTasksPage({ page: currentPage, pageSize: PAGE_SIZE, search: submittedSearch })
      .then((taskPage) => {
        if (!isMounted) return;
        setTasks(taskPage.tasks); setMetrics(taskPage.metrics); setTotalTasks(taskPage.count);
        setHasNextPage(Boolean(taskPage.next)); setHasPreviousPage(Boolean(taskPage.previous));
      })
      .catch(() => {
        if (!isMounted) return;
        setTasks([]); setMetrics(EMPTY_METRICS); setTotalTasks(0); setHasNextPage(false); setHasPreviousPage(false);
      });
    return () => { isMounted = false; };
  }, [currentPage, submittedSearch]);

  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));
  const paginationPages = useMemo(() => Array.from({ length: totalPages }, (_, index) => String(index + 1)), [totalPages]);
  const firstItem = tasks.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = tasks.length ? Math.min(firstItem + tasks.length - 1, totalTasks) : 0;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault(); setCurrentPage(1); setSubmittedSearch(search.trim());
  };

  return (
    <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
      <div className="animate-dashboard-entry space-y-5">
        <section aria-label="Task metrics" className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5">
          {metricDefinitions.map((metric) => {
            const Icon = metric.icon; const tone = metricToneClasses[metric.tone];
            return <article key={metric.title} className="dashboard-interactive flex min-h-[82px] flex-col justify-between rounded-[8px] border border-[#dde5f1] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3"><p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#374151]">{metric.title}</p><span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', tone.iconWrap)}><Icon size={15} strokeWidth={2.15} className={tone.icon} /></span></div>
              <p className={cn('text-[27px] font-bold leading-8', tone.value)}>{metrics[metric.key]}</p>
            </article>;
          })}
        </section>
        <DashboardPanel className="rounded-[8px]">
          <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-[#e6ebf3] px-4 py-4">
            <label className="relative block h-9 min-w-[300px] flex-1"><Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8190a6]" size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks title/customer/provider..." className="ui-control h-full w-full pl-9 pr-3 text-[11px] placeholder:text-[#93a0b4]" /></label>
            <button type="submit" className="ui-button-primary h-9 px-4 text-[12px]">Search</button>
          </form>
          <div className="overflow-x-auto"><table className="ui-table min-w-[1080px] table-fixed">
            <thead><tr className="ui-table-head h-[42px] text-left">{['SL NO.', 'Task ID', 'Task Title', 'Poster', 'Doer', 'Category', 'Service', 'Status', 'Date Created', 'Action'].map((heading) => <th key={heading} className="px-4 text-[10px]">{heading}</th>)}</tr></thead>
            <tbody>{tasks.length > 0 ? tasks.map((task) => <tr key={task.routeId} className="ui-table-row h-[58px]">
              <td className="px-4 text-[13px] text-[#111827]">{task.serial}</td><td className="px-4 text-[12px] text-[#334155]">{task.id}</td><td className="px-4 text-[12px] font-bold text-[#1f2937]">{task.title}</td>
              {[task.poster, task.doer].map((person, index) => <td key={index} className="px-4"><div className="flex items-center gap-2"><span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold', person.avatarClass)}>{person.initials}</span><span className="truncate text-[12px] text-[#334155]">{person.name}</span></div></td>)}
              <td className="px-4"><span className="status-badge bg-[#fff0d7] text-[#d97706]">{task.category}</span></td><td className="px-4 text-[12px] text-[#475569]">{task.service}</td><td className="px-4"><span className={cn('status-badge', getStatusCapsuleClass(task.status))}>{task.status}</span></td><td className="px-4 text-[12px] text-[#475569]">{task.dateCreated}</td>
              <td className="px-4"><div className="flex justify-end gap-2"><Link href={`/tasks/${encodeURIComponent(task.routeId)}?status=${encodeURIComponent(task.status)}`} aria-label={`View ${task.id}`} className="ui-icon-button h-7 w-7 text-[#2563eb]"><Eye size={14} /></Link><button type="button" aria-label={`Bookmark ${task.id}`} className="ui-icon-button h-7 w-7 text-[#94a3b8]"><Bookmark size={14} /></button></div></td>
            </tr>) : <tr className="ui-table-row h-[58px]">{Array.from({ length: 10 }, (_, index) => <td key={index} className="px-4 text-[12px] text-[#64748b]">N/A</td>)}</tr>}</tbody>
          </table></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf3] px-5 py-4"><p className="text-[13px] text-[#64748b]">Showing {firstItem}-{lastItem} of {totalTasks} tasks</p><DashboardPagination pages={paginationPages} activePage={String(currentPage)} label="Tasks pagination" onPageChange={(page) => setCurrentPage(Number(page))} onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))} onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} isPreviousDisabled={!hasPreviousPage} isNextDisabled={!hasNextPage} /></div>
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
