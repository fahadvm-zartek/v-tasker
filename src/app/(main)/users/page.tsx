'use client';

import {
  Activity,
  AlertTriangle,
  Ban,
  ChevronRight,
  Clock3,
  Eye,
  FileBadge,
  ShieldCheck,
  UserRoundCheck,
  UserRoundCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardPagination,
  DashboardPanel,
} from '../../../components';
import { fetchAdminDashboard } from '../../../services/adminService';
import type { AdminDashboardData } from '../../../services/adminService';
import { fetchUsersPage } from '../../../services/userService';
import type { UserSummary as User } from '../../../services/userService';
import UsersFilterToolbar, { DEFAULT_USER_FILTERS } from './UsersFilterToolbar';
import type { UsersFilterState } from './UsersFilterToolbar';

const formatUserStat = (value: unknown): string =>
  (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && Number.isFinite(Number(value)) ? String(value) : 'N/A';

const roleStyles: Record<string, string> = {
  Admin: 'bg-[#eaf0ff] text-[#1B3061]',
  Both: 'bg-[#dcf7e9] text-[#047857]',
  'Task Doer': 'bg-[#f2e6ff] text-[#7e22ce]',
  'Task Poster': 'bg-[#eef2ff] text-[#1B3061]',
  'N/A': 'bg-[#eef2f6] text-[#64748b]',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [filters, setFilters] = useState<UsersFilterState>(DEFAULT_USER_FILTERS);
  const [userStats, setUserStats] = useState<AdminDashboardData['users'] | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchAdminDashboard()
      .then((data) => {
        if (!isMounted) return;
        if (data?.users) setUserStats(data.users);
        else setStatsError('User statistics are unavailable.');
      })
      .catch(() => { if (isMounted) setStatsError('Unable to load user statistics.'); })
      .finally(() => { if (isMounted) setIsStatsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchUsersPage({
      page: currentPage,
      pageSize: filters.pageSize,
      search: filters.search,
      userType: filters.userType,
      isActive: filters.isActive,
      isEmailVerified: filters.isEmailVerified,
      ordering: filters.ordering,
      dateJoinedAfter: filters.dateJoinedAfter,
      dateJoinedBefore: filters.dateJoinedBefore,
    })
      .then((usersPage) => {
        if (isMounted) {
          setUsers(usersPage.users);
          setTotalUsers(usersPage.count);
          setHasNextPage(Boolean(usersPage.next));
          setHasPreviousPage(Boolean(usersPage.previous));
        }
      })
      .catch(() => {
        if (isMounted) {
          setUsers([]);
          setTotalUsers(0);
          setHasNextPage(false);
          setHasPreviousPage(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, filters]);

  const dynamicMetrics = useMemo(() => [
    {
      title: 'Total Users',
      value: formatUserStat(userStats?.total),
      icon: Users,
      iconClass: 'text-[#2563ff]',
      iconWrapClass: 'bg-[#eaf0ff]',
      details: [
        { label: 'Normal:', value: formatUserStat(userStats?.normal_users) },
        { label: 'Student:', value: formatUserStat(userStats?.student_users) },
      ],
    },
    {
      title: 'Role: Both',
      value: formatUserStat(userStats?.by_type?.BOTH),
      icon: UserRoundCheck,
      iconClass: 'text-[#059669]',
      iconWrapClass: 'bg-[#dcfaee]',
    },
    {
      title: 'Role: Task Doer',
      value: formatUserStat(userStats?.by_type?.TASK_DOER),
      icon: UserRoundCog,
      iconClass: 'text-[#7c3aed]',
      iconWrapClass: 'bg-[#f0e4ff]',
    },
    {
      title: 'Role: Task Poster',
      value: formatUserStat(userStats?.by_type?.TASK_POSTER),
      icon: FileBadge,
      iconClass: 'text-[#2563ff]',
      iconWrapClass: 'bg-[#eaf0ff]',
    },
    {
      title: 'Pending Approvals',
      value: formatUserStat(userStats?.pending_approvals),
      icon: Clock3,
      iconClass: 'text-[#d97706]',
      iconWrapClass: 'bg-[#fff0d8]',
      action: 'Verification Requests',
    },
  ], [userStats]);

  const dynamicSummaries = useMemo(() => [
    {
      title: 'Verification Status',
      icon: ShieldCheck,
      iconClass: 'text-[#6d5cff]',
      iconWrapClass: 'bg-[#ece8ff]',
      stats: [
        { label: 'Verified', value: formatUserStat(userStats?.verified), dotClass: 'bg-[#16a34a]' },
        { label: 'Unverified', value: formatUserStat(userStats?.unverified), dotClass: 'bg-[#d18a00]' },
      ],
    },
    {
      title: 'User Activity',
      icon: Activity,
      iconClass: 'text-[#637083]',
      iconWrapClass: 'bg-[#eef2f6]',
      stats: [
        { label: 'Active', value: formatUserStat(userStats?.active), dotClass: 'bg-[#0284c7]' },
        { label: 'Inactive', value: formatUserStat(userStats?.inactive), dotClass: 'bg-[#9aa4b2]' },
      ],
    },
    {
      title: 'Total Suspended Users',
      value: formatUserStat(userStats?.suspended_count),
      icon: Ban,
      iconClass: 'text-[#ef4444]',
      iconWrapClass: 'bg-[#ffe1e1]',
    },
    {
      title: 'Expired Student Users',
      value: formatUserStat(userStats?.expired_student_users),
      icon: FileBadge,
      iconClass: 'text-[#ea7a18]',
      iconWrapClass: 'bg-[#ffe9d7]',
    },
  ], [userStats]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / filters.pageSize));
  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, pageIndex) => String(pageIndex + 1)),
    [totalPages],
  );
  const firstItemIndex = users.length > 0 ? (currentPage - 1) * filters.pageSize + 1 : 0;
  const lastItemIndex = users.length > 0 ? Math.min(firstItemIndex + users.length - 1, totalUsers) : 0;

  const handleFiltersChange = (nextFilters: UsersFilterState) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: string) => {
    const pageNumber = Number(page);

    if (Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <DashboardPageShell>
      <div className="animate-dashboard-entry space-y-6">
        {statsError && <p role="alert" className="text-[12px] text-[#dc2626]">{statsError}</p>}
        <section
          aria-label="User metrics"
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
        >
          {dynamicMetrics.map((metric) => (
            <DashboardMetricCard
              key={metric.title}
              title={metric.title}
              value={isStatsLoading ? undefined : metric.value}
              icon={metric.icon}
              iconClass={metric.iconClass}
              iconWrapClass={metric.iconWrapClass}
            >
              {isStatsLoading && <div role="status" aria-label="Loading user statistics" className="h-8 w-20 animate-pulse rounded bg-slate-200" />}
              {!isStatsLoading && metric.details ? (
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
                <button type="button" className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#0b63ce]">
                  {metric.action}
                  <ChevronRight size={13} strokeWidth={2.3} />
                </button>
              ) : null}
            </DashboardMetricCard>
          ))}
        </section>

        <section
          aria-label="User status summaries"
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
        >
          {dynamicSummaries.map((summary) => (
            <DashboardMetricCard
              key={summary.title}
              title={summary.title}
              value={isStatsLoading ? undefined : summary.value}
              icon={summary.icon}
              iconClass={summary.iconClass}
              iconWrapClass={summary.iconWrapClass}
            >
              {isStatsLoading && <div role="status" aria-label="Loading user statistics" className="h-8 w-20 animate-pulse rounded bg-slate-200" />}
              {!isStatsLoading && summary.stats ? (
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
              ) : null}
            </DashboardMetricCard>
          ))}
          <article className="ui-card dashboard-interactive flex min-h-[150px] flex-col justify-between rounded-[12px] p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[11px] font-normal leading-4 text-[#475569]">Reported Users</h2>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#fff1f2] text-[#ef202b]">
                <AlertTriangle size={14} fill="currentColor" stroke="white" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </div>
            <div className="flex items-end justify-between gap-2">
              {isStatsLoading ? (
                <div role="status" aria-label="Loading reported users" className="h-8 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="text-[26px] font-bold leading-8 text-[#111827]">{formatUserStat(userStats?.reported_users)}</p>
              )}
              <span className="mb-0.5 inline-flex items-center whitespace-nowrap text-[10px] font-medium leading-4 text-[#ff1744]">Requires Review<ChevronRight size={12} aria-hidden="true" /></span>
            </div>
          </article>
        </section>

        <DashboardPanel className="relative overflow-visible">
          <UsersFilterToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

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
                  <th className="w-[16%] px-5 text-center text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
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
                        <span className={`status-badge ${roleStyles[user.role] ?? roleStyles['N/A']}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 text-center text-[13px] text-[#64748b]">
                        {user.lastInteraction}
                      </td>
                      <td className="px-5 text-center align-middle">
                        <Link
                          href={`/users/${user.id.replace('#', '')}`}
                          aria-label={`View profile for ${user.name}`}
                          title="View Profile"
                          className="ui-icon-button mx-auto h-7 w-7 text-[#1B3061] hover:bg-[#f3f6ff]"
                        >
                          <Eye size={14} strokeWidth={2.1} aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="ui-table-row h-[58px]">
                    <td className="px-5 text-[13px] font-medium text-[#49627f]">N/A</td>
                    <td className="px-5 text-[13px] font-bold text-[#1f2937]">N/A</td>
                    <td className="px-5 text-[13px] text-[#49627f]">N/A</td>
                    <td className="px-5 text-[13px] text-[#49627f]">N/A</td>
                    <td className="px-5">
                      <span className={`status-badge ${roleStyles['N/A']}`}>N/A</span>
                    </td>
                    <td className="px-5 text-center text-[13px] text-[#64748b]">N/A</td>
                    <td className="px-5 text-center text-[13px] text-[#64748b]">N/A</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf3] px-5 py-4">
            <p className="text-[13px] text-[#64748b]">Showing {firstItemIndex}-{lastItemIndex} of {totalUsers} users</p>
            <DashboardPagination
              pages={paginationPages}
              activePage={String(currentPage)}
              label="Users pagination"
              onPageChange={handlePageChange}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              isPreviousDisabled={!hasPreviousPage}
              isNextDisabled={!hasNextPage}
            />
          </div>
        </DashboardPanel>
      </div>
    </DashboardPageShell>
  );
}
