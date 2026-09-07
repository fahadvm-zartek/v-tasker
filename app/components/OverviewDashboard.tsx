'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Ticket,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';

const timeFilterOptions = ['Day', 'Week', 'Month', 'Quarter', 'Year', 'Custom'];

const statCardsData = [
  {
    title: 'TOTAL USERS',
    value: '124.5K',
    change: '+12.5%',
    isPositive: true,
    accentColor: '#1B3061',
    icon: Users,
  },
  {
    title: 'NEW REGISTRATIONS',
    value: '3,240',
    change: '+5.2%',
    isPositive: true,
    accentColor: '#47dfad',
    icon: UserPlus,
  },
  {
    title: 'ACTIVE USERS',
    value: '89.2K',
    change: '-1.4%',
    isPositive: false,
    accentColor: '#E68A2E',
    icon: UserCheck,
  },
  {
    title: 'ACTIVE SUBSCRIPTIONS',
    value: '39.3K',
    change: null,
    isPositive: null,
    accentColor: '#c3c1ff',
    icon: CreditCard,
  },
];

const segmentRow1Cards = [
  { label: 'Free Users', value: '85.2K', bgClass: 'bg-[#fbfcfe] border-[#dfe5ef]', textClass: 'text-[#0d1b2f]', labelClass: 'text-[#405065] font-semibold' },
  { label: 'Paid Users', value: '32.1K', bgClass: 'bg-[#eef2ff] border-[#bfc9f7]', textClass: 'text-[#1B3061]', labelClass: 'text-[#1B3061] font-semibold' },
  { label: 'Gifted', value: '7.2K', bgClass: 'bg-[#fbfcfe] border-[#dfe5ef]', textClass: 'text-[#0d1b2f]', labelClass: 'text-[#405065] font-semibold' },
  { label: 'Expired / Cancelled', value: '4.8K', bgClass: 'bg-[#ffd7d3] border-[#f5a29d]', textClass: 'text-[#b10f1f]', labelClass: 'text-[#bd353e] font-semibold' },
];

const segmentRow2Cards = [
  { label: 'Deleted Accounts', value: '1.2K', bgClass: 'bg-[#fbfcfe] border-[#dfe5ef]', textClass: 'text-[#0d1b2f]', labelClass: 'text-[#405065] font-semibold' },
  { label: 'Non-Renewed', value: '2.1K', bgClass: 'bg-[#eef2ff] border-[#f0c996]', textClass: 'text-[#df7800]', labelClass: 'text-[#e8892e] font-semibold' },
];

const topRegionsData = [
  { country: 'United States', percentage: 42, count: '52.3K', color: '#1B3061' },
  { country: 'United Kingdom', percentage: 28, count: '34.8K', color: '#E68A2E' },
  { country: 'Canada', percentage: 18, count: '22.4K', color: '#1B3061' },
  { country: 'Australia', percentage: 12, count: '15.0K', color: '#10b981' },
];

const OverviewDashboard = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Week');

  return (
    <div className="animate-dashboard-entry pb-10">
      <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[35px] font-bold leading-[42px] text-[#050b16]">
            Overview
          </h1>
          <p className="mt-1 text-[18px] leading-[22px] text-[#4f4b55]">
            Platform performance metrics for the current week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="animate-dashboard-entry flex h-[53px] items-center rounded-[11px] border border-[#dfe5ef] bg-white px-[11px] shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
            {timeFilterOptions.map((filter) => {
              const isSelected = selectedTimeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedTimeFilter(filter)}
                  className={`dashboard-interactive h-[38px] rounded-[8px] px-[9px] text-[12px] font-bold ${
                    isSelected
                      ? 'border border-[#c9d0e8] bg-[#eef2ff] text-[#1B3061] shadow-[0_1px_4px_rgba(27,48,97,0.10)]'
                      : 'text-[#4b4b57] hover:text-[#1B3061]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="dashboard-interactive inline-flex h-[45px] items-center justify-center gap-2.5 rounded-[7px] bg-[#1B3061] px-[17px] text-[14px] font-bold text-white shadow-[0_5px_11px_rgba(27,48,97,0.18)] hover:bg-[#172852]"
          >
            <Download size={17} strokeWidth={2.2} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="mt-[25px] grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCardsData.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="animate-dashboard-entry dashboard-interactive group relative flex min-h-[144px] flex-col justify-between overflow-hidden rounded-[12px] border border-[#dfe5ef] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)] hover:shadow-md"
            >
              <div
                className="absolute bottom-0 left-0 top-0 w-1 rounded-l-[12px]"
                style={{ backgroundColor: card.accentColor }}
              />

              <div className="flex items-start justify-between">
                <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#7c7b89]">
                  {card.title}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#eef2ff] text-[#1B3061]">
                  <Icon size={18} strokeWidth={2} />
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-[25px] font-bold leading-8 text-[#0d1b2f]">
                  {card.value}
                </span>
                {card.change && (
                  <span
                    className={`text-[11px] font-bold ${
                      card.isPositive ? 'text-[#00956f]' : 'text-[#ef1648]'
                    }`}
                  >
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(336px,1fr)]">
        <div>
          <div className="animate-dashboard-entry dashboard-interactive min-h-[436px] rounded-[12px] border border-[#dfe5ef] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-[22px] font-bold leading-7 text-[#0d1b2f]">
                User Segment Breakdown
              </h2>
            </div>

            <div className="mt-[23px] grid grid-cols-2 gap-[11px] lg:grid-cols-4">
              {segmentRow1Cards.map((sub) => (
                <div
                  key={sub.label}
                  className={`flex h-[96px] flex-col justify-between rounded-[8px] border px-4 py-4 transition-all ${sub.bgClass}`}
                >
                  <span className={`text-[12px] leading-4 ${sub.labelClass}`}>
                    {sub.label}
                  </span>
                  <span className={`text-[25px] font-bold leading-7 ${sub.textClass}`}>
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-[11px] lg:grid-cols-4">
              {segmentRow2Cards.map((sub) => (
                <div
                  key={sub.label}
                  className={`flex h-[96px] flex-col justify-between rounded-[8px] border px-4 py-4 transition-all ${sub.bgClass}`}
                >
                  <span className={`text-[12px] leading-4 ${sub.labelClass}`}>
                    {sub.label}
                  </span>
                  <span className={`text-[25px] font-bold leading-7 ${sub.textClass}`}>
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-[35px]">
              <h3 className="text-[19px] font-bold leading-6 text-[#0d1b2f]">
                Event Activity
              </h3>

              <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex items-center justify-between border-b border-[#dfe5ef] pb-5">
                  <div className="flex items-center gap-[14px]">
                    <Users size={21} className="text-[#7c7b89]" />
                    <span className="text-[14px] font-normal leading-5 text-[#111827]">
                      Event Registrations
                    </span>
                  </div>
                  <div className="text-[19px] font-bold leading-6 text-[#0d1b2f]">
                    12.4K
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#dfe5ef] pb-5">
                  <div className="flex items-center gap-[14px]">
                    <Ticket size={21} className="text-[#7c7b89]" />
                    <span className="text-[14px] font-normal leading-5 text-[#111827]">
                      Event Participations
                    </span>
                  </div>
                  <div className="text-[19px] font-bold leading-6 text-[#0d1b2f]">
                    9.8K
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="animate-dashboard-entry dashboard-interactive min-h-[436px] rounded-[12px] border border-[#dfe5ef] bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-[22px] font-bold leading-7 text-[#0d1b2f]">
                Gender Distribution
              </h2>

              <div className="my-[27px] flex flex-col items-center justify-center">
                <div className="relative flex h-[176px] w-[176px] items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      stroke="#c7c4d4"
                      strokeWidth="16"
                      fill="transparent"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      stroke="#1B3061"
                      strokeWidth="16"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.65)}`}
                      strokeLinecap="butt"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[32px] font-bold leading-[38px] text-[#0d1b2f]">
                      65%
                    </span>
                    <span className="text-[11px] font-bold leading-4 text-[#7c7b89]">
                      Female
                    </span>
                  </div>
                </div>

                <div className="mt-[19px] flex items-center justify-center gap-[19px]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#1B3061]" />
                    <span className="text-[14px] font-normal leading-5 text-[#4f4b55]">
                      Female (65%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#c7c4d4]" />
                    <span className="text-[14px] font-normal leading-5 text-[#4f4b55]">
                      Male (35%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-[62px] border-t border-[#dfe5ef] pt-7">
              <h3 className="text-[19px] font-bold leading-6 text-[#0d1b2f]">
                Top Regions
              </h3>

              <div className="mt-4 space-y-3.5">
                {topRegionsData.map((reg) => (
                  <div key={reg.country} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#405065]">{reg.country}</span>
                      <span className="font-bold text-[#0d1b2f]">{reg.count} ({reg.percentage}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${reg.percentage}%`, backgroundColor: reg.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
