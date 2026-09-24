'use client';

import { AlertTriangle, CheckCircle2, ClipboardList, Clock3, Eye, PackageOpen, PlayCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DashboardPageShell, DashboardPagination, DashboardPanel, cn } from '../../../components';
import { fetchTasksPage } from '../../../services/taskService';
import type { TaskMetrics, TaskSummary, TaskRequestOptions } from '../../../services/taskService';
import { getTaskDateRange } from '../../../services/taskFilters';
import { fetchAllStates, fetchAllSuburbs } from '../../../services/locationService';
import type { StateRegion, Suburb } from '../../../services/locationService';

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
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('');
  const [offers, setOffers] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<TaskRequestOptions>({});
  const [loadError, setLoadError] = useState('');
  const [loadedRequest, setLoadedRequest] = useState('');
  const requestKey = JSON.stringify([currentPage, appliedFilters]);
  const isPending = loadedRequest !== requestKey;
  const [states, setStates] = useState<StateRegion[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllStates().then((items) => { if (isMounted) setStates(items); });
    const loadSuburbs = async () => {
      const first = await fetchAllSuburbs();
      const items = [...first.suburbs];
      for (let page = 2; page <= first.totalPages && isMounted; page++) {
        const next = await fetchAllSuburbs({ page });
        items.push(...next.suburbs);
      }
      if (isMounted) setSuburbs(items);
    };
    void loadSuburbs();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchTasksPage({ ...appliedFilters, page: currentPage, pageSize: PAGE_SIZE })
      .then((taskPage) => {
        if (!isMounted) return;
        setLoadError('');
        setTasks(taskPage.tasks); setMetrics(taskPage.metrics); setTotalTasks(taskPage.count);
        setHasNextPage(Boolean(taskPage.next)); setHasPreviousPage(Boolean(taskPage.previous));
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError('Unable to load tasks. Please try again.');
        setTasks([]); setMetrics(EMPTY_METRICS); setTotalTasks(0); setHasNextPage(false); setHasPreviousPage(false);
      }).finally(() => { if (isMounted) { setLoadedRequest(requestKey); } });
    return () => { isMounted = false; };
  }, [currentPage, appliedFilters, requestKey]);

  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));
  const paginationPages = useMemo(() => Array.from({ length: totalPages }, (_, index) => String(index + 1)), [totalPages]);
  const firstItem = tasks.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = tasks.length ? Math.min(firstItem + tasks.length - 1, totalTasks) : 0;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const dateRange = getTaskDateRange(datePreset, startDate, endDate);
      setLoadedRequest('');
      setAppliedFilters({ search: search.trim(), suburb, state, status, hasOffers: offers === '' ? undefined : offers === 'true', ...dateRange });
      setCurrentPage(1);
      setFilterError('');
    } catch (error) {
      setFilterError(error instanceof Error ? error.message : 'Invalid date range.');
    }
  };

  return (
    <DashboardPageShell contentClassName="px-5 pb-10 pt-5">
      <div className="animate-dashboard-entry space-y-5">
        <section aria-label="Task metrics" className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5">
          {metricDefinitions.map((metric) => {
            const Icon = metric.icon; const tone = metricToneClasses[metric.tone];
            return <article key={metric.title} className="dashboard-interactive flex min-h-[82px] flex-col justify-between rounded-[8px] border border-[#dde5f1] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3"><p className="text-[10px] font-bold uppercase leading-3 tracking-[0.08em] text-[#374151]">{metric.title}</p><span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', tone.iconWrap)}><Icon size={15} strokeWidth={2.15} className={tone.icon} /></span></div>
              <p className={cn('text-[27px] font-bold leading-8', tone.value)}>{isPending ? <span aria-label="Loading metric" className="block h-8 w-16 animate-pulse rounded bg-slate-200" /> : metrics[metric.key]}</p>
            </article>;
          })}
        </section>
        <DashboardPanel className="rounded-[8px]">
          <form onSubmit={submitSearch} className="border-b border-[#e6ebf3] px-4 py-4">
            <div className="flex flex-nowrap items-end gap-3 overflow-x-auto pb-2">
            <label className="relative block h-9 min-w-[220px] flex-1"><Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8190a6]" size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks title/customer/provider..." className="ui-control h-full w-full pl-9 pr-3 text-[11px] placeholder:text-[#93a0b4]" /></label>
            <button type="submit" className="ui-button-primary h-9 shrink-0 px-4 text-[12px]">Search</button>
            <div className="flex shrink-0 flex-nowrap items-end gap-3">
              <label className="text-[11px] font-medium text-[#64748b]">Suburbs
                <select value={suburb} onChange={(event) => setSuburb(event.target.value)} className="ui-control mt-1 block h-9 w-[135px] px-3 text-[12px]">
                  <option value="">All</option>
                  {[...new Set(suburbs.map((item) => item.name))].sort().map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-medium text-[#64748b]">States
                <select value={state} onChange={(event) => setState(event.target.value)} className="ui-control mt-1 block h-9 w-[145px] px-3 text-[12px]">
                  <option value="">All</option>
                  {states.map((item) => <option key={item.id} value={item.code || item.name}>{item.name}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-medium text-[#64748b]">Status
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="ui-control mt-1 block h-9 w-[110px] px-3 text-[12px]">
                  <option value="">All</option>
                  {['Pending', 'Active', 'Completed', 'Cancelled', 'Dispute', 'Deleted'].map((label) => <option key={label} value={label.toLowerCase()}>{label}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-medium text-[#64748b]">Tasks
                <select value={offers} onChange={(event) => setOffers(event.target.value)} className="ui-control mt-1 block h-9 w-[125px] px-3 text-[12px]">
                  <option value="">All</option><option value="true">With offers</option><option value="false">Without offers</option>
                </select>
              </label>
              <label className="text-[11px] font-medium text-[#64748b]">Date Created
                <select value={datePreset} onChange={(event) => { setDatePreset(event.target.value); setFilterError(''); }} className="ui-control mt-1 block h-9 w-[130px] px-3 text-[12px]">
                  <option value="all">All Time</option><option value="today">Today</option><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="custom">Custom Range</option>
                </select>
              </label>
              {datePreset === 'custom' && <>
                <label className="text-[11px] font-medium text-[#64748b]">From<input type="date" required value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="ui-control mt-1 block h-9 px-3 text-[12px]" /></label>
                <label className="text-[11px] font-medium text-[#64748b]">To<input type="date" required value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="ui-control mt-1 block h-9 px-3 text-[12px]" /></label>
              </>}
              <button type="submit" className="ui-button-primary h-9 px-4 text-[12px]">Filter</button>
            </div>
            </div>
            {filterError && <p role="alert" className="w-full text-[12px] text-red-600">{filterError}</p>}
          </form>
          <div className="overflow-x-auto"><table className="ui-table min-w-[1080px] table-fixed">
            <thead><tr className="ui-table-head h-[42px] text-left">{['SL NO.', 'Task ID', 'Task Title', 'Poster', 'Doer', 'Category', 'Service', 'Status', 'Date Created', 'Action'].map((heading) => <th key={heading} className={cn('px-4 text-[10px]', heading === 'Action' && 'text-center')}>{heading}</th>)}</tr></thead>
            <tbody>{isPending ? <tr><td colSpan={10} className="px-4 py-6"><div role="status" aria-busy="true"><span className="sr-only">Loading tasks</span><div aria-hidden="true" className="animate-pulse space-y-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-8 rounded bg-slate-200" />)}</div></div></td></tr> : loadError ? <tr><td colSpan={10} className="px-4 py-8 text-center text-[12px] text-[#64748b]"><p role="alert">{loadError}</p></td></tr> : tasks.length > 0 ? tasks.map((task) => <tr key={task.routeId} className="ui-table-row h-[58px]">
              <td className="px-4 text-[13px] text-[#111827]">{task.serial}</td><td className="px-4 text-[12px] text-[#334155]">{task.id}</td><td className="px-4 text-[12px] font-bold text-[#1f2937]">{task.title}</td>
              {[task.poster, task.doer].map((person, index) => <td key={index} className="px-4"><div className="flex items-center gap-2"><span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold', person.avatarClass)}>{person.initials}</span><span className="truncate text-[12px] text-[#334155]">{person.name}</span></div></td>)}
              <td className="px-4"><span className="status-badge bg-[#fff0d7] text-[#d97706]">{task.category}</span></td><td className="px-4 text-[12px] text-[#475569]">{task.service}</td><td className="px-4"><span className={cn('status-badge', getStatusCapsuleClass(task.status))}>{task.status}</span></td><td className="px-4 text-[12px] text-[#475569]">{task.dateCreated}</td>
              <td className="px-4"><div className="flex justify-center gap-2"><Link href={`/tasks/${encodeURIComponent(task.routeId)}?status=${encodeURIComponent(task.status)}`} aria-label={`View ${task.id}`} className="ui-icon-button h-7 w-7 text-[#2563eb]"><Eye size={14} /></Link></div></td>
            </tr>) : <tr className="ui-table-row h-[58px]"><td colSpan={10} className="px-4 py-8 text-center text-[12px] text-[#64748b]">No tasks found matching your filters.</td></tr>}</tbody>
          </table></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf3] px-5 py-4"><p className="text-[13px] text-[#64748b]">{isPending ? 'Loading tasks...' : `Showing ${firstItem}-${lastItem} of ${totalTasks} tasks`}</p><DashboardPagination pages={paginationPages} activePage={String(currentPage)} label="Tasks pagination" onPageChange={(page) => setCurrentPage(Number(page))} onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))} onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} isPreviousDisabled={isPending || !hasPreviousPage} isNextDisabled={isPending || !hasNextPage} /></div>
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
