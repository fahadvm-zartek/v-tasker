'use client';

import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { AlertTriangle, Download, Gavel, Search, ShieldCheck } from 'lucide-react';
import {
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPagination,
  DashboardPrimaryButton,
  DashboardSelectButton,
  DashboardTableShell,
  cn,
  dashboardButtonClass,
  dashboardStatusBadgeClass,
} from '../../../components';
import { fetchDisputesPage } from '../../../services/disputeService';
import type { DisputeSummary } from '../../../services/disputeService';

type ResolutionTab = {
  label: string;
  count: string;
  href: string;
  active?: boolean;
};

type MetricTone = 'red' | 'amber' | 'green';

type DisputeMetric = {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: MetricTone;
};

const resolutionTabs: ResolutionTab[] = [
  { label: 'Disputes', count: '34', href: '/disputes', active: true },
  { label: 'Cancellations', count: '48', href: '/cancellations' },
];

const metricToneClasses: Record<MetricTone, { icon: string; iconWrap: string; value: string }> = {
  red: { icon: 'text-[#ef4444]', iconWrap: 'bg-[#fff0f0]', value: 'text-[#ef4444]' },
  amber: { icon: 'text-[#d97706]', iconWrap: 'bg-[#fff7e6]', value: 'text-[#d97706]' },
  green: { icon: 'text-[#10b981]', iconWrap: 'bg-[#e8fbf2]', value: 'text-[#10b981]' },
};

const getStatusTone = (status: string): 'danger' | 'warning' | 'success' => {
  const s = status.toLowerCase();
  if (s.includes('resolved') || s.includes('closed')) return 'success';
  if (s.includes('review')) return 'warning';
  return 'danger';
};

const ResolutionTabs = ({ tabs }: { tabs: ResolutionTab[] }) => (
  <nav className="flex border-b border-[#dfe6f0]" aria-label="Resolution Center sections">
    {tabs.map((tab) => (
      <Link
        key={tab.label}
        href={tab.href}
        aria-current={tab.active ? 'page' : undefined}
        className={cn(
          'relative inline-flex h-11 items-center gap-2 px-6 text-[11px] font-bold transition-colors',
          tab.active ? 'text-[#1B3061]' : 'text-[#64748b] hover:text-[#1B3061]',
        )}
      >
        <Gavel size={13} strokeWidth={2.2} />
        {tab.label}
        <span className="rounded-full bg-[#eaf2ff] px-2 py-0.5 text-[9px] font-bold text-[#1B3061]">{tab.count}</span>
        {tab.active ? <span aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B3061]" /> : null}
      </Link>
    ))}
  </nav>
);

const Avatar = ({ initials, className }: { initials: string; className: string }) => (
  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold', className)}>
    {initials}
  </span>
);

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<DisputeSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dashboardDisputes, setDashboardDisputes] = useState<any>(null);

  useEffect(() => {
    import('../../../services/adminService').then(({ fetchAdminDashboard }) => {
      fetchAdminDashboard().then((data) => {
        if (data?.disputes) setDashboardDisputes(data.disputes);
      });
    });
  }, []);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const result = await fetchDisputesPage({ page, pageSize: 10 });
      setDisputes(result.disputes);
      setTotalCount(result.count);
      setTotalPages(result.totalPages);
    } catch {
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, [page]);

  const metrics: DisputeMetric[] = useMemo(() => [
    {
      label: 'Open Disputes',
      value: dashboardDisputes?.open !== undefined ? String(dashboardDisputes.open) : '23',
      icon: AlertTriangle,
      tone: 'red',
    },
    {
      label: 'Under Review',
      value: dashboardDisputes?.under_review !== undefined ? String(dashboardDisputes.under_review) : '11',
      icon: Search,
      tone: 'amber',
    },
    {
      label: 'Resolved',
      value: dashboardDisputes?.resolved !== undefined ? String(dashboardDisputes.resolved) : '89',
      icon: ShieldCheck,
      tone: 'green',
    },
  ], [dashboardDisputes]);

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => String(i + 1)),
    [totalPages]
  );

  return (
    <DashboardPageShell contentClassName="px-0 pb-10 pt-0">
      <div className="animate-dashboard-entry">
        <DashboardPageHeader title="Disputes" className="border-b border-[#dfe6f0] pb-2 pt-4" />
        <ResolutionTabs tabs={resolutionTabs} />

        <section aria-label="Dispute metrics" className="mt-5 grid grid-cols-3 gap-5 max-lg:grid-cols-1">
          {metrics.map((metric) => {
            const tone = metricToneClasses[metric.tone];

            return (
              <DashboardMetricCard
                key={metric.label}
                title={metric.label}
                icon={metric.icon}
                iconClass={tone.icon}
                iconWrapClass={tone.iconWrap}
                className="min-h-[74px] justify-center px-5"
              >
                <div>
                  <p className={cn('text-[22px] font-bold leading-7', tone.value)}>{metric.value}</p>
                </div>
              </DashboardMetricCard>
            );
          })}
        </section>

        <DashboardTableShell className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebf3] px-4 py-4">
            <h2 className="text-[17px] font-bold text-[#202b3d]">Recent Disputes</h2>
            <DashboardPrimaryButton>
              <Download size={13} strokeWidth={2.3} />
              Export
            </DashboardPrimaryButton>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#e6ebf3] px-4 py-3">
            {['Status: All', 'Category: All', 'Date: Latest', 'Priority: All'].map((filter) => (
              <DashboardSelectButton key={filter} className="min-w-[126px]">{filter}</DashboardSelectButton>
            ))}
            <button type="button" className="text-[11px] font-bold text-[#1B3061]">Clear Filters</button>
          </div>
          <div className="overflow-x-auto">
            <table className="ui-table min-w-[1120px] table-fixed">
              <thead>
                <tr className="ui-table-head h-[42px] text-left">
                  {['DISPUTE ID', 'TASK REFERENCE', 'RAISED BY', 'AGAINST', 'CATEGORY', 'STATUS', 'DATE FILED', 'ACTION'].map((heading) => (
                    <th key={heading} className={cn('px-4 text-[10px]', heading === 'ACTION' ? 'text-right' : '')}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disputes.length > 0 ? (
                  disputes.map((row) => (
                    <tr key={row.id} className="ui-table-row h-[58px]">
                      <td className="px-4 text-[11px] font-bold text-[#172033]">{row.id}</td>
                      <td className="px-4 text-[11px] font-medium text-[#64748b]">
                        <span className="font-bold text-[#1B3061]">{row.task}</span> - {row.service}
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <Avatar initials={row.initials} className={row.avatarClass} />
                          <span className="text-[11px] font-semibold text-[#172033]">{row.raisedBy}</span>
                          <span className="rounded-[4px] bg-[#eef2f6] px-1.5 py-0.5 text-[8px] font-bold text-[#475569]">{row.role}</span>
                        </div>
                      </td>
                      <td className="px-4 text-[11px] font-medium text-[#172033]">{row.against}</td>
                      <td className="px-4 text-[11px] font-semibold text-[#2563eb]">{row.category}</td>
                      <td className="px-4">
                        <span className={dashboardStatusBadgeClass(getStatusTone(row.status))}>{row.status}</span>
                      </td>
                      <td className="px-4 text-[11px] font-medium text-[#64748b]">{row.date}</td>
                      <td className="px-4 text-right">
                        <Link href={`/disputes/${row.rawId}`} className={cn(dashboardButtonClass(row.status.toLowerCase().includes('resolved') ? 'outline' : 'primary', 'sm'))}>
                          {row.status.toLowerCase().includes('resolved') ? 'View' : 'Review ->'}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="ui-table-row h-[58px]">
                    <td className="px-4 text-[11px] font-bold text-[#172033]">N/A</td>
                    <td className="px-4 text-[11px] text-[#64748b]">N/A</td>
                    <td className="px-4 text-[11px] text-[#172033]">N/A</td>
                    <td className="px-4 text-[11px] text-[#172033]">N/A</td>
                    <td className="px-4 text-[11px] text-[#2563eb]">N/A</td>
                    <td className="px-4"><span className={dashboardStatusBadgeClass('neutral')}>N/A</span></td>
                    <td className="px-4 text-[11px] text-[#64748b]">N/A</td>
                    <td className="px-4 text-right text-[11px] text-[#64748b]">N/A</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-[#e6ebf3] px-4 py-4 text-[11px] font-medium text-[#64748b]">
            <span>Showing {disputes.length > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, totalCount)} of {totalCount} entries</span>
            <DashboardPagination
              pages={paginationPages}
              activePage={String(page)}
              label="Disputes pagination"
              onPageChange={(p) => setPage(Number(p))}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isPreviousDisabled={page <= 1}
              isNextDisabled={page >= totalPages}
            />
          </footer>
        </DashboardTableShell>
      </div>
    </DashboardPageShell>
  );
};

export default DisputesPage;
