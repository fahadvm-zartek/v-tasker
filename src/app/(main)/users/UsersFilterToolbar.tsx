'use client';

import { ChevronDown, Download, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';

type BooleanFilter = boolean | undefined;

export type UsersFilterState = {
  dateJoinedAfter?: string;
  dateJoinedBefore?: string;
  isActive?: BooleanFilter;
  isEmailVerified?: BooleanFilter;
  ordering?: string;
  pageSize: number;
  search: string;
  userType?: string;
};

type FilterConfig = {
  label: string;
  widthClass: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
};

type UsersFilterToolbarProps = {
  filters: UsersFilterState;
  onFiltersChange: (filters: UsersFilterState) => void;
};

export const DEFAULT_USER_FILTERS: UsersFilterState = {
  pageSize: 10,
  search: '',
};

const booleanOptions = [
  { label: 'All', value: 'all' },
  { label: 'Verified', value: 'true' },
  { label: 'Unverified', value: 'false' },
];

const toBooleanFilter = (value: string): BooleanFilter => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const fromBooleanFilter = (value: BooleanFilter) => {
  if (value === true) return 'true';
  if (value === false) return 'false';
  return 'all';
};

const toDateJoinedRange = (value: string) => {
  const now = new Date();
  const after = new Date(now);

  if (value === 'today') {
    after.setHours(0, 0, 0, 0);
  } else if (value === 'weekly') {
    after.setDate(now.getDate() - 7);
  } else if (value === 'monthly') {
    after.setMonth(now.getMonth() - 1);
  } else if (value === 'yearly') {
    after.setFullYear(now.getFullYear() - 1);
  } else {
    return { dateJoinedAfter: undefined, dateJoinedBefore: undefined };
  }

  return {
    dateJoinedAfter: after.toISOString(),
    dateJoinedBefore: now.toISOString(),
  };
};

const UsersFilterToolbar = ({ filters, onFiltersChange }: UsersFilterToolbarProps) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const updateFilter = (updates: Partial<UsersFilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    });
  };

  const clearFilters = () => {
    setOpenFilter(null);
    onFiltersChange(DEFAULT_USER_FILTERS);
  };

  const dropdownFilters: FilterConfig[] = [
    {
      label: 'Registration',
      widthClass: 'w-[132px]',
      value: filters.dateJoinedAfter ? 'filtered' : 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
      ],
      onSelect: (value) => updateFilter(toDateJoinedRange(value)),
    },
    {
      label: 'Activity',
      widthClass: 'w-[92px]',
      value: fromBooleanFilter(filters.isActive),
      options: [
        { label: 'All', value: 'all' },
        { label: 'Active Users', value: 'true' },
        { label: 'Inactive (30 Days)', value: 'false' },
        { label: 'Inactive (60 Days)', value: 'false' },
        { label: 'Inactive (90 Days)', value: 'false' },
      ],
      onSelect: (value) => updateFilter({ isActive: toBooleanFilter(value) }),
    },
    {
      label: 'Status',
      widthClass: 'w-[92px]',
      value: fromBooleanFilter(filters.isEmailVerified),
      options: [
        ...booleanOptions,
        { label: 'Student', value: 'all' },
        { label: 'Reported Users', value: 'all' },
      ],
      onSelect: (value) => updateFilter({ isEmailVerified: toBooleanFilter(value) }),
    },
    {
      label: 'Role',
      widthClass: 'w-[92px]',
      value: filters.userType ?? 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Task Doer', value: 'Task Doer' },
        { label: 'Task Poster', value: 'Task Poster' },
        { label: 'Both', value: 'Both' },
      ],
      onSelect: (value) => updateFilter({ userType: value === 'all' ? undefined : value }),
    },
    {
      label: 'Top Task Poster & Doer',
      widthClass: 'w-[154px]',
      value: filters.ordering ?? '-date_joined',
      options: [
        { label: 'All', value: '-date_joined' },
        { label: 'High', value: '-date_joined' },
        { label: 'Low', value: 'date_joined' },
      ],
      onSelect: (value) => updateFilter({ ordering: value }),
    },
  ];

  return (
    <div className="relative z-[60] overflow-visible border-b border-[#e6ebf3] px-4 py-3">
      <div className="flex min-w-max flex-nowrap items-center gap-2">
        <label className="relative block h-8 w-[245px] shrink-0">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8190a6]"
            size={15}
          />
          <input
            type="search"
            placeholder="Search by name, email, or ID..."
            value={filters.search}
            onChange={(event) => updateFilter({ search: event.target.value })}
            className="h-full w-full rounded-[5px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[11px] text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </label>

        {dropdownFilters.map((filter) => {
          const isOpen = openFilter === filter.label;
          const selectedLabel = filter.options.find((option) => option.value === filter.value)?.label ?? filter.label;

          return (
            <div key={filter.label} className={`relative shrink-0 ${filter.widthClass}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenFilter((current) => (current === filter.label ? null : filter.label))}
                className={`inline-flex h-8 w-full items-center justify-between gap-2 rounded-[5px] border bg-white px-3 text-[11px] font-medium transition-colors focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15 ${
                  isOpen
                    ? 'border-[#1B3061] bg-[#f8fbff] text-[#14244d] shadow-[0_0_0_1px_rgba(27,48,97,0.14)]'
                    : 'border-[#dbe4ef] text-[#1f2937] hover:border-[#c4cede] hover:bg-[#fbfcfe]'
                }`}
              >
                <span className="truncate">{filter.value === 'all' || filter.value === '-date_joined' ? filter.label : selectedLabel}</span>
                <ChevronDown
                  size={14}
                  strokeWidth={2.2}
                  className={`shrink-0 text-[#64748b] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen ? (
                <div className="absolute left-0 top-[38px] z-[80] w-full min-w-max rounded-[6px] border border-[#e3e8f0] bg-white py-1 shadow-[0_8px_22px_rgba(15,23,42,0.14)]">
                  {filter.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        filter.onSelect(option.value);
                        setOpenFilter(null);
                      }}
                      className="block h-[30px] w-full whitespace-nowrap px-4 text-left text-[12px] font-medium text-[#334155] hover:bg-[#f8fafc]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[5px] border border-[#dbe4ef] bg-white px-3 text-[11px] font-semibold text-[#475569] transition-colors hover:border-[#c4cede] hover:bg-[#fbfcfe] focus-visible:border-[#1B3061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3061]/15"
        >
          <RotateCcw size={12} strokeWidth={2.2} />
          Clear Filters
        </button>

        <button
          type="button"
          className="ml-auto inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#1B3061] px-4 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(27,48,97,0.18)] transition-colors hover:bg-[#14244d]"
        >
          <Download size={13} strokeWidth={2.1} />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default UsersFilterToolbar;
