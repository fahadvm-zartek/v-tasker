'use client';

import {
  Activity,
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
  dashboardButtonClass,
  cn,
} from '../../../components';
import { fetchUsersPage } from '../../../services/userService';
import type { UserSummary as User } from '../../../services/userService';
import UsersFilterToolbar, { DEFAULT_USER_FILTERS } from './UsersFilterToolbar';
import type { UsersFilterState } from './UsersFilterToolbar';

type MetricCard = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  iconClass: string;
  iconWrapClass: string;
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

const metrics: MetricCard[] = [
  {
    title: 'Total Users',
    value: 'N/A',
    icon: Users,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
    details: [
      { label: 'Normal:', value: 'N/A' },
      { label: 'Student:', value: 'N/A' },
    ],
  },
  {
    title: 'Role: Both',
    value: 'N/A',
    icon: UserRoundCheck,
    iconClass: 'text-[#059669]',
    iconWrapClass: 'bg-[#dcfaee]',
  },
  {
    title: 'Role: Task Doer',
    value: 'N/A',
    icon: UserRoundCog,
    iconClass: 'text-[#7c3aed]',
    iconWrapClass: 'bg-[#f0e4ff]',
  },
  {
    title: 'Role: Task Poster',
    value: 'N/A',
    icon: FileBadge,
    iconClass: 'text-[#2563ff]',
    iconWrapClass: 'bg-[#eaf0ff]',
  },
  {
    title: 'Pending Approvals',
    value: 'N/A',
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
      { label: 'Verified', value: 'N/A', dotClass: 'bg-[#16a34a]' },
      { label: 'Unverified', value: 'N/A', dotClass: 'bg-[#d18a00]' },
    ],
  },
  {
    title: 'User Activity',
    icon: Activity,
    iconClass: 'text-[#637083]',
    iconWrapClass: 'bg-[#eef2f6]',
    stats: [
      { label: 'Active', value: 'N/A', dotClass: 'bg-[#0284c7]' },
      { label: 'Inactive', value: 'N/A', dotClass: 'bg-[#9aa4b2]' },
    ],
  },
  {
    title: 'Total Suspended Users',
    value: 'N/A',
    icon: Ban,
    iconClass: 'text-[#ef4444]',
    iconWrapClass: 'bg-[#ffe1e1]',
  },
  {
    title: 'Expired Student Users',
    value: 'N/A',
    icon: FileBadge,
    iconClass: 'text-[#ea7a18]',
    iconWrapClass: 'bg-[#ffe9d7]',
  },
];

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
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    import('../../../services/adminService').then(({ fetchAdminDashboard }) => {
      fetchAdminDashboard().then((data) => {
        if (data?.users) setUserStats(data.users);
      });
    });
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
      value: userStats?.total !== undefined ? String(userStats.total) : String(totalUsers || 'N/A'),
      icon: Users,
      iconClass: 'text-[#2563ff]',
      iconWrapClass: 'bg-[#eaf0ff]',
      details: [
        { label: 'Normal:', value: userStats?.normal !== undefined ? String(userStats.normal) : 'N/A' },
        { label: 'Student:', value: userStats?.student !== undefined ? String(userStats.student) : 'N/A' },
      ],
    },
    {
      title: 'Role: Both',
      value: userStats?.both !== undefined ? String(userStats.both) : 'N/A',
      icon: UserRoundCheck,
      iconClass: 'text-[#059669]',
      iconWrapClass: 'bg-[#dcfaee]',
    },
    {
      title: 'Role: Task Doer',
      value: userStats?.doer !== undefined ? String(userStats.doer) : 'N/A',
      icon: UserRoundCog,
      iconClass: 'text-[#7c3aed]',
      iconWrapClass: 'bg-[#f0e4ff]',
    },
    {
      title: 'Role: Task Poster',
      value: userStats?.poster !== undefined ? String(userStats.poster) : 'N/A',
      icon: FileBadge,
      iconClass: 'text-[#2563ff]',
      iconWrapClass: 'bg-[#eaf0ff]',
    },
    {
      title: 'Pending Approvals',
      value: userStats?.pending_approvals !== undefined ? String(userStats.pending_approvals) : 'N/A',
      icon: Clock3,
      iconClass: 'text-[#d97706]',
      iconWrapClass: 'bg-[#fff0d8]',
      action: 'Verification Requests',
    },
  ], [userStats, totalUsers]);

  const dynamicSummaries = useMemo(() => [
    {
      title: 'Verification Status',
      icon: ShieldCheck,
      iconClass: 'text-[#6d5cff]',
      iconWrapClass: 'bg-[#ece8ff]',
      stats: [
        { label: 'Verified', value: userStats?.verified !== undefined ? String(userStats.verified) : 'N/A', dotClass: 'bg-[#16a34a]' },
        { label: 'Unverified', value: userStats?.unverified !== undefined ? String(userStats.unverified) : 'N/A', dotClass: 'bg-[#d18a00]' },
      ],
    },
    {
      title: 'User Activity',
      icon: Activity,
      iconClass: 'text-[#637083]',
      iconWrapClass: 'bg-[#eef2f6]',
      stats: [
        { label: 'Active', value: userStats?.active !== undefined ? String(userStats.active) : 'N/A', dotClass: 'bg-[#0284c7]' },
        { label: 'Inactive', value: userStats?.inactive !== undefined ? String(userStats.inactive) : 'N/A', dotClass: 'bg-[#9aa4b2]' },
      ],
    },
    {
      title: 'Total Suspended Users',
      value: userStats?.suspended !== undefined ? String(userStats.suspended) : 'N/A',
      icon: Ban,
      iconClass: 'text-[#ef4444]',
      iconWrapClass: 'bg-[#ffe1e1]',
    },
    {
      title: 'Expired Student Users',
      value: userStats?.expired_students !== undefined ? String(userStats.expired_students) : 'N/A',
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
        <section
          aria-label="User metrics"
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
        >
          {dynamicMetrics.map((metric) => (
            <DashboardMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconClass={metric.iconClass}
              iconWrapClass={metric.iconWrapClass}
            >
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
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 xl:max-w-[calc(80%-5px)]"
        >
          {dynamicSummaries.map((summary) => (
            <DashboardMetricCard
              key={summary.title}
              title={summary.title}
              value={summary.value}
              icon={summary.icon}
              iconClass={summary.iconClass}
              iconWrapClass={summary.iconWrapClass}
            >
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
              ) : null}
            </DashboardMetricCard>
          ))}
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
                  <th className="w-[16%] px-5 text-right text-[11px]">Action</th>
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
                      <td className="px-5 text-right">
                        <Link
                          href={`/users/${user.id.replace('#', '')}`}
                          className={cn(dashboardButtonClass('outline', 'sm'), 'border-[#c9d0e8] text-[#1B3061] hover:bg-[#f3f6ff]')}
                        >
                          <Eye size={14} strokeWidth={2.1} />
                          View Profile
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
                    <td className="px-5 text-right text-[13px] text-[#64748b]">N/A</td>
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
