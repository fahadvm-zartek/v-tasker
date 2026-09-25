'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchUserTaskHistory, filterUserTaskHistory } from '../../../../services/userTaskHistory';
import type { UserTaskHistoryRow, UserTaskHistoryFilters } from '../../../../services/userTaskHistory';
import { getTaskDateRange } from '../../../../services/taskFilters';

const PAGE_SIZE = 10;
const statuses = ['DRAFT', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'EXPIRED', 'CANCELLED'];

export default function TaskHistoryPanel({ userId }: { userId: string }) {
  const [rows, setRows] = useState<UserTaskHistoryRow[]>([]);
  const [loadedUser, setLoadedUser] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [role, setRole] = useState<'poster' | 'doer'>('doer');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState('');
  const [filters, setFilters] = useState<Omit<UserTaskHistoryFilters, 'role'>>({});
  const [page, setPage] = useState(1);
  const loading = loadedUser !== userId;

  useEffect(() => {
    const controller = new AbortController();
    fetchUserTaskHistory(userId, { signal: controller.signal })
      .then(items => {
        if (controller.signal.aborted) return;
        setRows(items); setError(''); setLoadedUser(userId);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setRows([]); setError('Unable to load task history. Please try again.'); setLoadedUser(userId);
      });
    return () => controller.abort();
  }, [userId, attempt]);

  const filtered = useMemo(() => filterUserTaskHistory(rows, { ...filters, role }), [rows, filters, role]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filtered.slice(start, start + PAGE_SIZE);

  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    try {
      setFilters({ search: search.trim(), status, ...getTaskDateRange(datePreset, startDate, endDate) });
      setFilterError(''); setPage(1);
    } catch (error) {
      setFilterError(error instanceof Error ? error.message : 'Invalid date range.');
    }
  };
  const reset = () => {
    setSearch(''); setStatus(''); setDatePreset('all'); setStartDate(''); setEndDate('');
    setFilters({}); setFilterError(''); setPage(1);
  };

  return (
    <section aria-label="Task History" className="space-y-4 p-4">
      <div role="tablist" aria-label="Task activity role" className="flex gap-6 border-b border-[#d9e2ef]">
        {(['poster', 'doer'] as const).map(value => (
          <button key={value} id={`task-history-${value}`} type="button" role="tab" aria-selected={role === value} aria-controls="task-history-results"
            onClick={() => { setRole(value); setPage(1); }}
            className={`h-10 border-b-2 text-[12px] font-bold ${role === value ? 'border-[#1B3061] text-[#1B3061]' : 'border-transparent text-[#75849a]'}`}>
            {value === 'poster' ? 'Task Poster' : 'Task Doer'}
          </button>
        ))}
      </div>
      <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3 rounded-lg border border-[#dfe7f2] bg-white p-4">
        <label className="min-w-[200px] flex-1 text-xs text-[#64748b]">Search tasks
          <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search task ID, title, poster or doer..." className="ui-control mt-1 block h-9 w-full px-3 text-xs" />
        </label>
        <label className="text-xs text-[#64748b]">Task Status
          <select value={status} onChange={event => setStatus(event.target.value)} className="ui-control mt-1 block h-9 px-3 text-xs">
            <option value="">All</option>
            {statuses.map(value => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <label className="text-xs text-[#64748b]">Date Created
          <select value={datePreset} onChange={event => setDatePreset(event.target.value)} className="ui-control mt-1 block h-9 px-3 text-xs">
            <option value="all">All Time</option><option value="today">Today</option><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="custom">Custom Range</option>
          </select>
        </label>
        {datePreset === 'custom' && <>
          <label className="text-xs text-[#64748b]">From<input type="date" required value={startDate} max={endDate || undefined} onChange={event => setStartDate(event.target.value)} className="ui-control mt-1 block h-9 px-3" /></label>
          <label className="text-xs text-[#64748b]">To<input type="date" required value={endDate} min={startDate || undefined} onChange={event => setEndDate(event.target.value)} className="ui-control mt-1 block h-9 px-3" /></label>
        </>}
        <button type="submit" className="ui-button-primary h-9 px-4 text-xs">Filter</button>
        <button type="button" onClick={reset} className="ui-button-secondary h-9 px-4 text-xs">Reset</button>
        {filterError && <p role="alert" className="w-full text-xs text-red-600">{filterError}</p>}
      </form>
      <div id="task-history-results" role="tabpanel" aria-labelledby={`task-history-${role}`} aria-busy={loading} className="overflow-hidden rounded-lg border border-[#dfe7f2] bg-white">
        {loading ? <p role="status" className="p-6 text-sm text-[#64748b]">Loading task history...</p>
          : error ? <div className="p-6"><p role="alert" className="text-sm text-red-600">{error}</p><button type="button" onClick={() => { setLoadedUser(''); setAttempt(value => value + 1); }} className="ui-button-secondary mt-3 px-4 py-2 text-xs">Retry</button></div>
          : <>
            <div className="overflow-x-auto">
              <table className="ui-table min-w-[950px]">
                <thead><tr className="ui-table-head text-left">{['Task ID', 'Date', 'Service Name', role === 'poster' ? 'Doer' : 'Task Poster', 'Status', 'Amount', role === 'poster' ? 'Reward Points' : 'Milestone', 'Action'].map(heading => <th key={heading} className="px-4 py-3 text-[11px]">{heading}</th>)}</tr></thead>
                <tbody>{visibleRows.length ? visibleRows.map(row => (
                  <tr key={row.routeId} className="ui-table-row text-xs">
                    <td className="px-4 py-4"><Link href={`/tasks/${encodeURIComponent(row.routeId)}`} className="font-semibold text-[#1B3061] hover:underline">{row.id}</Link></td>
                    <td className="px-4 py-4">{row.date}</td><td className="px-4 py-4 font-semibold">{row.service}</td>
                    <td className="px-4 py-4">{role === 'poster' ? row.doer : row.poster}</td>
                    <td className="px-4 py-4"><span className="status-badge bg-[#eef2ff] text-[#1B3061]">{row.status}</span></td>
                    <td className="px-4 py-4">{row.amount}</td><td className="px-4 py-4">{role === 'poster' ? row.reward : row.milestone}</td>
                    <td className="px-4 py-4"><Link aria-label={`View task ${row.id}`} href={`/tasks/${encodeURIComponent(row.routeId)}`} className="font-semibold text-[#1B3061] hover:underline">View Task</Link></td>
                  </tr>
                )) : <tr><td colSpan={8} className="p-6 text-center text-sm text-[#64748b]">No {role === 'poster' ? 'posted' : 'assigned'} tasks found matching your filters.</td></tr>}</tbody>
              </table>
            </div>
            <nav aria-label="Task history pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e3eaf4] px-4 py-3 text-xs">
              <p>Showing {filtered.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} tasks</p>
              <div className="flex items-center gap-3">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="ui-button-secondary px-3 py-2 disabled:opacity-50">Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="ui-button-secondary px-3 py-2 disabled:opacity-50">Next</button>
              </div>
            </nav>
          </>}
      </div>
    </section>
  );
}
