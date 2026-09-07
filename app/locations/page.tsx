'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Map,
  MapPin,
  Pencil,
  Search,
  X,
} from 'lucide-react';
import { DashboardPageShell, DashboardPanel } from '../components';

type Country = {
  name: string;
  count: string;
  active?: boolean;
};

type Region = {
  name: string;
  count: string;
  active?: boolean;
};

type Suburb = {
  name: string;
  postcode: string;
  enabled: boolean;
};

const countries: Country[] = [
  { name: 'Australia', count: '8 states', active: true },
  { name: 'United States', count: '50 states' },
  { name: 'United Kingdom', count: '4 regions' },
  { name: 'New Zealand', count: '16 regions' },
];

const regions: Region[] = [
  { name: 'Victoria', count: '89 suburbs' },
  { name: 'New South Wales', count: '142 suburbs', active: true },
  { name: 'Queensland', count: '115 suburbs' },
  { name: 'Western Australia', count: '76 suburbs' },
  { name: 'South Australia', count: '64 suburbs' },
];

const suburbs: Suburb[] = [
  { name: 'Alexandria', postcode: '2015', enabled: true },
  { name: 'Annandale', postcode: '2038', enabled: true },
  { name: 'Balmain', postcode: '2041', enabled: false },
  { name: 'Bondi Beach', postcode: '2026', enabled: true },
  { name: 'Chatswood', postcode: '2067', enabled: true },
  { name: 'Darlinghurst', postcode: '2010', enabled: false },
];

const SearchField = ({ placeholder }: { placeholder: string }) => (
  <label className="relative block h-10">
    <Search
      aria-hidden="true"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93a0b4]"
      size={15}
      strokeWidth={2.1}
    />
    <input
      type="search"
      placeholder={placeholder}
      className="h-full w-full rounded-[7px] border border-[#dbe4ef] bg-[#fbfcfe] pl-9 pr-3 text-[12px] font-medium text-[#1f2937] outline-hidden placeholder:text-[#93a0b4] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
    />
  </label>
);

const CountBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-full bg-[#eef2f6] px-2 py-1 text-[10px] font-bold text-[#8a98ad]">
    {children}
  </span>
);

const FooterAddButton = ({ children }: { children: React.ReactNode }) => (
  <button
    type="button"
    className="flex h-12 w-full items-center justify-center gap-2 border-t border-[#e6ebf3] text-[13px] font-medium text-[#1B3061] transition-colors hover:bg-[#f8fbff]"
  >
    {children}
  </button>
);

const Toggle = ({ enabled }: { enabled: boolean }) => (
  <button
    type="button"
    aria-pressed={enabled}
    className={`relative h-6 w-11 rounded-full transition-colors ${
      enabled ? 'bg-[#20c997]' : 'bg-[#dc2626]'
    }`}
  >
    <span
      className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.2)] transition-transform ${
        enabled ? 'left-[21px]' : 'left-1'
      }`}
    />
  </button>
);

const AddSuburbModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-suburb-title"
      className="w-full max-w-[620px] overflow-hidden rounded-[10px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]"
    >
      <div className="flex h-20 items-center justify-between border-b border-[#e6ebf3] px-8">
        <h2 id="add-suburb-title" className="text-[24px] font-bold leading-8 text-[#111827]">
          Add New Suburb
        </h2>
        <button
          type="button"
          aria-label="Close add suburb modal"
          className="text-[#6b7280] transition-colors hover:text-[#111827]"
          onClick={onClose}
        >
          <X size={24} strokeWidth={2.1} />
        </button>
      </div>

      <form className="space-y-6 px-8 py-7">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="suburb-name" className="text-[15px] font-medium text-[#111827]">
              Suburb Name
            </label>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-[#1B3061] transition-colors hover:text-[#14244d]"
            >
              <MapPin size={16} strokeWidth={2.2} />
              Choose from map
            </button>
          </div>
          <input
            id="suburb-name"
            type="text"
            placeholder="e.g. Surry Hills"
            className="h-14 w-full rounded-[8px] border border-[#d7dee9] bg-white px-4 text-[17px] text-[#111827] outline-hidden placeholder:text-[#6b7280] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="suburb-postcode" className="text-[15px] font-medium text-[#111827]">
            Postcode
          </label>
          <input
            id="suburb-postcode"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2010"
            className="h-14 w-full rounded-[8px] border border-[#d7dee9] bg-white px-4 text-[17px] text-[#111827] outline-hidden placeholder:text-[#6b7280] focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="suburb-region" className="text-[15px] font-medium text-[#111827]">
            State/Region
          </label>
          <div className="relative">
            <select
              id="suburb-region"
              defaultValue=""
              className="h-14 w-full appearance-none rounded-[8px] border border-[#d7dee9] bg-white px-4 pr-11 text-[17px] text-[#111827] outline-hidden focus:border-[#1B3061] focus:ring-2 focus:ring-[#1B3061]/10"
            >
              <option value="" disabled>
                Select a state/region...
              </option>
              {regions.map((region) => (
                <option key={region.name} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
            <ChevronRight
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 rotate-90 text-[#6b7280]"
              size={20}
              strokeWidth={2.2}
            />
          </div>
        </div>
      </form>

      <div className="flex items-center justify-end gap-4 border-t border-[#e6ebf3] bg-[#f7f8fb] px-8 py-6">
        <button
          type="button"
          className="h-12 rounded-[8px] border border-[#d7dee9] bg-white px-6 text-[17px] font-medium text-[#111827] transition-colors hover:bg-[#f8fafc]"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-12 rounded-[8px] bg-[#1B3061] px-7 text-[17px] font-medium text-white shadow-[0_10px_20px_rgba(27,48,97,0.2)] transition-colors hover:bg-[#14244d]"
        >
          Add Suburb
        </button>
      </div>
    </section>
  </div>
);

const LocationsPage = () => {
  const [isAddSuburbOpen, setIsAddSuburbOpen] = useState(false);

  return (
    <DashboardPageShell contentClassName="pb-4">
      <div className="animate-dashboard-entry grid min-h-[calc(100vh-98px)] gap-6 lg:grid-cols-[280px_340px_minmax(0,1fr)]">
      <DashboardPanel className="flex min-h-[560px] min-w-0 flex-col">
        <div className="space-y-5 p-5">
          <h1 className="text-[18px] font-bold leading-6 text-[#202b3d]">Countries</h1>
          <SearchField placeholder="Search countries..." />
          <div className="space-y-1">
            {countries.map((country) => (
              <button
                key={country.name}
                type="button"
                className={`flex h-11 w-full items-center gap-3 rounded-[7px] px-3 text-left transition-colors ${
                  country.active
                    ? 'bg-[#eef2ff] text-[#14244d] shadow-[inset_3px_0_0_#1B3061]'
                    : 'text-[#596982] hover:bg-[#f8fafc]'
                }`}
              >
                <Globe2 size={16} strokeWidth={2.1} className={country.active ? 'text-[#1B3061]' : 'text-[#8a98ad]'} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{country.name}</span>
                <CountBadge>{country.count}</CountBadge>
                <ChevronRight size={14} strokeWidth={2.2} className="text-[#93a0b4]" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <FooterAddButton>+ Add New Country</FooterAddButton>
        </div>
      </DashboardPanel>

      <DashboardPanel className="flex min-h-[560px] flex-col">
        <div className="space-y-5 p-5">
          <h2 className="text-[18px] font-bold leading-6 text-[#202b3d]">States / Regions</h2>
          <SearchField placeholder="Search states..." />
          <div className="space-y-1">
            {regions.map((region) => (
              <button
                key={region.name}
                type="button"
                className={`flex h-11 w-full items-center gap-3 rounded-[7px] px-3 text-left transition-colors ${
                  region.active
                    ? 'bg-[#eef2ff] text-[#14244d] shadow-[inset_3px_0_0_#1B3061]'
                    : 'text-[#596982] hover:bg-[#f8fafc]'
                }`}
              >
                <Map size={16} strokeWidth={2.1} className={region.active ? 'text-[#1B3061]' : 'text-[#64748b]'} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{region.name}</span>
                <CountBadge>{region.count}</CountBadge>
                <ChevronRight size={14} strokeWidth={2.2} className="text-[#93a0b4]" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <FooterAddButton>+ Add New State</FooterAddButton>
        </div>
      </DashboardPanel>

      <DashboardPanel className="flex min-h-[560px] flex-col">
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[21px] font-bold leading-7 text-[#202b3d]">
                Suburbs in New South Wales
              </h2>
              <p className="mt-1 text-[13px] font-medium text-[#64748b]">
                142 suburbs registered in this state
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddSuburbOpen(true)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] bg-[#1B3061] px-4 text-[12px] font-bold text-white shadow-[0_6px_14px_rgba(27,48,97,0.18)] transition-colors hover:bg-[#14244d]"
            >
              + Add Suburb
            </button>
          </div>
          <SearchField placeholder="Search suburbs..." />
        </div>

        <div className="w-full">
          <table className="ui-table w-full table-fixed">
            <thead>
              <tr className="ui-table-head h-[42px] text-left">
                <th className="w-[33%] px-4 text-[11px] sm:px-6">Suburb Name</th>
                <th className="w-[25%] px-3 text-[11px] sm:px-6">Map View</th>
                <th className="w-[18%] px-3 text-[11px] sm:px-6">Postcode</th>
                <th className="w-[24%] px-4 text-right text-[11px] sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suburbs.map((suburb) => (
                <tr key={suburb.name} className="ui-table-row h-[58px]">
                  <td className="break-words px-4 text-[13px] font-bold text-[#1f2937] sm:px-6">{suburb.name}</td>
                  <td className="px-3 sm:px-6">
                    <button
                      type="button"
                      className="inline-flex flex-wrap items-center gap-1 text-[12px] font-bold text-[#1f2937] transition-colors hover:text-[#1B3061]"
                    >
                      View Map
                      <MapPin size={14} strokeWidth={2.3} className="text-[#64e342]" />
                    </button>
                  </td>
                  <td className="px-3 text-[13px] font-medium text-[#64748b] sm:px-6">{suburb.postcode}</td>
                  <td className="px-4 sm:px-6">
                    <div className="flex items-center justify-end gap-3">
                      <button type="button" aria-label={`Edit ${suburb.name}`} className="text-[#1B3061] hover:text-[#1B3061]">
                        <Pencil size={15} strokeWidth={2.2} />
                      </button>
                      <Toggle enabled={suburb.enabled} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#e6ebf3] px-6 py-4">
          <p className="text-[13px] text-[#64748b]">Showing 1-20 of 142</p>
          <nav className="flex items-center gap-3 text-[#64748b]" aria-label="Suburbs pagination">
            <button type="button" aria-label="Previous suburbs page" className="hover:text-[#1B3061]">
              <ChevronLeft size={15} strokeWidth={2.2} />
            </button>
            <button type="button" aria-label="Next suburbs page" className="hover:text-[#1B3061]">
              <ChevronRight size={15} strokeWidth={2.2} />
            </button>
          </nav>
        </div>
      </DashboardPanel>
      </div>
      {isAddSuburbOpen ? <AddSuburbModal onClose={() => setIsAddSuburbOpen(false)} /> : null}
    </DashboardPageShell>
  );
};

export default LocationsPage;
