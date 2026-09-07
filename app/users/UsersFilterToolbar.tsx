'use client';

import { ChevronDown, Download, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';

type FilterConfig = {
  label: string;
  options: string[];
  widthClass: string;
};

const filters: FilterConfig[] = [
  {
    label: 'Registration',
    options: ['All', 'Today', 'Weekly', 'Monthly', 'Yearly'],
    widthClass: 'w-[132px]',
  },
  {
    label: 'Activity',
    options: ['Active Users', 'Inactive (30 Days)', 'Inactive (60 Days)', 'Inactive (90 Days)'],
    widthClass: 'w-[92px]',
  },
  {
    label: 'Status',
    options: ['All', 'Verified', 'Unverified', 'Student', 'Reported Users'],
    widthClass: 'w-[92px]',
  },
  {
    label: 'Role',
    options: ['Task Doer', 'Task Poster', 'Both'],
    widthClass: 'w-[92px]',
  },
  {
    label: 'Top Task Poster & Doer',
    options: ['All', 'High', 'Low'],
    widthClass: 'w-[154px]',
  },
];

const UsersFilterToolbar = () => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const handleClearFilters = () => setOpenFilter(null);

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
            className="h-full w-full rounded-[5px] border border-[#dbe4ef] bg-white pl-9 pr-3 text-[11px] text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </label>

        {filters.map((filter) => {
          const isOpen = openFilter === filter.label;

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
                <span className="truncate">{filter.label}</span>
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
                      key={option}
                      type="button"
                      onClick={() => setOpenFilter(null)}
                      className="block h-[30px] w-full whitespace-nowrap px-4 text-left text-[12px] font-medium text-[#334155] hover:bg-[#f8fafc]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleClearFilters}
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
